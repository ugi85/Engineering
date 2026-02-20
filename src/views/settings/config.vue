<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Konfigurasi Sistem</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Konfigurasi</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <!-- Form Konfigurasi -->
          <div class="col-md-8">
            <div class="card card-primary">
              <div class="card-header">
                <h3 class="card-title"><i class="fas fa-cog mr-2"></i>Pengaturan Sistem</h3>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <!-- Sistem -->
                <div class="form-group">
                  <label>Nama Sistem</label>
                  <input 
                    v-model="draft.systemName" 
                    type="text" 
                    class="form-control" 
                    placeholder="Dashboard EEHS"
                  />
                </div>
                <div class="form-group">
                  <label>Versi Sistem</label>
                  <input 
                    v-model="draft.systemVersion" 
                    type="text" 
                    class="form-control" 
                    placeholder="2.1.0"
                  />
                </div>
                
                <!-- Perusahaan -->
                <div class="form-group">
                  <label>Nama Perusahaan</label>
                  <input 
                    v-model="draft.companyName" 
                    type="text" 
                    class="form-control" 
                    placeholder="PT. AGIS INSTRUMENT SERVICES"
                  />
                </div>
                <div class="form-group">
                  <label>Alamat Baris 1</label>
                  <input 
                    v-model="draft.addressLine1" 
                    type="text" 
                    class="form-control" 
                    placeholder="Jl. Raya Industri No. 123"
                  />
                </div>
                <div class="form-group">
                  <label>Alamat Baris 2</label>
                  <input 
                    v-model="draft.addressLine2" 
                    type="text" 
                    class="form-control" 
                    placeholder="Kawasan Industri MM2100"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label>Kota</label>
                    <input 
                      v-model="draft.city" 
                      type="text" 
                      class="form-control" 
                      placeholder="Cikarang Barat"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label>Kode Pos</label>
                    <input 
                      v-model="draft.postalCode" 
                      type="text" 
                      class="form-control" 
                      placeholder="17520"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label>Provinsi</label>
                    <input 
                      v-model="draft.province" 
                      type="text" 
                      class="form-control" 
                      placeholder="Bekasi"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label>Negara</label>
                    <input 
                      v-model="draft.country" 
                      type="text" 
                      class="form-control" 
                      placeholder="Indonesia"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label>Telepon</label>
                    <input 
                      v-model="draft.phone" 
                      type="text" 
                      class="form-control" 
                      placeholder="(021) 897-1234"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label>Email</label>
                    <input 
                      v-model="draft.email" 
                      type="email" 
                      class="form-control" 
                      placeholder="info@agis.co.id"
                    />
                  </div>
                </div>
             <!-- DUA JENIS NO. REFERENSI -->
                <div class="card card-warning mt-4">
                  <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-file-alt mr-2"></i>No. Referensi Dokumen</h3>
                    <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
                  </div>
                  <div class="card-body">
                    <div class="form-group">
                      <label>No. Referensi Daftar Alat</label>
                      <input 
                        v-model="draft.documentRefEquipment" 
                        type="text" 
                        class="form-control" 
                        placeholder="AGIS-WI-ENG-001-LD1_v5.0"
                      />
                      <small class="form-text text-muted">
                        Contoh: AGIS-WI-ENG-001-LD1_v5.0 (untuk Daftar Alat)
                      </small>
                    </div>
                    <div class="form-group">
                      <label>No. Referensi Jadwal Kalibrasi</label>
                      <input 
                        v-model="draft.documentRefCalibration" 
                        type="text" 
                        class="form-control" 
                        placeholder="AGIS-WI-ENG-016-LD1_v5.0"
                      />
                      <small class="form-text text-muted">
                        Contoh: AGIS-WI-ENG-016-LD1_v5.0 (untuk Jadwal Kalibrasi)
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              <!-- Aksi -->
            <div class="card card-secondary mt-4">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <button 
                    @click="resetConfig" 
                    class="btn btn-danger"
                    :disabled="isSaving"
                  >
                    <i class="fas fa-undo mr-1"></i>Reset Default
                  </button>
                  <button 
                    @click="confirmAndSave" 
                    class="btn btn-primary"
                    :disabled="isSaving"
                  >
                    <span v-if="isSaving">
                      <span class="spinner-border spinner-border-sm mr-1"></span>
                      Menyimpan...
                    </span>
                    <span v-else>
                      <i class="fas fa-save mr-1"></i>Simpan Perubahan
                    </span>
                  </button>
                </div>
                <div v-if="config.lastUpdated" class="mt-3 text-muted small">
                  <i class="fas fa-clock mr-1"></i>
                  Terakhir disimpan: {{ formatDate(config.lastUpdated) }}
                </div>
              </div>
            </div>
            
           
          </div>
          
          <!-- Preview & Logo -->
          <div class="col-md-4">
            <!-- Logo Upload -->
            <div class="card card-info">
              <div class="card-header">
                <h3 class="card-title"><i class="fas fa-image mr-2"></i>Logo Perusahaan</h3>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body text-center">
                <div class="logo-preview mx-auto mb-3">
                  <img 
                    :src="draftLogo || getLogoUrl" 
                    alt="Logo Preview" 
                    class="img-fluid"
                  />
                </div>
                <div class="custom-file">
                  <input 
                    type="file" 
                    class="custom-file-input" 
                    id="logoUpload" 
                    accept="image/*"
                    @change="handleLogoUpload"
                  />
                  <label class="custom-file-label" for="logoUpload">Pilih file logo (max 100KB)</label>
                </div>
                <small class="form-text text-muted mt-2">
                  Format: PNG, JPG | Maks: 100KB<br>
                  Logo disimpan di browser Anda (tidak dikirim ke server)<br>
                  <strong>Favicon akan otomatis dibuat dari logo</strong>
                </small>
                <div class="mt-3 text-center">
                  <div class="small text-muted mb-2">Preview Favicon (32x32):</div>
                  <div style="width: 32px; height: 32px; margin: 0 auto; border: 1px solid #dee2e6; border-radius: 4px; overflow: hidden;">
                    <img :src="draftLogo || getLogoUrl" alt="Favicon" style="width: 100%; height: 100%; object-fit: contain;" />
                  </div>
                </div>
                <button
                  @click="removeLogo"
                  class="btn btn-sm btn-outline-danger mt-3"
                  :disabled="!config.logoDataUrl"
                >
                  <i class="fas fa-trash mr-1"></i>Hapus Logo
                </button>
              </div>
            </div>
            
            <!-- Preview Print Header -->
            <div class="card card-success mt-4">
              <div class="card-header">
                <h3 class="card-title"><i class="fas fa-eye mr-2"></i>Preview Header Print</h3>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div 
                  class="print-preview" 
                  :style="{
                    fontFamily: draft.print.fontFamily,
                    padding: draft.print.margin,
                    overflow: 'auto',
                    maxHeight: '400px',
                    boxSizing: 'border-box'
                  }"
                >
                  <div class="preview-header" :style="{ height: draft.print.headerHeight }">
                    <div class="preview-logo" v-if="draft.print.showLogo">
                      <img :src="draftLogo || getLogoUrl" alt="Logo" style="max-height: 40px; max-width: 150px;">
                    </div>
                    <div class="preview-company">
                      <div class="preview-name" :style="{ color: '#003366', fontSize: '24px', fontWeight: 'bold' }">
                        {{ draft.companyName }}
                      </div>
                      <div 
                        class="preview-address" 
                        v-if="draft.print.showAddress"
                        v-html="getFullAddress"
                        style="font-size: 14px; color: #555; line-height: 1.4; margin-top: 5px;"
                      ></div>
                    </div>
                    <div 
                      class="preview-ref" 
                      v-if="draft.print.showDocumentRef"
                      :style="{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: '#0056b3',
                        marginTop: '10px'
                      }"
                    >
                      No. Reff: {{ draft.documentRef }}
                    </div>
                  </div>
                </div>
                <small class="form-text text-muted mt-3">
                  Preview ini menunjukkan bagaimana header akan tampil saat dicetak
                </small>
              </div>
            </div>

             <div class="card card-warning mt-4">
              <div class="card-header">
                <h3 class="card-title"><i class="fas fa-print mr-2"></i>Pengaturan Print</h3>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <label>Orientasi Kertas</label>
                  <select v-model="config.print.orientation" class="form-control">
                    <option value="portrait">Portrait (Tegak)</option>
                    <option value="landscape">Landscape (Mendatar)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Margin Kertas</label>
                  <select v-model="config.print.margin" class="form-control">
                    <option value="5mm">5mm (Sempit)</option>
                    <option value="10mm" selected>10mm (Normal)</option>
                    <option value="15mm">15mm (Lebar)</option>
                    <option value="20mm">20mm (Sangat Lebar)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tinggi Header</label>
                  <select v-model="config.print.headerHeight" class="form-control">
                    <option value="20mm">20mm (Kecil)</option>
                    <option value="25mm">25mm (Sedang)</option>
                    <option value="30mm" selected>30mm (Besar)</option>
                    <option value="35mm">35mm (Sangat Besar)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Font untuk Print</label>
                  <select v-model="config.print.fontFamily" class="form-control">
                    <option value="'Arial', sans-serif">Arial (Default)</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Calibri', sans-serif">Calibri</option>
                    <option value="'Segoe UI', sans-serif">Segoe UI</option>
                  </select>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input 
                      v-model="config.print.showLogo" 
                      class="form-check-input" 
                      type="checkbox" 
                      id="showLogo"
                    >
                    <label class="form-check-label" for="showLogo">
                      Tampilkan Logo di Header
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input 
                      v-model="config.print.showAddress" 
                      class="form-check-input" 
                      type="checkbox" 
                      id="showAddress"
                    >
                    <label class="form-check-label" for="showAddress">
                      Tampilkan Alamat di Header
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input 
                      v-model="config.print.showDocumentRef" 
                      class="form-check-input" 
                      type="checkbox" 
                      id="showDocumentRef"
                    >
                    <label class="form-check-label" for="showDocumentRef">
                      Tampilkan Nomor Referensi Dokumen
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
          
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFrontendConfig } from '@/composables/useConfig'

