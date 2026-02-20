<script setup>
import { ref, onMounted } from 'vue'
import { useLogAktivitas } from '@/composables/useLogAktivitas'
import { logAktivitasApi } from '@/api/logAktivitas' // ✅ IMPORT API LANGSUNG
import { printService } from '@/services/printService'

const { 
  loading, 
  logs,
  selectedMonth,
  selectedYear,
  filterType,
  fetchData
} = useLogAktivitas()

// ✅ SET FILTER TYPE KE KALIBRASI SAJA
filterType.value = 'kalibrasi'

// State untuk tracking
const dataLoaded = ref(false)
const savingRows = ref(new Set()) // ✅ UNTUK TRACKING PER-BARIS SAJA

// Daftar bulan
const months = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' }
]

// Tahun untuk dropdown
const years = ['2025', '2026', '2027', '2028', '2029', '2030']

// ✅ FUNGSI FORMAT TANGGAL SAMA DENGAN LOG PM
function formatDateDisplay(dateString) {
  if (!dateString) return ''
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }
  
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
  } catch (e) {
    // Ignore error
  }
  
  return dateString
}

const handleSearch = async () => {
  if (!selectedMonth.value || !selectedYear.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Peringatan!',
      text: 'Pilih bulan dan tahun terlebih dahulu',
      confirmButtonText: 'OK'
    })
    return
  }
  
  dataLoaded.value = true
  loading.value = true
  
  try {
    await fetchData()
    
    if (logs.value.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Informasi',
        text: `Tidak ada data kalibrasi untuk ${selectedMonth.value} ${selectedYear.value}`,
        confirmButtonText: 'OK'
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.message || 'Gagal memuat data kalibrasi',
      confirmButtonText: 'OK'
    })
  } finally {
    loading.value = false
  }
}

