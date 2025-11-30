<!-- src/components/charts/MonthlyCalibration.vue -->
<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" id="monthly-calibration-chart"></canvas>
    <!-- Tampilkan loading jika data belum siap -->
    <!-- <div v-if="loading" class="loading">Loading chart...</div> -->
    <div v-if="loading" class="text-center py-4">
              <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
              <p class="mt-2">Loading chart...</p>
            </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartCanvas = ref(null)
const loading = ref(true)

// Fungsi untuk mengambil data dari API
const fetchMonthlyReports = async () => {
  try {
    const pmResponse = await fetch('https://script.google.com/macros/s/AKfycbw0-LDvMGAerOwMPt7Bp1297AetmBNQPcVk7g2qsqe3qnhNJIZr1hFupWLxeGStK9w/exec?action=reportpmbymonth')
    const pmData = await pmResponse.json()

    const calibResponse = await fetch('https://script.google.com/macros/s/AKfycbw0-LDvMGAerOwMPt7Bp1297AetmBNQPcVk7g2qsqe3qnhNJIZr1hFupWLxeGStK9w/exec?action=reportcalibrationbymonth')
    const calibData = await calibResponse.json()

    if (!pmData.success || !calibData.success) {
      console.error("API Error:", pmData.error || calibData.error)
      return null
    }

    return {
      pm: pmData.data,
      calib: calibData.data
    }
  } catch (error) {
    console.error("Fetch Error:", error)
    return null
  }
}

const initChart = async () => {
  const data = await fetchMonthlyReports()
  loading.value = false // Hentikan loading

  if (!data) {
    console.error("Gagal mengambil data untuk chart.")
    return
  }

  if (!chartCanvas.value) {
    console.error("Canvas tidak ditemukan!")
    return
  }

  const ctx = chartCanvas.value.getContext('2d')

  // Daftar bulan
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const pmData = months.map(month => data.pm[month] || 0)
  const calibData = months.map(month => data.calib[month] || 0)

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'PM (6 Monthly + Yearly)',
          data: pmData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Kalibrasi',
          data: calibData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Jumlah'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Bulan'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Laporan Bulanan PM & Kalibrasi'
        }
      }
    }
  })
}

onMounted(() => {
  initChart()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
  background: #fff;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #666;
}
</style>