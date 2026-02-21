// src/composables/useFrontendConfig.js
import { ref, computed, onMounted } from 'vue'

// ✅ DEFAULT CONFIG DENGAN 2 JENIS NO. REFERENSI
const DEFAULT_CONFIG = {
  systemName: 'AGIS QMS',
  systemVersion: '2.1.0',
  companyName: 'PT. AGIS INSTRUMENT SERVICES',
  addressLine1: 'Jl. Raya Industri No. 123',
  addressLine2: 'Kawasan Industri MM2100',
  city: 'Cikarang Barat',
  postalCode: '17520',
  province: 'Bekasi',
  country: 'Indonesia',
  phone: '(021) 897-1234',
  email: 'info@agis.co.id',

  // ✅ 2 JENIS NO. REFERENSI
  documentRefEquipment: 'AGIS-WI-ENG-001-LD1_v5.0', // Untuk Daftar Alat
  documentRefCalibration: 'AGIS-WI-ENG-016-LD1_v5.0', // Untuk Jadwal Kalibrasi

  logoUrl: null, // URL dari Vercel Blob
  faviconUrl: null, // URL dari Vercel Blob
  logoDataUrl: null, // Fallback untuk local preview (base64)
  faviconDataUrl: null, // Fallback untuk local preview (base64)
  print: {
    orientation: 'landscape',
    margin: '10mm',
    headerHeight: '30mm',
    showLogo: true,
    showAddress: true,
    showDocumentRef: true,
    fontFamily: 'Arial, sans-serif'
  },
  lastUpdated: null
}

const CONFIG_KEY = 'qms_frontend_config_v2' // For fallback only
const API_BASE = '/api'

// singleton reactive state shared across all imports
const config = ref({ ...DEFAULT_CONFIG })
const isSaving = ref(false)
const previewLogo = ref(null)
const isLoading = ref(false)

// ✅ Load config from API
const loadConfig = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${API_BASE}/config`)
    if (!response.ok) {
      throw new Error('Failed to load config')
    }
    const data = await response.json()
    config.value = { ...DEFAULT_CONFIG, ...data }
    
    // Set preview logo
    if (config.value.logoUrl) {
      previewLogo.value = config.value.logoUrl
      updateFavicon(config.value.faviconUrl || config.value.logoUrl)
    }
  } catch (error) {
    console.error('Error loading config from API, trying localStorage fallback:', error)
    
    // Fallback to localStorage if API fails (for development)
    try {
      const stored = localStorage.getItem(CONFIG_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        config.value = { ...DEFAULT_CONFIG, ...parsed }
        if (config.value.logoDataUrl) {
          previewLogo.value = config.value.logoDataUrl
        }
        if (config.value.faviconDataUrl) {
          updateFavicon(config.value.faviconDataUrl)
        }
      }
    } catch (localError) {
      console.error('LocalStorage fallback also failed:', localError)
      config.value = { ...DEFAULT_CONFIG }
    }
  } finally {
    isLoading.value = false
  }
}

// ✅ Save config to API
const saveConfig = async () => {
  isSaving.value = true
  try {
    config.value.lastUpdated = new Date().toISOString()
    
    // Update previewLogo before save
    if (config.value.logoUrl || config.value.logoDataUrl) {
      previewLogo.value = config.value.logoUrl || config.value.logoDataUrl
    }
    
    // Save to API
    const response = await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config.value)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to save config')
    }
    
    // Update favicon
    if (config.value.faviconUrl || config.value.faviconDataUrl) {
      updateFavicon(config.value.faviconUrl || config.value.faviconDataUrl)
    }
    
    // Fallback: also save to localStorage for development
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config.value))
    } catch (e) {
      console.log('Could not save to localStorage')
    }
    
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Konfigurasi sistem berhasil disimpan',
        timer: 1500,
        showConfirmButton: false
      })
    }
    return true
  } catch (e) {
    console.error('Gagal simpan config:', e)
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Gagal Simpan!',
        text: e.message || 'Terjadi kesalahan saat menyimpan konfigurasi',
        confirmButtonText: 'OK'
      })
    }
    return false
  } finally {
    isSaving.value = false
  }
}

// ✅ Upload logo to API
const uploadLogo = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (PNG, JPG, SVG)'))
      return
    }
    if (file.size > 100 * 1024) {
      reject(new Error('Ukuran logo maksimal 100KB'))
      return
    }
    
    const formData = new FormData()
    formData.append('logo', file)
    
    fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error) })
      }
      return response.json()
    })
    .then(data => {
      config.value.logoUrl = data.logoUrl
      config.value.faviconUrl = data.faviconUrl
      previewLogo.value = data.logoUrl
      updateFavicon(data.faviconUrl)
      resolve(data)
    })
    .catch(error => reject(error))
  })
}

// ✅ Delete logo from API
const deleteLogo = async () => {
  try {
    const logoUrl = config.value.logoUrl
    const faviconUrl = config.value.faviconUrl
    
    // Call API to delete from blob storage
    if (logoUrl || faviconUrl) {
      await fetch(`${API_BASE}/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logoUrl, faviconUrl })
      })
    }
    
    config.value.logoUrl = null
    config.value.faviconUrl = null
    config.value.logoDataUrl = null
    config.value.faviconDataUrl = null
    previewLogo.value = null
    updateFavicon('/favicon.ico')
    
    // Save the change
    await saveConfig()
    
    return true
  } catch (error) {
    console.error('Error deleting logo:', error)
    throw error
  }
}