const {
  config,
  isSaving,
  previewLogo,
  getLogoUrl,
  getFullAddress,
  saveConfig,
  resetConfig,
  loadConfig,
  updateLogo
} = useFrontendConfig()

// local draft object used by the form; changes here are not reflected globally
const draft = ref({ ...config.value })
const draftLogo = ref(previewLogo.value)
const isSavingLocal = ref(false) // Flag untuk mencegah watch trigger saat save

// keep draft in sync when config is externally updated (bukan dari save lokal)
watch(config, (newVal) => {
  if (isSavingLocal.value) {
    return
  }
  draft.value = { ...newVal }
  draftLogo.value = previewLogo.value
}, { deep: true })

// ✅ GENERATE FAVICON FROM IMAGE
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
    // ✅ HANYA update draft, JANGAN update config di sini
    // Config akan di-update di confirmAndSave saat flag isSavingLocal=true
    draft.value.faviconDataUrl = faviconDataUrl
    // Update favicon immediately di browser
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      document.head.appendChild(link)
    }
    link.href = faviconDataUrl
  }
  img.src = dataUrl
}



// ✅ HANDLE UPLOAD LOGO with confirmation
const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Gagal Upload!',
        text: 'File harus berupa gambar (PNG, JPG, SVG)',
        confirmButtonText: 'OK'
      })
    }
    return
  }
  if (file.size > 100 * 1024) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Gagal Upload!',
        text: 'Ukuran logo maksimal 100KB',
        confirmButtonText: 'OK'
      })
    }
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target.result
    if (window.Swal) {
      window.Swal.fire({
        title: 'Konfirmasi Logo',
        html: `<img src="${dataUrl}" style="max-width:200px;max-height:100px;display:block;margin:0 auto;"/><p class=\"mt-2\">Gunakan logo ini?</p>`,
        showCancelButton: true,
        confirmButtonText: 'Ya, gunakan',
        cancelButtonText: 'Batal',
        width: 400
      }).then((result) => {
        if (result.isConfirmed) {
          // ✅ Update draft untuk preview di form
          draftLogo.value = dataUrl
          draft.value.logoDataUrl = dataUrl
          // ✅ Generate favicon dari logo
          generateFaviconFromImage(dataUrl)
        }
      })
    }
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

