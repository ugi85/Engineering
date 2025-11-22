<script setup>
import { onMounted } from 'vue'
import { useDaftarAlat } from '@/composables/useDaftarAlat'

const { tools, loading, fetchList } = useDaftarAlat()

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
        <h1 class="mb-0">Daftar Alat Kalibrasi</h1>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Alat</h3>
            <div class="card-tools">
              <button class="btn btn-tool" @click="refresh" :disabled="loading">
                <i class="fas fa-sync" :class="{ 'fa-spin': loading }"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Memuat data alat kalibrasi...</p>
            </div>
            <div v-else>
            <table class="table table-bordered table-hover daftar-alat-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID Alat</th>
                  <th>Deskripsi</th>
                  <th>Tipe/Model</th>
                  <th>Serial No</th>
                  <th>Year</th>
                  <th>Product Critical</th>
                  <th>Proses Critical</th>
                  <th>Safety Critical</th>
                  <th>Environment Critical</th>
                  <th>Y/N PM</th>
                  <th>6 Monthly PM</th>
                  <th>Yearly PM</th>
                  <th>In/Ex PM</th>
                  <th>Y/N Kalibrasi</th>
                  <th>Monthly Kalibrasi</th>
                  <th>Lokasi</th>
                  <th>Status PM</th>
                  <th>Status Kalibrasi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tool in tools" :key="tool.no_id || tool.no">
                  <td>{{ tool.no }}</td>
                  <td>{{ tool.no_id || '—' }}</td>
                  <td>{{ tool.description || '—' }}</td>
                  <td>{{ tool.type_model || '—' }}</td>
                  <td>{{ tool.sn || '—' }}</td>
                  <td>{{ tool.year || '—' }}</td>
                  <td>{{ tool.crit_product || '—' }}</td>
                  <td>{{ tool.crit_process || '—' }}</td>
                  <td>{{ tool.crit_safety || '—' }}</td>
                  <td>{{ tool.crit_env || '—' }}</td>
                  <td>{{ tool.crit_overall || '—' }}</td>
                  <td>{{ tool.pm_6monthly || '—' }}</td>
                  <td>{{ tool.pm_yearly || '—' }}</td>
                  <td>{{ tool.pm_internal_external || '—' }}</td>
                  <td>{{ tool.calib_yesno || '—' }}</td>
                  <td>{{ tool.calib_schedule?.trim() || '—' }}</td>
                  <td>{{ tool.location || '—' }}</td>
                  <td>{{ tool.status_pm || '—' }}</td>
                  <td>
                    <span v-if="tool.status_calibration === 'done'" class="badge badge-success">Selesai</span>
                    <span v-else-if="tool.status_calibration" class="badge badge-info">{{ tool.status_calibration }}</span>
                    <span v-else class="badge badge-warning">Belum</span>
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
/* ✅ Ini yang membuat scroll horizontal muncul saat perlu */
.daftar-alat-table th,
.daftar-alat-table td {
  white-space: nowrap;
}
</style>

