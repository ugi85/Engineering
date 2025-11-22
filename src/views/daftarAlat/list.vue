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

            <table v-else class="table table-bordered table-hover example2">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID Alat</th>
                  <th>Deskripsi</th>
                  <th>Tipe/Model</th>
                  <th>Serial No</th>
                  <th>Jadwal Kalibrasi</th>
                  <th>Lokasi</th>
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
                  <td>{{ tool.calib_schedule?.trim() || '—' }}</td>
                  <td>{{ tool.location || '—' }}</td>
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
    </section>
  </div>
</template>

