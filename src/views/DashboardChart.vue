<!-- src/views/DashboardView.vue -->
<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Dashboard</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <!-- Stats Cards -->
        <div class="row">
          <div class="col-lg-3 col-6">
            <div class="small-box bg-info">
              <div class="inner">
                <h3>{{ totalEquipment || 0 }}</h3>
                <p>Total Peralatan</p>
              </div>
              <div class="icon">
                <i class="fas fa-cogs"></i>
              </div>
            </div>
          </div>
          
          <div class="col-lg-3 col-6">
            <div class="small-box bg-success">
              <div class="inner">
                <h3>{{ totalKalibrasi || 0 }}</h3>
                <p>Jadwal Kalibrasi</p>
              </div>
              <div class="icon">
                <i class="fas fa-balance-scale"></i>
              </div>
            </div>
          </div>
          
          <div class="col-lg-3 col-6">
            <div class="small-box bg-warning">
              <div class="inner">
                <h3>{{ totalPM || 0 }}</h3>
                <p>Jadwal PM</p>
              </div>
              <div class="icon">
                <i class="fas fa-tools"></i>
              </div>
            </div>
          </div>
          
          <div class="col-lg-3 col-6">
            <div class="small-box" :class="currentMonthStats.isCompleted ? 'bg-success' : 'bg-danger'">
              <div class="inner">
                <h3>{{ currentMonthStats.remaining || 0 }}</h3>
                <p>
                  <strong>{{ currentMonthStats.month.substring(0, 3) }}</strong> - OverDue<br>
                  <!-- <small>(Kalibrasi: {{ currentMonthStats.kalibrasiCount }}, PM: {{ currentMonthStats.pmCount }})</small> -->
                </p>
              </div>
              <div class="icon">
                <i class="fas fa-tasks"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header border-0">
                <h3 class="card-title">
                  <i class="fas fa-chart-line mr-1"></i>
                  Aktivitas Kalibrasi & PM 
                </h3>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="position-relative" style="height: 400px">
                  <canvas ref="chartRef"></canvas>
                  
                  <!-- Overlay Loading -->
                  <div v-if="loading && !hasData" class="chart-overlay">
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <p class="mt-2">Memuat data dashboard...</p>
                  </div>
                  
                  <!-- Overlay No Data -->
                  <div v-if="!loading && !hasData" class="chart-overlay">
                    <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Tidak ada data untuk ditampilkan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Breakdown Tables -->
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="fas fa-balance-scale text-success mr-1"></i>
                  Jadwal Kalibrasi per Bulan
                </h3>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Bulan</th>
                      <th class="text-center">Jadwal</th>
                      <th class="text-center">Executed</th>
                      <th class="text-center">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in kalibrasiMonthly" :key="index">
                      <td>{{ item.month }}</td>
                      <td class="text-center">
                        <span class="badge badge-success">{{ item.count || 0 }}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge" :class="item.executed === item.count && item.count > 0 ? 'badge-success' : 'badge-warning'">
                          {{ item.executed || 0 }}/{{ item.count || 0 }}
                        </span>
                      </td>
                      <td class="text-center">
                        <div class="progress progress-xs">
                          <div 
                            class="progress-bar" 
                            :class="item.executedPercentage === 100 && item.count > 0 ? 'bg-success' : 'bg-info'"
                            :style="{ 
                              width: (item.executedPercentage || 0) + '%',
                              color: (item.executedPercentage || 0) > 30 ? 'white' : '#007bff'
                            }"
                          >
                            <span v-if="(item.executedPercentage || 0) > 5">
                              <!-- {{ item.executedPercentage || 0 }}% -->
                            </span>
                          </div>
                        </div>
                        <span v-if="(item.executedPercentage || 0) <= 5" class="ml-2">
                        </span>
                      </td>
                          {{ item.executedPercentage || 0 }}%
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="fas fa-tools text-warning mr-1"></i>
                  Jadwal PM per Bulan
                </h3>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>Bulan</th>
                      <th class="text-center">Jadwal</th>
                      <th class="text-center">Executed</th>
                      <th class="text-center">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in pmMonthly" :key="index">
                      <td>{{ item.month }}</td>
                      <td class="text-center">
                        <span class="badge badge-warning">{{ item.count || 0 }}</span>
                      </td>
                      <td class="text-center">
                        <span class="badge" :class="item.executed === item.count && item.count > 0 ? 'badge-success' : 'badge-warning'">
                          {{ item.executed || 0 }}/{{ item.count || 0 }}
                        </span>
                      </td>
                      <td class="text-center">
                        <div class="progress progress-xs">
                          <div 
                            class="progress-bar" 
                            :class="item.executedPercentage === 100 && item.count > 0 ? 'bg-success' : 'bg-warning'"
                            :style="{ 
                              width: (item.executedPercentage || 0) + '%',
                              color: (item.executedPercentage || 0) > 30 ? 'white' : '#856404'
                            }"
                          >
                            <span v-if="(item.executedPercentage || 0) > 5">
                              <!-- {{ item.executedPercentage || 0 }}% -->
                            </span>
                          </div>
                        </div>
                        <span v-if="(item.executedPercentage || 0) <= 5" class="ml-2">
                        </span>
                      </td>
                          {{ item.executedPercentage || 0 }}%
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { logAktivitasApi } from '@/api/logAktivitas'