// ✅ HAPUS LOGO with confirmation
const removeLogo = () => {
  if (window.Swal) {
    window.Swal.fire({
      icon: 'warning',
      title: 'Hapus logo?',
      text: 'Logo dan favicon yang telah disimpan akan dihapus.',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        draft.value.logoDataUrl = null
        draft.value.faviconDataUrl = null
        draftLogo.value = null
        config.value.logoDataUrl = null
        config.value.faviconDataUrl = null
        previewLogo.value = null
        // Kembalikan favicon ke default
        let link = document.querySelector("link[rel~='icon']")
        if (link) {
          link.href = '/favicon.ico'
        }
        saveConfig()
      }
    })
  }
}

// ✅ FORMAT TANGGAL
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ✅ CONFIRM AND APPLY DRAFT
const confirmAndSave = () => {
  if (window.Swal) {
    window.Swal.fire({
      title: 'Simpan perubahan?',
      text: 'Perubahan akan diterapkan dan langsung terlihat dalam aplikasi.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, simpan',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        // ✅ Set flag PERTAMA untuk mencegah watch trigger
        isSavingLocal.value = true
        
        // ✅ Update logoDataUrl dari draft
        draft.value.logoDataUrl = draftLogo.value
        
        // ✅ Update config dari draft (termasuk faviconDataUrl yang sudah di-generate)
        Object.keys(draft.value).forEach(key => {
          config.value[key] = draft.value[key]
        })
        
        // ✅ Update previewLogo di composable
        if (draftLogo.value) {
          previewLogo.value = draftLogo.value
        }
        
        // ✅ Simpan ke localStorage (saveConfig akan update favicon juga)
        saveConfig()
        
        // ✅ Reset flag setelah save selesai
        isSavingLocal.value = false
      } else {
        // revert draft back to current config
        draft.value = { ...config.value }
        draftLogo.value = previewLogo.value
      }
    })
  } else {
    // fallback without confirmation
    isSavingLocal.value = true
    draft.value.logoDataUrl = draftLogo.value
    Object.keys(draft.value).forEach(key => {
      config.value[key] = draft.value[key]
    })
    if (draftLogo.value) {
      previewLogo.value = draftLogo.value
    }
    saveConfig()
    isSavingLocal.value = false
  }
}

</script>

<style scoped>
.logo-preview {
  width: 180px;
  height: 80px;
  background-color: #f8f9fa;
  border: 2px dashed #ced4da;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0 auto;
}

.logo-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.print-preview {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
}

.preview-header {
  border-bottom: 2px solid #0056b3;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.preview-logo {
  margin-bottom: 10px;
}

.preview-company {
  text-align: center;
}

.preview-name {
  margin-bottom: 5px;
}

.preview-address {
  white-space: pre-line;
}

.preview-ref {
  text-align: center;
  width: 100%;
}

.custom-file-label::after {
  content: "Pilih";
}
</style>