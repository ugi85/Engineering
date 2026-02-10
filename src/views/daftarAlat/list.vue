<script setup>
import { ref, onMounted } from 'vue'
import { useDaftarAlat } from '@/composables/useDaftarAlat'

const { tools, loading, fetchList, saveTool, isSaving, deleteTool } = useDaftarAlat()

// State untuk modal
const editingTool = ref({
  no: '',
  no_id: '',
  description: '',
  type_model: '',
  sn: '',
  year: '',
  crit_product: '',
  crit_process: '',
  crit_safety: '',
  crit_env: '',
  pm_overall: '',
  pm_6monthly: '',
  pm_yearly: '',
  pm_internal_external: '',
  calib_yesno: '',
  calib_schedule: '',
  location: '',
  status_pm: '',
  status_calibration: ''
})

// Refresh data
const refresh = () => fetchList()

// Buka modal TAMBAH
const openCreateModal = () => {
  editingTool.value = {
    no: '',
    no_id: '',
    description: '',
    type_model: '',
    sn: '',
    year: '',
    crit_product: '',
    crit_process: '',
    crit_safety: '',
    crit_env: '',
    pm_overall: '',
    pm_6monthly: '',
    pm_yearly: '',
    pm_internal_external: '',
    calib_yesno: '',
    calib_schedule: '',
    location: '',
    status_pm: '',
    status_calibration: ''
  }
  $('#editToolModalLabel').text('Tambah Alat Baru')
  $('#editToolModal').modal('show')
}

// Buka modal EDIT
const openEditModal = (tool) => {
  editingTool.value = {
    no: tool.no || '',
    no_id: tool.no_id || '',
    description: tool.description || '',
    type_model: tool.type_model || '',
    sn: tool.sn || '',
    year: tool.year || '',
    crit_product: tool.crit_product || '',
    crit_process: tool.crit_process || '',
    crit_safety: tool.crit_safety || '',
    crit_env: tool.crit_env || '',
    pm_overall: tool.pm_overall || '',
    pm_6monthly: tool.pm_6monthly || '',
    pm_yearly: tool.pm_yearly || '',
    pm_internal_external: tool.pm_internal_external || '',
    calib_yesno: tool.calib_yesno || '',
    calib_schedule: tool.calib_schedule || '',
    location: tool.location || '',
    status_pm: tool.status_pm || '',
    status_calibration: tool.status_calibration || ''
  }
  $('#editToolModalLabel').text('Edit Alat Kalibrasi')
  $('#editToolModal').modal('show')
}

// Simpan (Create/Update)
const saveEditingTool = async () => {
  isSaving.value = true
  try {
    await saveTool(editingTool.value)
    $('#editToolModal').modal('hide')
  } catch (error) {
    console.error('Gagal menyimpan:', error)
  } finally {
    isSaving.value = false
  }
}

