<script setup>
import { ref, onMounted } from 'vue'
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
  criticality: ''
})

const refresh = () => fetchList()

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
    criticality: ''
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
    criticality: jadwal.criticality || ''
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
  fetchList()
})
</script>

<template>
  <div class="content-wrapper">
    <!-- ✅ Header dengan tombol Tambah -->
    <section class="content-header">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Data Jadwal Kalibrasi</h1>
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus mr-1"></i>Tambah Jadwal
        </button>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Memuat data...</p>
            </div>

            <div v-else>
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
                    <!-- ✅ Kolom Aksi -->
                    <th class="text-center">Aksi</th>                   
                  </tr>  
                </thead>
                <tbody>
                    <tr v-for="row in refJadwal" :key="`jadwal-${row.no}`">
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
                    <!-- ✅ Tombol Aksi -->
                    <td class="text-center">
                      <button 
                        class="btn btn-warning btn-sm mr-1" 
                        @click="openEditModal(row)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-danger btn-sm" 
                        @click="handleDelete(row.no)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
            <div class="form-group">
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