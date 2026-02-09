// src/composables/useDashboard.js
import { ref, computed } from 'vue'
import { logAktivitasApi } from '@/api/logAktivitas'

export function useDashboard() {
  const loading = ref(false)
  const error = ref(null)
  
  // State untuk data dashboard
  const totalEquipment = ref(0)
  const totalKalibrasi = ref(0)
  const totalPM = ref(0)
  const kalibrasiMonthly = ref([])
  const pmMonthly = ref([])
  const selectedYear = ref(new Date().getFullYear().toString())

const aktivitasMonthly = computed(() => {
  return kalibrasiMonthly.value.map(kalibrasi => {
    // Cari PM yang sesuai bulan
    const pm = pmMonthly.value.find(item => 
      item.month.toLowerCase() === kalibrasi.month.toLowerCase()
    ) || { count: 0 }
    
    return {
      month: kalibrasi.month,
      count: kalibrasi.count + pm.count
    }
  })
})

const totalAktivitas = computed(() => {
  return totalKalibrasi.value + totalPM.value
})

  // Chart data computed
  const chartData = computed(() => {
    const labels = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    return {
      labels,
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
  })

  // Chart options
  const chartOptions = computed(() => ({
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
  }))

  // Fetch semua data dashboard
  const fetchDashboardData = async (year = selectedYear.value) => {
    loading.value = true
    error.value = null
    
    try {
      // Fetch semua data secara paralel
      const [
        equipmentData,
        schedulesData
      ] = await Promise.all([
        logAktivitasApi.getTotalDaftarAlat(),
        logAktivitasApi.getTotalSchedules(year)
      ])
      
      // Update state
      totalEquipment.value = equipmentData.total
      totalKalibrasi.value = schedulesData.totalKalibrasi
      totalPM.value = schedulesData.totalPM
      kalibrasiMonthly.value = schedulesData.kalibrasiMonthly
      pmMonthly.value = schedulesData.pmMonthly
      selectedYear.value = year
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      error.value = err.message || 'Gagal memuat data dashboard'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Refresh data
  const refreshData = () => {
    fetchDashboardData(selectedYear.value)
  }

  // Change year
  const changeYear = (year) => {
    selectedYear.value = year
    fetchDashboardData(year)
  }

  return {
    // State
    loading,
    error,
    totalEquipment,
    totalKalibrasi,
    totalPM,
    kalibrasiMonthly,
    pmMonthly,
    selectedYear,
    
    // Computed
    chartData,
    chartOptions,
    
    // Methods
    fetchDashboardData,
    refreshData,
    changeYear
  }
}