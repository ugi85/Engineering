// src/composables/useConfig.js
import { ref, computed } from 'vue'
import { configApi } from '@/api/configApi'

// ✅ DEFAULT CONFIG
const DEFAULT_CONFIG = {
  systemName: 'EeHS Board',
  systemVersion: '1.0',
  companyName: 'PT Anugrah Amartha Global',
  addressLine1: 'Jl. Raya Industri No. 123',
  addressLine2: 'Kawasan Industri MM2100',
  city: 'Cikarang Barat',
  postalCode: '17520',
  province: 'Bekasi',
  country: 'Indonesia',
  phone: '(021) 897-1234',
  email: 'info@agis.co.id',

  // ✅ 2 JENIS NO. REFERENSI
  documentRefEquipment: 'AGIS-WI-ENG-001-LD1_v5.0',
  documentRefCalibration: 'AGIS-WI-ENG-016-LD1_v5.0',

  logoUrl: '',
  faviconUrl: '',
  logoDataUrl: '',
  faviconDataUrl: '',
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

const CONFIG_KEY = 'qms_frontend_config_v2'

// Auto-refresh interval (dalam milliseconds)
const AUTO_REFRESH_INTERVAL = 30000 // 30 detik

// singleton reactive state
const config = ref({ ...DEFAULT_CONFIG })
const isSaving = ref(false)
const previewLogo = ref(null)
const isLoading = ref(false)
let refreshInterval = null

// ✅ Mapping key dari Google Sheet ke format config frontend
const SHEET_TO_FRONTEND_MAPPING = {
  'nama sistem': 'systemName',
  'versi sistem': 'systemVersion',
  'nama perusahaan': 'companyName',
  'noref daftaralat': 'documentRefEquipment',
  'noref kalibrasi': 'documentRefCalibration',
  'logo sistem': 'logoUrl',
  'logo perusahaan': 'logoPerusahaanUrl',
  'favicon': 'faviconUrl'
}

// ✅ Mapping dari frontend ke Google Sheet
const FRONTEND_TO_SHEET_MAPPING = {}
Object.keys(SHEET_TO_FRONTEND_MAPPING).forEach(sheetKey => {
  FRONTEND_TO_SHEET_MAPPING[SHEET_TO_FRONTEND_MAPPING[sheetKey]] = sheetKey
})

// ✅ Transform data dari sheet ke format frontend
function transformSheetToFrontend(sheetData) {
  const frontendData = {}
  
  Object.keys(SHEET_TO_FRONTEND_MAPPING).forEach(sheetKey => {
    const frontendKey = SHEET_TO_FRONTEND_MAPPING[sheetKey]
    if (sheetData[sheetKey] !== undefined) {
      frontendData[frontendKey] = sheetData[sheetKey]
    }
  })
  
  return frontendData
}

// ✅ Transform data dari frontend ke format sheet
function transformFrontendToSheet(frontendData) {
  const sheetData = {}
  
  Object.keys(FRONTEND_TO_SHEET_MAPPING).forEach(frontendKey => {
    const sheetKey = FRONTEND_TO_SHEET_MAPPING[frontendKey]
    if (frontendData[frontendKey] !== undefined) {
      sheetData[sheetKey] = frontendData[frontendKey]
    }
  })
  
  return sheetData
}

// ✅ Load config dari Google Sheets
const loadConfig = async (silent = false) => {
  if (!silent) {
    isLoading.value = true
  }
  
  try {
    if (!silent) {
      console.log('[useConfig] Loading config from Google Sheets...')
    }
    
    // Load dari API
    const sheetData = await configApi.getConfig()
    
    if (!silent) {
      console.log('[useConfig] Raw data from Sheets:', sheetData)
      console.log('[useConfig] logo sistem dari sheet:', sheetData['logo sistem'])
      console.log('[useConfig] favicon dari sheet:', sheetData['favicon'])
    }

    // Transform ke format frontend
    const frontendConfig = transformSheetToFrontend(sheetData)
    
    if (!silent) {
      console.log('[useConfig] Transformed config:', frontendConfig)
      console.log('[useConfig] logoUrl setelah transform:', frontendConfig.logoUrl)
    }
    
    // Cek apakah ada perubahan
    const hasChanges = JSON.stringify(config.value) !== JSON.stringify({ ...DEFAULT_CONFIG, ...frontendConfig })
    
    config.value = { ...DEFAULT_CONFIG, ...frontendConfig }
    
    if (!silent) {
      console.log('[useConfig] Final config:', config.value)
      console.log('[useConfig] Final logoUrl:', config.value.logoUrl ? 'ADA' : 'KOSONG')
      console.log('[useConfig] Has changes:', hasChanges)
    }

    // Set preview logo
    const logoValue = config.value.logoUrl || config.value.logoDataUrl
    if (logoValue) {
      previewLogo.value = logoValue
      if (!silent) {
        console.log('[useConfig] Logo loaded, length:', logoValue.length)
        console.log('[useConfig] Logo preview:', logoValue.substring(0, 50) + '...')
      }
      updateFavicon(logoValue)
    } else {
      if (!silent) {
        console.log('[useConfig] No logo found in config!')
      }
    }

    // Backup to localStorage
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config.value))
    if (!silent) {
      console.log('[useConfig] Config backed up to localStorage')
    }
    
    return hasChanges
  } catch (error) {
    console.error('[useConfig] Error loading config from Google Sheets:', error)

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(CONFIG_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        config.value = { ...DEFAULT_CONFIG, ...parsed }
        if (!silent) {
          console.log('[useConfig] Loaded from localStorage fallback')
        }

        if (config.value.logoDataUrl || config.value.logoUrl) {
          previewLogo.value = config.value.logoDataUrl || config.value.logoUrl
          updateFavicon(config.value.faviconDataUrl || config.value.faviconUrl || config.value.logoDataUrl || config.value.logoUrl)
        }
      } else {
        if (!silent) {
          console.log('[useConfig] No localStorage fallback, using default')
        }
        config.value = { ...DEFAULT_CONFIG }
      }
    } catch (localError) {
      console.error('[useConfig] LocalStorage fallback also failed:', localError)
      config.value = { ...DEFAULT_CONFIG }
    }
    
    return false
  } finally {
    if (!silent) {
      isLoading.value = false
      console.log('[useConfig] Load complete. isLoading:', isLoading.value)
      console.log('[useConfig] Final previewLogo:', previewLogo.value ? 'ADA' : 'KOSONG')
    }
  }
}