// Register Chart.js
Chart.register(...registerables)

// === Konfigurasi Cache ===
const CACHE_KEY = 'dashboard_data_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit
const AUTO_REFRESH_INTERVAL = 3 * 60 * 1000 // 3 menit - refresh background

// State
const loading = ref(false)
const totalEquipment = ref(0)
const totalKalibrasi = ref(0)
const totalPM = ref(0)
const kalibrasiMonthly = ref([])
const pmMonthly = ref([])
const chartRef = ref(null)
let chartInstance = null
let refreshIntervalId = null

// Daftar bulan
const monthList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Computed: Cek apakah ada data
const hasData = computed(() => {
  return (kalibrasiMonthly.value.length > 0 || pmMonthly.value.length > 0) &&
         (totalKalibrasi.value > 0 || totalPM.value > 0)
})

/**
 * 📊 Data untuk bulan saat ini (realtime)
 * Menampilkan total jadwal dan sisa jadwal (countdown) untuk bulan sekarang
 */
const currentMonthStats = computed(() => {
  const now = new Date()
  const currentMonthName = monthList[now.getMonth()]
  
  const kalItem = kalibrasiMonthly.value.find(m => m.month === currentMonthName)
  const pmItem = pmMonthly.value.find(m => m.month === currentMonthName)

  const kalibrasiCount = kalItem?.count || 0
  const kalibrasiExecuted = kalItem?.executed || 0
  const pmCount = pmItem?.count || 0
  const pmExecuted = pmItem?.executed || 0

  const totalSchedules = kalibrasiCount + pmCount
  const totalExecuted = kalibrasiExecuted + pmExecuted
  const remaining = Math.max(0, totalSchedules - totalExecuted)
  const executedPercentage = totalSchedules > 0 ? Math.round((totalExecuted / totalSchedules) * 100) : 0

  return {
    month: currentMonthName,
    totalSchedules,
    totalExecuted,
    remaining,
    kalibrasiCount,
    kalibrasiExecuted,
    pmCount,
    pmExecuted,
    executedPercentage,
    isCompleted: remaining === 0 && totalSchedules > 0
  }
})

// Hitung persentase
const getPercentage = (value, total) => {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 100)
}

// Inisialisasi chart
const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  if (chartRef.value && hasData.value) {
    const labels = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const chartData = {
      labels: labels.map(month => month.substring(0, 3)),
      datasets: [
        {
          label: 'Kalibrasi',
          data: labels.map(month => {
            const item = kalibrasiMonthly.value.find(m => m.month === month)
            return item ? item.count : 0
          }),
          borderColor: '#4285F4',
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Preventive Maintenance',
          data: labels.map(month => {
            const item = pmMonthly.value.find(m => m.month === month)
            return item ? item.count : 0
          }),
          borderColor: '#34A853',
          backgroundColor: 'rgba(52, 168, 83, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }
      ]
    }
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 13
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
    
    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: chartData,
      options: chartOptions
    })
  }
}

