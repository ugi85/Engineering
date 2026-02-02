<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLogAktivitas } from '@/composables/useLogAktivitas'

const { 
  loading, 
  getAllForPeriod,
  createLog
} = useLogAktivitas()

// State untuk filter
const selectedMonth = ref('')
const selectedYear = ref('')
const dataLoaded = ref(false)

// ✅ STATE UNTUK MELACAK ROW YANG SEDANG DI-SIMPAN (PER-ROW)
const savingRows = ref(new Set())

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

// Data gabungan
const combinedData = ref([])

const filteredJadwal = computed(() => {
  return combinedData.value
})

// State untuk modal
const editingJadwal = ref({
  no: '',
  no_id: '',
  description: '',
  cal_id: '',
  parameter: '',
  process_range: '',
  reject_error: '',
  interval: '',
  due_date: '',
  remark: '',
  criticality: '',
  pic: '',
  execute_date: '',
  ket: ''
})

const editingRowNo = ref(null)
const rowBackup = ref(null)

const handleSearch = async () => {
  console.log('🔍 Tombol Cari Data diklik!')
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
  try {
    console.log('🔍 Mencari data untuk:', { month: selectedMonth.value, year: selectedYear.value })
    
    const response = await getAllForPeriod(selectedMonth.value, selectedYear.value)
    
    let data = []
    if (Array.isArray(response)) {
      data = response
    } else if (response && response.result && Array.isArray(response.result)) {
      data = response.result
    } else if (response && response.data && Array.isArray(response.data)) {
      data = response.data
    } else if (response && typeof response === 'object') {
      const arrayProps = Object.values(response).filter(val => Array.isArray(val))
      if (arrayProps.length > 0) {
        data = arrayProps[0]
      }
    }
    
    const normalizedData = data.map(row => {
      let executeDate = row.execute_date || row.tanggal || ''
      
      if (executeDate instanceof Date) {
        executeDate = executeDate.toISOString().split('T')[0]
      } else if (typeof executeDate === 'string') {
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(executeDate)) {
          const [day, month, year] = executeDate.split('/')
          executeDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        } else if (executeDate.includes('T')) {
          executeDate = executeDate.split('T')[0]
        }
      }
      
      return {
        ...row,
        execute_date: executeDate,
        status: row.status || 'Belum'
      }
    })
    
    console.log('✅ Data yang akan ditampilkan:', normalizedData)
    combinedData.value = normalizedData
    
    if (normalizedData.length === 0) {
      console.log('ℹ️ Tidak ada data ditemukan untuk periode ini')
    }
    
  } catch (error) {
    console.error('❌ Error saat mencari ', error)
    console.error('📋 Detail error:', error.message)
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal memuat data jadwal kalibrasi',
      confirmButtonText: 'OK'
    })
    combinedData.value = []
  }
}

const startEditRow = (row) => {
  editingRowNo.value = row.no
  rowBackup.value = {
    pic: row.pic,
    execute_date: row.execute_date,
    ket: row.ket
  }
}

const cancelEditRow = (row) => {
  if (rowBackup.value) {
    row.pic = rowBackup.value.pic
    row.execute_date = rowBackup.value.execute_date
    row.ket = rowBackup.value.ket
  }
  editingRowNo.value = null
  rowBackup.value = null
}

// ✅ FUNGSI SIMPAN DENGAN PROTEKSI PER-ROW + SWEETALERT
const saveToLogAktivitas = async (row) => {
  // ✅ Buat key unik untuk row ini
  const rowKey = `${row['No.ID']}_${row['Calibration Id.']}`
  
  // ✅ CEGAH DOUBLE CLICK UNTUK ROW INI SAJA
  if (savingRows.value.has(rowKey)) return
  
  if (!row.pic || !row.execute_date) {
    Swal.fire({
      icon: 'warning',
      title: 'Peringatan!',
      text: 'PIC dan Execute Date wajib diisi',
      confirmButtonText: 'OK'
    })
    return
  }
  
  // ✅ TANDAI ROW INI SEDANG DI-SIMPAN
  savingRows.value.add(rowKey)
  
  try {
    const jenis = (row['Int.'] && row['Int.'].toLowerCase() === 'yearly') ? 'Kalibrasi' : 'PM'
    
    await createLog({
      no_id: row['No.ID'],
      cal_id: row['Calibration Id.'],
      jenis: jenis,
      tanggal: row.execute_date,
      petugas: row.pic,
      keterangan: row.ket || ''
    })
    
    row.status = 'Selesai'
    row.log = {
      petugas: row.pic,
      tanggal: row.execute_date,
      keterangan: row.ket
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data berhasil disimpan ke log aktivitas',
      confirmButtonText: 'OK'
    })
    
  } catch (error) {
    console.error('❌ Gagal simpan log:', error)
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: error.message || 'Gagal menyimpan ke log aktivitas',
      confirmButtonText: 'OK'
    })
  } finally {
    // ✅ HAPUS TANDA SIMPAN UNTUK ROW INI
    savingRows.value.delete(rowKey)
  }
}

// ✅ Helper function untuk cek apakah row sedang di-simpan
const isRowSaving = (row) => {
  const rowKey = `${row['No.ID']}_${row['Calibration Id.']}`
  return savingRows.value.has(rowKey)
}