// ✅ Start auto-refresh config
const startAutoRefresh = () => {
  if (refreshInterval) {
    console.log('[useConfig] Auto-refresh already running')
    return
  }
  
  console.log('[useConfig] Starting auto-refresh every', AUTO_REFRESH_INTERVAL / 1000, 'seconds')
  
  refreshInterval = setInterval(async () => {
    console.log('[useConfig] Auto-refreshing config...')
    const hasChanges = await loadConfig(true) // silent = true
    if (hasChanges) {
      console.log('[useConfig] Config changed, UI updated')
    }
  }, AUTO_REFRESH_INTERVAL)
}

// ✅ Stop auto-refresh
const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
    console.log('[useConfig] Auto-refresh stopped')
  }
}

// ✅ Manual refresh
const refreshConfig = async () => {
  console.log('[useConfig] Manual refresh triggered')
  return await loadConfig(false)
}

// ✅ Save config ke Google Sheets
const saveConfig = async () => {
  isSaving.value = true
  try {
    config.value.lastUpdated = new Date().toISOString()

    // Update previewLogo
    if (config.value.logoUrl || config.value.logoDataUrl) {
      previewLogo.value = config.value.logoUrl || config.value.logoDataUrl
    }

    // Transform config ke format sheet
    const sheetData = transformFrontendToSheet(config.value)

    // Save via API
    const result = await configApi.setConfig(sheetData)

    // Update favicon
    if (config.value.faviconUrl || config.value.faviconDataUrl) {
      updateFavicon(config.value.faviconUrl || config.value.faviconDataUrl)
    }

    // Backup to localStorage
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config.value))

    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message || 'Konfigurasi sistem berhasil disimpan',
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

// ✅ Upload logo ke Google Drive
const uploadLogo = async (file, deskripsi = 'logo sistem') => {
  try {
    const result = await configApi.uploadLogo(file, deskripsi)
    const fileUrl = result.data.fileUrl

    console.log('[useConfig] Logo uploaded:', fileUrl.substring(0, 50) + '...')
    console.log('[useConfig] Deskripsi:', deskripsi)

    // Update config HANYA field yang sesuai dengan deskripsi
    if (deskripsi === 'logo sistem') {
      config.value.logoUrl = fileUrl
      config.value.logoDataUrl = fileUrl
      previewLogo.value = fileUrl
      
      // Generate favicon hanya untuk logo sistem
      await generateFaviconFromUrl(fileUrl)
      console.log('[useConfig] Favicon generated')
    } else if (deskripsi === 'logo perusahaan') {
      config.value.logoPerusahaanUrl = fileUrl
      config.value.logoPerusahaanDataUrl = fileUrl
      console.log('[useConfig] Logo perusahaan updated, favicon NOT changed')
    }

    console.log('[useConfig] Logo save completed')

    return {
      logoUrl: fileUrl,
      faviconUrl: config.value.faviconUrl
    }
  } catch (error) {
    console.error('Error uploading logo:', error)
    throw error
  }
}

// ✅ Generate favicon dari URL
const generateFaviconFromUrl = async (url) => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    img.crossOrigin = 'anonymous'  // Penting untuk Google Drive URL
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, 32, 32)
      const faviconDataUrl = canvas.toDataURL('image/png')
      config.value.faviconUrl = faviconDataUrl
      config.value.faviconDataUrl = faviconDataUrl
      updateFavicon(faviconDataUrl)
      console.log('[useConfig] Favicon generated from Google Drive URL')
    }
    img.onerror = (err) => {
      console.error('[useConfig] Failed to load image from URL:', url, err)
      // Fallback: gunakan URL langsung
      config.value.faviconUrl = url
      config.value.faviconDataUrl = url
      updateFavicon(url)
    }
    img.src = url
  } catch (error) {
    console.error('[useConfig] Error generating favicon:', error)
  }
}

// ✅ Delete logo
const deleteLogo = async () => {
  try {
    config.value.logoUrl = null
    config.value.faviconUrl = null
    config.value.logoDataUrl = null
    config.value.faviconDataUrl = null
    previewLogo.value = null
    updateFavicon('/favicon.ico')

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
    generateFaviconFromImage(logoDataUrl)
  }
}

// ✅ Generate favicon from image
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

        localStorage.removeItem(CONFIG_KEY)
        updateFavicon('/favicon.ico')
        await saveConfig()
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
  startAutoRefresh() // Start auto-refresh
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
    refreshConfig,      // NEW: Manual refresh
    startAutoRefresh,   // NEW: Start auto-refresh
    stopAutoRefresh,    // NEW: Stop auto-refresh
    updateLogo,
    updateFavicon
  }
}
