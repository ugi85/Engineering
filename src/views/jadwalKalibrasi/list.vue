<script setup>
import { onMounted } from 'vue'
import { usejadwalKalibrasi } from '@/composables/usejadwalKalibrasi'

const { refJadwal, loading, fetchList } = usejadwalKalibrasi()

const refresh = () => {
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <h1 class="mb-0">Data Jadwal Kalibrasi</h1>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <!-- <div class="card-header">
            <h3 class="card-title">Data Kalibrasi</h3>
            <div class="card-tools">
              <button class="btn btn-tool" @click="refresh" :disabled="loading">
                <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
              </button>
            </div>
          </div> -->
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Memuat data jadwal kalibrasi...</p>
            </div>

            <div v-else>
              <table class="table table-bordered table-hover daftar-alat-table">
                <thead>
                  <!-- Baris Header Level 1 -->
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
                  </tr>  
                </thead>

                <tbody>
                  <tr v-for="row in refJadwal" :key="row.no_id || row.no">
                    <td>{{ row.no }}</td>
                    <td>{{ row.no_id || '—' }}</td>
                    <td>{{ row.description || '—' }}</td>
                    <td>{{ row.cal_id|| '—' }}</td>
                    <td>{{ row.parameter || '—' }}</td>
                    <td>{{ row.process_range || '—' }}</td>
                    <td>{{ row.reject_error || '—' }}</td>
                    <td>{{ row.interval || '—' }}</td>
                    <td>{{ row.due_date || '—' }}</td>
                    <td>{{ row.remark || '—' }}</td>
                    <td>{{ row.criticality || '—' }}</td>
                    <!-- <td>
                      <span v-if="row.status_calibration === 'done'" class="badge badge-success">Selesai</span>
                      <span v-else-if="row.status_calibration" class="badge badge-info">{{ row.status_calibration }}</span>
                      <span v-else class="badge badge-warning">Belum</span>
                    </td> -->
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