const preventFormSubmit = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    event.stopPropagation()
  }
}

onMounted(() => {
  console.log('📅 Halaman dimuat - dropdown kosong, menunggu user pilih')
})
</script>

<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="mb-0">Data Log Kalibrasi</h1>
        </div>
        
        <!-- Filter Bulan, Tahun, dan Tombol Cari -->
        <div class="row">
          <div class="col-md-3">
            <label class="font-weight-bold mb-2">Pilih Bulan:</label>
            <select 
              v-model="selectedMonth"
              class="form-control"
            >
              <option value="">-- Pilih Bulan --</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
          
          <div class="col-md-2">
            <label class="font-weight-bold mb-2">Pilih Tahun:</label>
            <select 
              v-model="selectedYear"
              class="form-control"
            >
              <option value="">-- Pilih Tahun --</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <div class="col-md-2 d-flex align-items-end">
            <button 
              @click="handleSearch"
              :disabled="!selectedMonth || !selectedYear"
              class="btn btn-primary"
            >
              <i class="fas fa-search mr-1"></i>Cari Data
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <!-- Pesan jika belum mencari data -->
            <div v-if="!dataLoaded" class="text-center py-5">
              <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
              <p class="text-muted mt-3">Pilih bulan dan tahun, lalu klik "Cari Data"</p>
            </div>

            <!-- Loading state -->
            <div v-else-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Memuat data...</p>
            </div>

            <!-- Data ditemukan -->
            <div v-else-if="filteredJadwal.length > 0">
              <table class="table table-bordered table-hover log-kalibrasi-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>No.ID</th>
                    <th>Description</th>
                    <th>Calibration Id.</th>
                    <th>Parameter</th>
                    <th>Process Range</th>
                    <th>Reject Error Limit</th>
                    <th>Interval</th>
                    <th>Due Date</th>
                    <th>Remark</th>
                    <th>PIC</th>
                    <th>Execute Date</th>
                    <th>Ket</th>
                    <th>Aksi</th>
                  </tr>  
                </thead>
                <tbody>
                  <tr v-for="(row, index) in filteredJadwal" :key="`jadwal-${row['No.ID']}`">
                    <td>{{ index+1 }}</td>
                    <td>{{ row['No.ID'] }}</td>
                    <td>{{ row.Description }}</td>
                    <td>{{ row['Calibration Id.'] }}</td>
                    <td>{{ row.Parameter }}</td>
                    <td>{{ row['Process Range'] }}</td>
                    <td>{{ row['Reject Error Limit'] }}</td>
                    <td>{{ row['Int.'] }}</td>
                    <td>{{ row['Due Date'] }}</td>
                    <td>{{ row.Remark }}</td>
                    
                    <td>
                      <input 
                        v-model="row.pic" 
                        type="text"
                        class="form-control form-control-sm"
                        :placeholder="row.status === 'Selesai' ? row.pic : 'PIC'"
                        :disabled="row.status === 'Selesai'"
                        @keydown="preventFormSubmit"
                      />
                    </td>
                    <td>
                      <input 
                        v-model="row.execute_date" 
                        type="date"
                        class="form-control form-control-sm"
                        :disabled="row.status === 'Selesai'"
                        @keydown="preventFormSubmit"
                      />
                    </td>
                    <td>
                      <input 
                        v-model="row.ket" 
                        type="text"
                        class="form-control form-control-sm"
                        :placeholder="row.status === 'Selesai' ? row.ket : 'keterangan'"
                        :disabled="row.status === 'Selesai'"
                        @keydown="preventFormSubmit"
                      />
                    </td>
                    
                    <td>
                      <button 
                        v-if="row.status === 'Belum'" 
                        @click="saveToLogAktivitas(row)"
                        :disabled="!row.pic || !row.execute_date || !row.ket || isRowSaving(row)"
                        :class="[
                          'btn btn-sm',
                          isRowSaving(row) ? 'btn-success' : 'btn-warning'
                        ]"
                        type="button"
                      >
                        <span v-if="isRowSaving(row)">
                          <span class="spinner-border spinner-border-sm mr-1"></span>
                          Menyimpan...
                        </span>
                        <span v-else>
                          <i class="fas fa-save mr-1"></i>Simpan
                        </span>
                      </button>
                      <span v-else class="badge badge-success">
                        <i class="fas fa-check mr-1"></i>Selesai
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Data tidak ditemukan -->
            <div v-else class="text-center py-5">
              <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p class="text-muted mt-3">
                Tidak ada data jadwal kalibrasi untuk 
                {{ months.find(m => m.value === selectedMonth)?.label }} {{ selectedYear }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.badge {
  padding: 0.5em 0.8em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-weight: 500;
}

.badge-success { 
  background-color: #28a745; 
  color: white; 
}

/* Pastikan tombol bisa diklik */
.btn {
  cursor: pointer;
  pointer-events: auto;
}

.btn:disabled,
.btn.disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Loading spinner */
.btn .spinner-border {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

/* Pastikan tabel tidak ada yang menutupi */
.table {
  position: relative;
  z-index: 1;
}

.table td {
  position: relative;
  z-index: 2;
}

/* Hover effect untuk tombol */
.btn-success:hover:not(:disabled) {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background-color: #e0a800;
  border-color: #d39e00;
  color: #212529;
}
</style>