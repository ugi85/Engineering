<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDaftarAlat } from '@/composables/useDaftarAlat'
import { useFrontendConfig } from '@/composables/useConfig'
import { usePermissions } from '@/composables/usePermissions'

const { tools, loading, fetchList, saveTool, isSaving, deleteTool } = useDaftarAlat()
const { config } = useFrontendConfig()
const permission = usePermissions()

// Computed untuk permission checks
const canCreate = computed(() => permission.can('daftarAlat:create'))
const canEdit = computed(() => permission.can('daftarAlat:edit'))
const canDelete = computed(() => permission.can('daftarAlat:delete'))
const isLoggedIn = computed(() => permission.isLoggedIn.value)

// Template untuk field form
const getEmptyTool = () => ({
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

// State untuk modal
const isModalOpen = ref(false)
const isEditMode = ref(false)
const editingTool = ref(getEmptyTool())

// Computed untuk judul modal
const modalTitle = computed(() =>
  isEditMode.value ? 'Edit Daftar Alat ' : 'Tambah Alat Baru'
)

// Computed untuk text tombol simpan
const saveButtonText = computed(() =>
  isEditMode.value ? 'Simpan Perubahan' : 'Tambah Alat'
)

// ✅ DYNAMIC REFERENCE
const documentRefEquipment = computed(() => {
  return config.value.documentRefEquipment
})

// Refresh data
const refresh = () => fetchList()

// Buka modal TAMBAH
const openCreateModal = () => {
  editingTool.value = getEmptyTool()
  isEditMode.value = false
  isModalOpen.value = true
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
  isEditMode.value = true
  isModalOpen.value = true
}

// Tutup modal
const closeModal = () => {
  isModalOpen.value = false
  editingTool.value = getEmptyTool()
  isEditMode.value = false
}

// Simpan (Create/Update)
const saveEditingTool = async () => {
  try {
    await saveTool(editingTool.value)
    closeModal()
  } catch (error) {
    console.error('Gagal menyimpan:', error)
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
          <!-- <small class="text-muted">No Reff: AGIS-WI-ENG-001-LD1_v5.0</small><br> -->
           <small class="text-muted">No Reff: {{ documentRefEquipment }}</small>
        </div>
        <button v-if="canCreate" class="btn btn-info" @click="openCreateModal">
          <i class="fas fa-plus mr-1"></i> Tambah Alat
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
                      <button v-if="canEdit" class="btn btn-warning btn-sm mr-1" @click="openEditModal(tool)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button v-if="canDelete" class="btn btn-danger btn-sm" @click="handleDelete(tool.no)">
                        <i class="fas fa-trash"></i>
                      </button>
                      <span v-if="!canEdit && !canDelete" class="text-muted">
                        <i class="fas fa-lock mr-1"></i>
                      </span>
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
    <div 
      v-if="isModalOpen"
      class="modal fade show" 
      tabindex="-1"
      style="display: block; background-color: rgba(0, 0, 0, 0.5);"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button 
              type="button" 
              class="close" 
              @click="closeModal"
              :disabled="isSaving"
            >
              &times;
            </button>
          </div>
          <div class="modal-body">
            <!-- Basic Information -->
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
              </div>
              <div class="col-md-6">
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
            </div>

            <!-- Criticality -->
            <div class="row">
              <div class="col-12">
                <h6 class="font-weight-bold mb-3 mt-3 text-secondary">
                  <small>CRITICALITY</small>
                </h6>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Product (Y/N)</label>
                  <input v-model="editingTool.crit_product" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Safety (Y/N)</label>
                  <input v-model="editingTool.crit_safety" type="text" class="form-control" maxlength="1" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Process (Y/N)</label>
                  <input v-model="editingTool.crit_process" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Environment (Y/N)</label>
                  <input v-model="editingTool.crit_env" type="text" class="form-control" maxlength="1" />
                </div>
              </div>
            </div>

            <!-- Preventive Maintenance -->
            <div class="row">
              <div class="col-12">
                <h6 class="font-weight-bold mb-3 mt-3 text-secondary">
                  <small>PREVENTIVE MAINTENANCE</small>
                </h6>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Overall (Y/N)</label>
                  <input v-model="editingTool.pm_overall" type="text" class="form-control" maxlength="1" />
                </div>
                <div class="form-group">
                  <label>Yearly</label>
                  <input v-model="editingTool.pm_yearly" type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>6 Monthly</label>
                  <input v-model="editingTool.pm_6monthly" type="text" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Internal/External</label>
                  <input v-model="editingTool.pm_internal_external" type="text" class="form-control" />
                </div>
              </div>
            </div>

            <!-- Calibration -->
            <div class="row">
              <div class="col-12">
                <h6 class="font-weight-bold mb-3 mt-3 text-secondary">
                  <small>CALIBRATION</small>
                </h6>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Required (Y/N)</label>
                  <input v-model="editingTool.calib_yesno" type="text" class="form-control" maxlength="1" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Schedule</label>
                  <input v-model="editingTool.calib_schedule" type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeModal"
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
                {{ saveButtonText }}
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
  background-color: #f2f7fc;
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

/* Modal scrollable styling */
.modal-dialog {
  max-height: calc(100vh - 2rem);
  display: flex;
}

.modal-content {
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
}

.modal-body {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  flex: 1;
}
</style>