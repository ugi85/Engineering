<script setup>
import { ref, onMounted, computed } from 'vue'
import { useJadwalKalibrasi } from '@/composables/useJadwalKalibrasi'

// ✅ Ambil semua fungsi CRUD
const { 
  refJadwal, 
  loading, 
  fetchList, 
  saveJadwal, 
  deleteJadwal,
  isSaving 
} = useJadwalKalibrasi()

// ✅ State untuk filter bulan
const selectedMonth = ref('')
const dataLoaded = ref(false)

// ✅ Daftar bulan
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

// ✅ Computed untuk filter data berdasarkan bulan
const filteredJadwal = computed(() => {
  if (!selectedMonth.value) return []
  
  return refJadwal.value.filter(item => {
    if (!item.due_date) return false
    
    const dueDate = String(item.due_date).trim()
    
    // Cocokkan nama bulan (case-insensitive)
    return dueDate.toLowerCase() === selectedMonth.value.toLowerCase()
  })
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

// State untuk tracking row yang diedit
const editingRowNo = ref(null)
const rowBackup = ref(null) // Backup untuk cancel

const refresh = () => fetchList()

// ✅ Fungsi untuk mulai edit inline
const startEditRow = (row) => {
  editingRowNo.value = row.no
  // Backup nilai asli untuk cancel
  rowBackup.value = {
    pic: row.pic,
    execute_date: row.execute_date,
    ket: row.ket
  }
}

// ✅ Fungsi untuk cancel edit inline
const cancelEditRow = (row) => {
  if (rowBackup.value) {
    row.pic = rowBackup.value.pic
    row.execute_date = rowBackup.value.execute_date
    row.ket = rowBackup.value.ket
  }
  editingRowNo.value = null
  rowBackup.value = null
}

// ✅ Fungsi untuk save inline edit (hanya saat klik tombol save)
const saveRowEdit = async (row) => {
  await saveJadwal(row)
  editingRowNo.value = null
  rowBackup.value = null
}

// ✅ Fungsi filter data berdasarkan bulan yang dipilih
const handleMonthChange = async () => {
  if (selectedMonth.value) {
    dataLoaded.value = true
    // Force refresh data agar tidak pakai cache lama
    await fetchList(true)
  }
}

// ✅ Fungsi Tambah
const openCreateModal = () => {
  editingJadwal.value = {
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
  }
  $('#editJadwalModalLabel').text('Tambah Jadwal Kalibrasi')
  $('#editJadwalModal').modal('show')
}

// ✅ Fungsi Edit
const openEditModal = (jadwal) => {
  editingJadwal.value = {
    no: jadwal.no || '',
    no_id: jadwal.no_id || '',
    description: jadwal.description || '',
    cal_id: jadwal.cal_id || '',
    parameter: jadwal.parameter || '',
    process_range: jadwal.process_range || '',
    reject_error: jadwal.reject_error || '',
    interval: jadwal.interval || '',
    due_date: jadwal.due_date || '',
    remark: jadwal.remark || '',
    criticality: jadwal.criticality || '',
    pic: jadwal.pic || '',
    execute_date: jadwal.execute_date || '',
    ket: jadwal.ket || ''
  }
  $('#editJadwalModalLabel').text('Edit Jadwal Kalibrasi')
  $('#editJadwalModal').modal('show')
}

// ✅ Fungsi Simpan (Create/Update)
const saveEditingJadwal = async () => {
  isSaving.value = true
  try {
    await saveJadwal(editingJadwal.value)
    $('#editJadwalModal').modal('hide')
    // Reload data dengan filter yang sama - paksa refresh
    if (selectedMonth.value) {
      await fetchList(true)
    }
  } catch (error) {
    console.error('Gagal menyimpan:', error)
  } finally {
    isSaving.value = false
  }
}

// ✅ Fungsi Hapus
const handleDelete = (no) => {
  deleteJadwal(no)
}

onMounted(() => {
  // Jangan fetch otomatis, tunggu user memilih bulan
})
</script>

<template>
  <div class="content-wrapper">
    <!-- ✅ Header dengan filter bulan -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="mb-0">Data Jadwal Kalibrasi</h1>
          <button class="btn btn-primary" @click="openCreateModal" :disabled="!selectedMonth">
            <i class="fas fa-plus mr-1"></i>Tambah Jadwal
          </button>
        </div>
        
        <!-- ✅ Filter Bulan -->
        <div class="row">
          <div class="col-md-3">
            <label class="font-weight-bold mb-2">Pilih Bulan:</label>
            <select 
              v-model="selectedMonth" 
              @change="handleMonthChange"
              class="form-control"
            >
              <option value="">-- Pilih Bulan --</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <!-- ✅ Pesan jika belum memilih bulan -->
            <div v-if="!dataLoaded" class="text-center py-5">
              <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
              <p class="text-muted mt-3">Silakan pilih bulan untuk menampilkan data jadwal kalibrasi</p>
            </div>

            <!-- ✅ Loading state -->
            <div v-else-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Memuat data...</p>
            </div>

            <!-- ✅ Data ditemukan -->
            <div v-else-if="filteredJadwal.length > 0">
              <!-- ✅ Ubah class tabel -->
              <table class="table table-bordered table-hover jadwal-kalibrasi-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>No.ID</th>
                    <th>Description</th>
                    <th>Calibration ID</th>
                    <th>Parameter</th>
                    <th>Process Range</th>
                    <th>Reject Error</th>                   
                    <th>Interval</th>                   
                    <th>Due Date</th>                   
                    <th>Remark</th>                   
                    <th>Criticality</th>
                    <th>PIC</th>
                    <th>Execute Date</th>
                    <th>Ket</th>                   
                  </tr>  
                </thead>
                <tbody>
                    <tr v-for="row in filteredJadwal" :key="`jadwal-${row.no}`">
                    <td>{{ row.no }}</td>
                    <td>{{ row.no_id || '—' }}</td>
                    <td>{{ row.description || '—' }}</td>
                    <td>{{ row.cal_id || '—' }}</td>
                    <td>{{ row.parameter || '—' }}</td>
                    <td>{{ row.process_range || '—' }}</td>
                    <td>{{ row.reject_error || '—' }}</td>
                    <td>{{ row.interval || '—' }}</td>
                    <td>{{ row.due_date || '—' }}</td>
                    <td>{{ row.remark || '—' }}</td>
                    <td>{{ row.criticality || '—' }}</td>
                    <td><input  type="text" class="form-control form-control-sm"  /></td>
                    <td><input  type="date" class="form-control form-control-sm"  /></td>
                    <td><input  type="text" class="form-control form-control-sm" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ✅ Data tidak ditemukan -->
            <div v-else class="text-center py-5">
              <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p class="text-muted mt-3">Tidak ada data jadwal kalibrasi untuk bulan {{ months.find(m => m.value === selectedMonth)?.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ Modal Create/Edit -->
    <div class="modal fade" id="editJadwalModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editJadwalModalLabel">Edit Jadwal Kalibrasi</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="editingJadwal.no" class="form-group">
              <label>No.</label>
              <input v-model="editingJadwal.no" type="text" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label>No. ID</label>
              <input v-model="editingJadwal.no_id" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <input v-model="editingJadwal.description" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Calibration ID</label>
              <input v-model="editingJadwal.cal_id" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Parameter</label>
              <input v-model="editingJadwal.parameter" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Process Range</label>
              <input v-model="editingJadwal.process_range" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Reject Error</label>
              <input v-model="editingJadwal.reject_error" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Interval</label>
              <input v-model="editingJadwal.interval" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Due Date</label>
              <input v-model="editingJadwal.due_date" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Remark</label>
              <input v-model="editingJadwal.remark" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Criticality</label>
              <input v-model="editingJadwal.criticality" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>PIC</label>
              <input v-model="editingJadwal.pic" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Execute Date</label>
              <input v-model="editingJadwal.execute_date" type="date" class="form-control" />
            </div>
            <div class="form-group">
              <label>Ket</label>
              <input v-model="editingJadwal.ket" type="text" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-dismiss="modal"
              :disabled="isSaving"
            >
              Batal
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="saveEditingJadwal"
              :disabled="isSaving"
            >
              <span v-if="isSaving">
                <span class="spinner-border spinner-border-sm mr-1"></span>
                Menyimpan...
              </span>
              <span v-else>
                {{ editingJadwal.no ? 'Simpan Perubahan' : 'Tambah Jadwal' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ubah class sesuai nama tabel baru */
.jadwal-kalibrasi-table thead th {
  vertical-align: middle;
  font-weight: 600;
  background-color: #f8f9fa;
}
.jadwal-kalibrasi-table th,
.jadwal-kalibrasi-table td {
  white-space: nowrap;
  padding: 0.5rem;
}
.jadwal-kalibrasi-table .text-center {
  text-align: center;
}
</style>

<!-- <style scoped>
/* Header styling */
.daftar-alat-table thead th {
  vertical-align: middle;
  font-weight: 600;
  background-color: #f8f9fa;
}

.daftar-alat-table thead tr:first-child th {
  padding: 0.75rem;
}

.daftar-alat-table thead tr:nth-child(2) th {
  font-size: 0.85rem;
  padding: 0.4rem 0.5rem;
}

/* Konten tabel */
.daftar-alat-table th,
.daftar-alat-table td {
  white-space: nowrap;
  padding: 0.5rem;
}

/* Kolom centered */
.daftar-alat-table .text-center {
  text-align: center;
}

/* Lebar minimum untuk kolom penting (opsional) */
.daftar-alat-table th:first-child,
.daftar-alat-table td:first-child {
  min-width: 50px;
}

.daftar-alat-table th:nth-child(2),
.daftar-alat-table td:nth-child(2) {
  min-width: 120px;
}
</style> -->