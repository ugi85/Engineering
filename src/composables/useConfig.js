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

  logoDataUrl: null, // null = gunakan logo default
  faviconDataUrl: null, // null = gunakan favicon default
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

const CONFIG_KEY = 'qms_frontend_config_v2' // Versi diperbarui

// singleton reactive state shared across all imports
const config = ref({ ...DEFAULT_CONFIG })
const isSaving = ref(false)
const previewLogo = ref(null)

// helpers are defined once and refer to shared state
const loadConfig = () => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      config.value = { ...DEFAULT_CONFIG, ...parsed }
      if (config.value.logoDataUrl) {
        previewLogo.value = config.value.logoDataUrl
      }
      // ✅ Terapkan favicon jika ada
      if (config.value.faviconDataUrl) {
        updateFavicon(config.value.faviconDataUrl)
      }
    }
  } catch (e) {
    config.value = { ...DEFAULT_CONFIG }
  }
}

const saveConfig = () => {
  isSaving.value = true
  try {
    config.value.lastUpdated = new Date().toISOString()
    // ✅ Update previewLogo sebelum save
    if (config.value.logoDataUrl) {
      previewLogo.value = config.value.logoDataUrl
    }
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config.value))
    // ✅ Terapkan favicon jika ada
    if (config.value.faviconDataUrl) {
      updateFavicon(config.value.faviconDataUrl)
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
        text: 'LocalStorage penuh atau tidak tersedia.',
        confirmButtonText: 'OK'
      })
    }
    return false
  } finally {
    isSaving.value = false
  }
}

// ✅ Fungsi untuk update logo dan favicon secara terpusat
const updateLogo = (logoDataUrl) => {
  config.value.logoDataUrl = logoDataUrl
  if (logoDataUrl) {
    previewLogo.value = logoDataUrl
    // Generate favicon dari logo
    generateFaviconFromImage(logoDataUrl)
  }
}

const uploadLogo = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (PNG, JPG, SVG)'))
      return
    }
    if (file.size > 100 * 1024) {
      reject(new Error('Ukuran logo maksimal 100KB'))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      previewLogo.value = e.target.result
      config.value.logoDataUrl = e.target.result
      // ✅ Generate favicon dari logo
      generateFaviconFromImage(e.target.result)
      saveConfig()
      resolve(e.target.result)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

// ✅ Generate favicon dari logo (resize ke 32x32)
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
const updateFavicon = (dataUrl) => {
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    document.head.appendChild(link)
  }
  link.href = dataUrl
  console.log('Favicon updated:', dataUrl)
}

const resetConfig = () => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        config.value = { ...DEFAULT_CONFIG }
        previewLogo.value = null
        localStorage.removeItem(CONFIG_KEY)
        // ✅ Kembalikan favicon ke default
        updateFavicon('/favicon.ico')
        saveConfig()
      }
    })
  }
}

const getLogoUrl = computed(() => {
  return config.value.logoDataUrl || '/logo/agis-logo.png'
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

// initialize once when module is loaded
if (typeof window !== 'undefined') {
  loadConfig()
}

export function useFrontendConfig() {
  return {
    // State
    config,
    isSaving,
    previewLogo,

    // Computed
    getLogoUrl,
    getFullAddress,

    // Actions
    saveConfig,
    uploadLogo,
    resetConfig,
    loadConfig,
    updateLogo // ✅ Fungsi baru untuk update logo
  }
}