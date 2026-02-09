<script setup>
import { ref, onMounted } from 'vue'
import { useLogAktivitas } from '@/composables/useLogAktivitas'
import { logAktivitasApi } from '@/api/logAktivitas' // ✅ IMPORT API LANGSUNG

const { 
  loading, 
  logs,
  selectedMonth,
  selectedYear,
  filterType,
  fetchData
} = useLogAktivitas()

// ✅ SET FILTER TYPE KE PM SAJA
filterType.value = 'pm'

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

// ✅ FUNGSI FORMAT TANGGAL SAMA DENGAN LOG KALIBRASI
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
        text: `Tidak ada data PM untuk ${selectedMonth.value} ${selectedYear.value}`,
        confirmButtonText: 'OK'
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.message || 'Gagal memuat data PM',
      confirmButtonText: 'OK'
    })
  } finally {
    loading.value = false
  }
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
      jenis: 'PM',
      tanggal: row.execute_date,
      petugas: row.pic,
      keterangan: row.ket
    })
    
    // ✅ UPDATE STATUS LANGSUNG DI UI (TANPA REFRESH)
    row.status = 'Selesai'
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data PM berhasil disimpan',
      timer: 1200,
      showConfirmButton: false
    })
    
    // ❌ TIDAK ADA: loading.value, fetchData(), atau setTimeout
    
  } catch (error) {
    console.error('❌ Gagal simpan:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.message || 'Gagal menyimpan data PM',
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
          <h1 class="mb-0">Data Log Preventive Maintenance (PM)</h1>
          <span class="badge badge-info">
            Total: {{ logs.length }} data
          </span>
        </div>
        
        <div class="row">
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
            <button @click="handleSearch" :disabled="!selectedMonth || !selectedYear || loading" class="btn btn-primary">
              <i class="fas fa-search mr-1"></i>
              <span v-if="loading">Loading...</span>
              <span v-else>Cari Data</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
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
                      <th style="width: 10%">Type/Model</th>
                      <th style="width: 10%">SN</th>
                      <th style="width: 5%">Interval</th>
                      <th style="width: 8%">Due Date</th>
                      <th style="width: 10%">PIC</th>
                      <th style="width: 12%">Execute Date</th>
                      <th style="width: 15%">Keterangan</th>
                      <th style="width: 8%">Status</th>
                      <th style="width: 5%">Aksi</th>
                    </tr>  
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in logs" :key="`pm-${index}`" :class="{'table-success': row.status === 'Selesai'}">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td>{{ row['No.ID'] }}</td>
                      <td>{{ row.Description }}</td>
                      <td>{{ row['Type/Model'] || row.Parameter || '-' }}</td>
                      <td>{{ row.SN || '-' }}</td>
                      <td>{{ row.pm_interval || '-' }}</td>
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
                            <i class="fas fa-save mr-1"></i>
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
  background-color: #f8f9fa; 
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
</style>