// print helper – simple browser print of current view
const printDate = ref('')
const handlePrint = () => {
  printService.printKalibrasiLogs(logs.value, selectedMonth.value, selectedYear.value)
  if (!dataLoaded.value || logs.value.length === 0) return

  // prepare header information
  const now = new Date()
  printDate.value = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`

  window.print()
}

// ✅ PERBAIKAN UTAMA: SIMPAN LANGSUNG VIA API (TANPA LEWAT COMPOSABLE)
const saveToLogAktivitas = async (row) => {
  if (!row.pic || !row.execute_date || !row.ket?.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Peringatan!',
      text: 'PIC, Execute Date, dan Keterangan wajib diisi',
      confirmButtonText: 'OK'
    })
    return
  }

  const rowKey = `${row['No.ID']}_${row['Calibration Id.']}`
  if (savingRows.value.has(rowKey)) return
  
  savingRows.value.add(rowKey) // ✅ HANYA BLOCK BUTTON INI
  
  try {
    // ✅ LANGSUNG PANGGIL API (TANPA LEWAT COMPOSABLE)
    await logAktivitasApi.createLog({
      no_id: row['No.ID'],
      cal_id: row['Calibration Id.'],
      jenis: 'Kalibrasi',
      tanggal: row.execute_date,
      petugas: row.pic,
      keterangan: row.ket
    })
    
    // ✅ UPDATE STATUS LANGSUNG DI UI (TANPA REFRESH)
    row.status = 'Selesai'
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data kalibrasi berhasil disimpan',
      timer: 1200,
      showConfirmButton: false
    })
    
    // ❌ TIDAK ADA: loading.value, fetchData(), atau setTimeout
    
  } catch (error) {
    console.error('❌ Gagal simpan:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.message || 'Gagal menyimpan data kalibrasi',
      confirmButtonText: 'OK'
    })
  } finally {
    savingRows.value.delete(rowKey) // ✅ HANYA UNBLOCK BUTTON INI
  }
}

const preventFormSubmit = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
  }
}

onMounted(() => {
  selectedMonth.value = 'January'
  selectedYear.value = new Date().getFullYear().toString()
})
</script>

<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="mb-0">Data Log Kalibrasi</h1>
          <span class="badge badge-info no-print">
            Total: {{ logs.length }} data
          </span>
        </div>
        
        <div class="row no-print">
          <div class="col-md-3">
            <label class="font-weight-bold mb-2">Pilih Bulan:</label>
            <select v-model="selectedMonth" class="form-control" :disabled="loading">
              <option value="">-- Pilih Bulan --</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
          
          <div class="col-md-2">
            <label class="font-weight-bold mb-2">Pilih Tahun:</label>
            <select v-model="selectedYear" class="form-control" :disabled="loading">
              <option value="">-- Pilih Tahun --</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <div class="col-md-2 d-flex align-items-end">
            <button @click="handleSearch" :disabled="!selectedMonth || !selectedYear || loading" class="btn btn-secondary">
              <i class="fas fa-search mr-1"></i>
              <span v-if="loading">Loading...</span>
              <span v-else>Cari Data</span>
            </button>
          </div>
          <div class="col-md-5 d-flex align-items-end justify-content-end">
            <button
              class="btn btn-primary"
              :disabled="!dataLoaded || logs.length === 0"
              @click="handlePrint"
              title="Cetak halaman"
            >
              <i class="fas fa-print mr-1"></i>Print
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <!-- print-only big header -->
        <div class="print-header d-none">
          <div class="company-logo">AGIS</div>
          <div class="company-name">PT. AGIS INSTRUMENT SERVICES</div>
          <div class="company-address">Jl. Raya Industri No. 123, Kawasan Industri MM2100</div>
          <div class="company-address">Cikarang Barat, Bekasi 17520 - Indonesia</div>
          <div class="company-address">Telp: (021) 897-1234 | Email: info@agis.co.id</div>
          <h1 class="report-title">LAPORAN LOG KALIBRASI</h1>
          <div class="report-subtitle">No. Reff: AGIS-WI-ENG-016-LD1_v5.0</div>
          <div class="report-period">
            Periode: {{ selectedMonth }} {{ selectedYear }}
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div v-if="!dataLoaded" class="text-center py-5">
              <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
              <p class="text-muted mt-3">Pilih bulan dan tahun, lalu klik "Cari Data"</p>
            </div>

            <!-- ✅ HAPUS KONDISI LOADING GLOBAL - TIDAK DIPERLUKAN LAGI -->
            <!-- <div v-else-if="loading" class="text-center py-4"> ... </div> -->

            <div v-else-if="logs.length > 0">
              <div class="table-responsive">
                <table class="table table-bordered table-hover table-sm">
                  <thead class="thead-light">
                    <tr>
                      <th style="width: 5%">No</th>
                      <th style="width: 10%">No.ID</th>
                      <th style="width: 15%">Description</th>
                      <th style="width: 12%">Calibration ID</th>
                      <th style="width: 10%">Parameter</th>
                      <th style="width: 10%">Proses Range</th>
                      <th style="width: 10%">Reject limit</th>
                      <th style="width: 8%">Due Date</th>
                      <th style="width: 10%">PIC</th>
                      <th style="width: 12%">Execute Date</th>
                      <th style="width: 15%">Keterangan</th>
                      <th style="width: 8%">Status</th>
                      <th style="width: 5%">Aksi</th>
                    </tr>  
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in logs" :key="`kalibrasi-${index}`" :class="{'table-success': row.status === 'Selesai'}">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td>{{ row['No.ID'] }}</td>
                      <td>{{ row.Description }}</td>
                      <td>{{ row['Calibration Id.'] }}</td>
                      <td>{{ row.Parameter }}</td>
                      <td>{{ row['Process Range'] }}</td>
                      <td>{{ row['Reject Error Limit'] }}</td>
                      <td class="text-center">{{ row['Due Date'] }}</td>
                      
                      <td>
                        <input 
                          v-model="row.pic" 
                          type="text" 
                          class="form-control form-control-sm" 
                          :placeholder="row.pic || 'PIC'" 
                          :disabled="row.status === 'Selesai'" 
                          @keydown="preventFormSubmit" 
                        />
                      </td>
                      
                      <td class="text-center">
                        <span v-if="row.status === 'Selesai'">
                          {{ formatDateDisplay(row.execute_date) }}
                        </span>
                        <input 
                          v-else
                          v-model="row.execute_date" 
                          type="date"
                          class="form-control form-control-sm text-center"
                          @keydown="preventFormSubmit"
                        />
                      </td>
                      
                      <td>
                        <input 
                          v-model="row.ket" 
                          type="text" 
                          class="form-control form-control-sm" 
                          :placeholder="row.ket || 'Keterangan'" 
                          :disabled="row.status === 'Selesai'" 
                          @keydown="preventFormSubmit" 
                        />
                      </td>
                      
                      <td class="text-center">
                        <span :class="['badge', row.status === 'Selesai' ? 'badge-success' : 'badge-danger']">
                          {{ row.status }}
                        </span>
                      </td>
                      
                      <td class="text-center">
                        <button 
                          v-if="row.status === 'Belum'" 
                          @click="saveToLogAktivitas(row)"
                          :disabled="!row.pic || !row.execute_date || !row.ket?.trim() || savingRows.has(`${row['No.ID']}_${row['Calibration Id.']}`)"
                          :class="[
                            'btn btn-sm',
                            savingRows.has(`${row['No.ID']}_${row['Calibration Id.']}`) 
                              ? 'btn-success' 
                              : 'btn-warning'
                          ]"
                          type="button"
                        >
                          <span v-if="savingRows.has(`${row['No.ID']}_${row['Calibration Id.']}`)">
                            <span class="spinner-border spinner-border-sm mr-1"></span>
                            Menyimpan...
                          </span>
                          <span v-else>
                            <i class="fas fa-save"></i>
                          </span>
                        </button>
                        <span v-else class="text-success">
                          <i class="fas fa-check-circle fa-lg"></i>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ✅ HANYA TAMPILKAN LOADING SAAT SEDANG MEMUAT DATA -->
              <div v-if="loading && dataLoaded" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <p class="mt-2 text-primary">Memuat data...</p>
              </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.table-responsive { 
  overflow-x: auto; 
}

.table thead th { 
  background-color: #f0f4f7; 
  font-weight: 600; 
}

.table tbody tr.table-success { 
  background-color: #d4edda !important; 
}

.badge { 
  padding: 0.4em 0.8em; 
  border-radius: 0.25rem; 
  font-size: 0.85em; 
  font-weight: 500; 
}

.badge-success { 
  background-color: #28a745; 
  color: white; 
}

.badge-danger { 
  background-color: #dc3545; 
  color: white; 
}

.btn { 
  cursor: pointer; 
}

.btn:disabled { 
  opacity: 0.65; 
  cursor: not-allowed; 
}

.btn-warning { 
  background-color: #ffc107; 
  border-color: #ffc107; 
  color: #212529; 
}

.btn-warning:hover:not(:disabled) { 
  background-color: #e0a800; 
  border-color: #d39e00; 
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
  border-color: #1e7e34;
}

.spinner-border { 
  width: 1rem; 
  height: 1rem; 
  border-width: 0.2em; 
}

.table td.text-center,
.table th.text-center {
  text-align: center;
  vertical-align: middle;
}

.table-sm {
  font-size: 0.875rem;
}

.table-sm th,
.table-sm td {
  padding: 0.5rem;
  vertical-align: middle;
}

.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.form-control-sm.text-center {
  text-align: center;
}

/* print-specific helpers */
@media print {
  /* request landscape orientation */
  @page {
    size: landscape;
    margin: 10mm;
  }

  .no-print {
    display: none !important;
  }
  .table-responsive {
    overflow: visible !important;
  }
  /* enlarge footer or adjust spacing if needed */

  /* show custom header when printing */
  .print-header.d-none {
    display: block !important;
  }
  .print-header {
    text-align: center;
    margin-bottom: 20px;
  }
  .print-header .company-logo {
    font-size: 28px;
    font-weight: bold;
    color: #003366;
  }
  .print-header .company-name {
    font-size: 24px;
    font-weight: bold;
    color: #003366;
  }
  .print-header .company-address {
    font-size: 12px;
    color: #555;
    line-height: 1.3;
  }
  .print-header .report-title {
    margin-top: 10px;
    font-size: 22px;
    color: #0056b3;
    font-weight: bold;
  }
  .print-header .report-subtitle,
  .print-header .report-period {
    font-size: 14px;
    color: #666;
  }
}
</style>