// Hapus
const handleDelete = (no) => {
  deleteTool(no)
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="content-wrapper">
    <!-- Header dengan Tombol Tambah -->
    <section class="content-header">
      <div class="container-fluid d-flex justify-content-between align-items-start">
        <div>
          <h1 class="mb-0">Daftar Alat & Perawatan</h1>
          <small class="text-muted">No Reff: AGIS-WI-ENG-001-LD1</small>
        </div>
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus mr-1"></i>Tambah Alat
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
              <table class="table table-bordered table-hover daftar-alat-table">
                <thead>
                  <tr>
                    <th rowspan="2" class="align-middle">No</th>
                    <th rowspan="2" class="align-middle">No. ID</th>
                    <th rowspan="2" class="align-middle">Description</th>
                    <th rowspan="2" class="align-middle">Type/Model</th>
                    <th rowspan="2" class="align-middle">SN</th>
                    <th rowspan="2" class="align-middle">Year</th>
                    <th colspan="4" class="text-center">Criticality (Y/N)</th>
                    <th colspan="4" class="text-center">PM</th>
                    <th colspan="2" class="text-center">Calibration</th>
                    <th rowspan="2" class="align-middle">Location</th>
                    <!-- <th colspan="2" class="text-center">Status</th> -->
                    <th rowspan="2" class="align-middle text-center">Aksi</th>
                  </tr>
                  <tr>
                    <th>Product</th>
                    <th>Process</th>
                    <th>Safety</th>
                    <th>Environment</th>
                    <th>Y/N</th>
                    <th>6 Monthly</th>
                    <th>Yearly</th>
                    <th>Internal/<br>External</th>
                    <th>Y/N</th>
                    <th>Schedule</th>
                    <!-- <th>PM</th>
                    <th>Calibration</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tool in tools" :key="tool.no">
                    <td>{{ tool.no }}</td>
                    <td>{{ tool.no_id || '—' }}</td>
                    <td>{{ tool.description || '—' }}</td>
                    <td>{{ tool.type_model || '—' }}</td>
                    <td>{{ tool.sn || '—' }}</td>
                    <td>{{ tool.year || '—' }}</td>
                    <td class="text-center">{{ tool.crit_product || '—' }}</td>
                    <td class="text-center">{{ tool.crit_process || '—' }}</td>
                    <td class="text-center">{{ tool.crit_safety || '—' }}</td>
                    <td class="text-center">{{ tool.crit_env || '—' }}</td>
                    <td>{{ tool.pm_overall || '—' }}</td>
                    <td>{{ tool.pm_6monthly || '—' }}</td>
                    <td>{{ tool.pm_yearly || '—' }}</td>
                    <td>{{ tool.pm_internal_external || '—' }}</td>
                    <td>{{ tool.calib_yesno || '—' }}</td>
                    <td>{{ tool.calib_schedule?.trim() || '—' }}</td>
                    <td>{{ tool.location || '—' }}</td>
                    <!-- <td>
                      <span v-if="tool.status_pm === 'Selesai'" class="badge badge-success">Selesai</span>
                      <span v-else-if="tool.status_pm" class="badge badge-warning">{{ tool.status_pm }}</span>
                    </td> -->
                    <!-- <td>
                      <span v-if="tool.status_calibration === 'Selesai'" class="badge badge-success">Selesai</span>
                      <span v-else-if="tool.status_calibration" class="badge badge-warning">{{ tool.status_calibration }}</span>
                    </td> -->
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm mr-1" @click="openEditModal(tool)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="handleDelete(tool.no)">
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

    <!-- Modal Create/Edit -->
    <div class="modal fade" id="editToolModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editToolModalLabel">Edit Alat Kalibrasi</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div v-if="editingTool.no" class="form-group">
                  <label>No.</label>
                  <input v-model="editingTool.no" type="text" class="form-control" readonly />
                </div>
                <div class="form-group">
                  <label>No. ID</label>
                  <input v-model="editingTool.no_id" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <input v-model="editingTool.description" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Type/Model</label>
                  <input v-model="editingTool.type_model" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>SN</label>
                  <input v-model="editingTool.sn" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Year</label>
                  <input v-model="editingTool.year" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input v-model="editingTool.location" type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Criticality - Product (Y/N)</label>
                  <input v-model="editingTool.crit_product" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Criticality - Process (Y/N)</label>
                  <input v-model="editingTool.crit_process" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Criticality - Safety (Y/N)</label>
                  <input v-model="editingTool.crit_safety" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Criticality - Environment (Y/N)</label>
                  <input v-model="editingTool.crit_env" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>PM Overall (Y/N)</label>
                  <input v-model="editingTool.pm_overall" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>PM 6 Monthly</label>
                  <input v-model="editingTool.pm_6monthly" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>PM Yearly</label>
                  <input v-model="editingTool.pm_yearly" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>PM Internal/External</label>
                  <input v-model="editingTool.pm_internal_external" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Calibration (Y/N)</label>
                  <input v-model="editingTool.calib_yesno" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Calibration Schedule</label>
                  <input v-model="editingTool.calib_schedule" type="text" class="form-control" />
                </div>
                <!-- <div class="form-group">
                  <label>Status PM</label>
                  <select v-model="editingTool.status_pm" class="form-control">
                    <option value="">-- Pilih Status --</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Belum">Belum</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status Calibration</label>
                  <select v-model="editingTool.status_calibration" class="form-control">
                    <option value="">-- Pilih Status --</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Belum">Belum</option>
                  </select>
                </div> -->
              </div>
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
              @click="saveEditingTool"
              :disabled="isSaving"
            >
              <span v-if="isSaving">
                <span class="spinner-border spinner-border-sm mr-1"></span>
                Menyimpan...
              </span>
              <span v-else>
                {{ editingTool.no ? 'Simpan Perubahan' : 'Tambah Alat' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>