// Fungsi untuk mengambil data dari API
const fetchDashboardData = async () => {
  try {
    // Ambil semua data secara paralel
    const [
      equipmentResponse,
      kalibrasiResponse,
      pmResponse
    ] = await Promise.all([
      logAktivitasApi.getTotalDaftarAlat(),
      logAktivitasApi.getKalibrasiScheduleByMonth('2026'),
      logAktivitasApi.getPMScheduleByMonth('2026')
    ])
    
    if (!equipmentResponse.success || !kalibrasiResponse.success || !pmResponse.success) {
      throw new Error('Gagal mengambil data dashboard')
    }
    
    return {
      totalEquipment: equipmentResponse.total,
      totalKalibrasi: kalibrasiResponse.data.reduce((sum, item) => sum + item.count, 0),
      totalPM: pmResponse.data.reduce((sum, item) => sum + item.count, 0),
      kalibrasiMonthly: kalibrasiResponse.data,
      pmMonthly: pmResponse.data
    }
  } catch (error) {
    console.error('Fetch Error:', error)
    return null
  }
}

// Inisialisasi dengan cache
const initDashboard = async () => {
  const now = Date.now()
  let cachedData = null

  // Coba baca dari cache
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (parsed && now - parsed.timestamp < CACHE_DURATION) {
        cachedData = parsed
      }
    } catch (e) {
      console.warn('Cache dashboard corrupted, ignoring')
      localStorage.removeItem(CACHE_KEY)
    }
  }

  if (cachedData) {
    // Tampilkan langsung dari cache
    totalEquipment.value = cachedData.totalEquipment
    totalKalibrasi.value = cachedData.totalKalibrasi
    totalPM.value = cachedData.totalPM
    kalibrasiMonthly.value = cachedData.kalibrasiMonthly
    pmMonthly.value = cachedData.pmMonthly
    
    loading.value = false
    initChart()

    // Update di background
    fetchDashboardData().then(freshData => {
      if (freshData) {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ...freshData, timestamp: Date.now() })
        )
        // Update state dengan data baru
        totalEquipment.value = freshData.totalEquipment
        totalKalibrasi.value = freshData.totalKalibrasi
        totalPM.value = freshData.totalPM
        kalibrasiMonthly.value = freshData.kalibrasiMonthly
        pmMonthly.value = freshData.pmMonthly
        initChart() // Refresh chart
      }
    }).catch(console.error)
  } else {
    // Ambil dari API
    loading.value = true
    const data = await fetchDashboardData()
    loading.value = false

    if (data) {
      totalEquipment.value = data.totalEquipment
      totalKalibrasi.value = data.totalKalibrasi
      totalPM.value = data.totalPM
      kalibrasiMonthly.value = data.kalibrasiMonthly
      pmMonthly.value = data.pmMonthly
      
      initChart()
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ ...data, timestamp: now })
      )
    } else {
      console.error("Gagal mengambil data untuk dashboard.")
    }
  }
}

// Watch untuk update chart saat data berubah
watch([kalibrasiMonthly, pmMonthly], () => {
  if (!loading.value && chartRef.value) {
    initChart()
  }
})

/**
 * ✅ Fungsi untuk refresh background data tanpa menampilkan loading
 * Dijalankan secara otomatis setiap 5 menit
 */
const startAutoRefresh = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
  
  refreshIntervalId = setInterval(async () => {
    try {
      // Fetch data baru tanpa menampilkan loading spinner
      const freshData = await fetchDashboardData()
      
      if (freshData) {
        // Update cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ...freshData, timestamp: Date.now() })
        )
        
        // Update state dengan data baru (silent update)
        totalEquipment.value = freshData.totalEquipment
        totalKalibrasi.value = freshData.totalKalibrasi
        totalPM.value = freshData.totalPM
        kalibrasiMonthly.value = freshData.kalibrasiMonthly
        pmMonthly.value = freshData.pmMonthly
        
        // Chart akan auto-update melalui watch
        console.log('[Dashboard] Auto-refresh completed at', new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('[Dashboard] Auto-refresh error:', error)
      // Silently fail - tidak akan mengganggu UX
    }
  }, AUTO_REFRESH_INTERVAL)
}

onMounted(() => {
  initDashboard()
  // Mulai auto-refresh setelah inisialisasi
  startAutoRefresh()
})

onUnmounted(() => {
  // Cleanup interval saat component di-unmount
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
  }
})
</script>

<style scoped>
.small-box {
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.small-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.2);
}

.card {
  box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.05);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.progress {
  height: 6px;
  margin-bottom: 0;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 0.1rem;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Overlay untuk Chart */
.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 0.5rem;
  }
  
  .chart-overlay p {
    font-size: 0.9rem;
  }
  
  .small-box {
    margin-bottom: 1rem;
  }
}
</style>