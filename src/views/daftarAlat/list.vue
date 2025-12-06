<script setup>
import { onMounted } from 'vue'
import { useDaftarAlat } from '@/composables/useDaftarAlat'

const { tools, loading, fetchList, saveTool, deleteTool } = useDaftarAlat()

const refresh = () => {
  fetchList()
}

// Fungsi Edit
const editTool = (tool) => {
  console.log('Edit tool:', tool)
  // Implementasikan modal edit di sini
}



// Fungsi simpan (untuk modal edit/create)
const handleSave = async (toolData) => {
  await saveTool(toolData)
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <h1 class="mb-0">Daftar Alat & Perawatan</h1>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <!-- <div class="card-header">
            <h3 class="card-title">Data Alat</h3>
            <div class="card-tools">
              <button class="btn btn-tool" @click="refresh" :disabled="loading">
                <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
              </button>
            </div>
          </div> -->
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Memuat data...</p>
            </div>

            <div v-else>
              <table class="table table-bordered table-hover daftar-alat-table">
                <thead>
                  <!-- Baris Header Level 1 -->
                  <tr>
                    <th rowspan="2" class="align-middle">No</th>
                    <th rowspan="2" class="align-middle">No. ID</th>
                    <th rowspan="2" class="align-middle">Description</th>
                    <th rowspan="2" class="align-middle">Type/Model</th>
                    <th rowspan="2" class="align-middle">SN</th>
                    <th rowspan="2" class="align-middle">Year</th>

                    <!-- Criticality (Y/N) -->
                    <th colspan="4" class="text-center">Criticality (Y/N)</th>

                    <!-- PM -->
                    <th colspan="4" class="text-center">PM</th>

                    <!-- Calibration -->
                    <th colspan="2" class="text-center">Calibration</th>

                    <th rowspan="2" class="align-middle">Location</th>

                    <!-- Status -->
                    <th colspan="2" class="text-center">Status</th>

                     <!-- Kolom Aksi -->
                    <th rowspan="2" class="align-middle text-center">Aksi</th>
                  </tr>

                  <!-- Baris Header Level 2 -->
                  <tr>
                    <!-- Criticality Sub -->
                    <th>Product</th>
                    <th>Process</th>
                    <th>Safety</th>
                    <th>Environment</th>

                    <!-- PM Sub -->
                    <th>Y/N</th>
                    <th>6 Monthly</th>
                    <th>Yearly</th>
                    <th>Internal/<br>External</th>
                

                    <!-- Calibration Sub -->
                    <th>Y/N</th>
                    <th>Schedule</th>

                    <!-- Status Sub -->
                    <th>PM</th>
                    <th>Calibration</th>
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

                    <!-- Criticality -->
                    <td class="text-center">{{ tool.crit_product || '—' }}</td>
                    <td class="text-center">{{ tool.crit_process || '—' }}</td>
                    <td class="text-center">{{ tool.crit_safety || '—' }}</td>
                    <td class="text-center">{{ tool.crit_env || '—' }}</td>

                    <!-- PM -->
                    <td>{{ tool.pm_overall || '—' }}</td>
                    <td>{{ tool.pm_6monthly || '—' }}</td>
                    <td>{{ tool.pm_yearly || '—' }}</td>
                    <td>{{ tool.pm_internal_external|| '—' }}</td>

                    <!-- Calibration -->
                    <td>{{ tool.calib_yesno || '—' }}</td>
                    <td>{{ tool.calib_schedule?.trim() || '—' }}</td>

                    <!-- Location -->
                    <td>{{ tool.location || '—' }}</td>

                    <!-- Status -->
                    <td>{{ tool.status_pm || '—' }}</td>
                    <td>
                      <span v-if="tool.status_calibration === 'done'" class="badge badge-success">Selesai</span>
                      <span v-else-if="tool.status_calibration" class="badge badge-info">{{ tool.status_calibration }}</span>
                      <span v-else class="badge badge-warning">Belum</span>
                    </td>
                    <!-- Aksi -->
                     <td>
                    <button class="btn btn-warning btn-sm mr-1" @click="openEditModal(product)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteTool(tool.no)">
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