// ✅ Update logo (helper)
const updateLogo = (logoDataUrl) => {
  config.value.logoDataUrl = logoDataUrl
  if (logoDataUrl) {
    previewLogo.value = logoDataUrl
    // Generate favicon from logo
    generateFaviconFromImage(logoDataUrl)
  }
}

// ✅ Generate favicon from image (client-side fallback)
const generateFaviconFromImage = (dataUrl) => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')

  const img = new Image()
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, 32, 32)
    const faviconDataUrl = canvas.toDataURL('image/png')
    config.value.faviconDataUrl = faviconDataUrl
    updateFavicon(faviconDataUrl)
  }
  img.src = dataUrl
}

// ✅ Update favicon di browser
const updateFavicon = (url) => {
  if (!url) return
  
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    document.head.appendChild(link)
  }
  link.href = url
  console.log('Favicon updated:', url)
}

// ✅ Reset config
const resetConfig = async () => {
  if (typeof window !== 'undefined' && window.Swal) {
    window.Swal.fire({
      title: 'Reset Konfigurasi?',
      text: 'Semua pengaturan akan dikembalikan ke nilai default.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Reset!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        config.value = { ...DEFAULT_CONFIG }
        previewLogo.value = null
        
        // Delete logo from blob storage if exists
        if (config.value.logoUrl) {
          try {
            await deleteLogo()
          } catch (error) {
            console.error('Error deleting logo:', error)
          }
        }
        
        // Save reset config
        await saveConfig()
        
        // Clear localStorage
        localStorage.removeItem(CONFIG_KEY)
        
        // Reset favicon
        updateFavicon('/favicon.ico')
      }
    })
  }
}

const getLogoUrl = computed(() => {
  return config.value.logoUrl || config.value.logoDataUrl || '/logo/agis-logo.png'
})

const getFullAddress = computed(() => {
  const parts = [
    config.value.addressLine1,
    config.value.addressLine2,
    `${config.value.city}, ${config.value.province} ${config.value.postalCode}`,
    config.value.country
  ].filter(Boolean)
  return parts.join('<br>')
})

// Initialize on module load
if (typeof window !== 'undefined') {
  loadConfig()
}

export function useFrontendConfig() {
  return {
    // State
    config,
    isSaving,
    previewLogo,
    isLoading,

    // Computed
    getLogoUrl,
    getFullAddress,

    // Actions
    saveConfig,
    uploadLogo,
    deleteLogo,
    resetConfig,
    loadConfig,
    updateLogo,
    updateFavicon
  }
}
