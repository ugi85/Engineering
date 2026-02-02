// src/composables/useLogAktivitas.js
import { ref } from 'vue'
import { logAktivitasApi } from '@/api/logAktivitas'

export function useLogAktivitas() {
  const logs = ref([])
  const loading = ref(false)

  /**
   * ✅ FUNGSI UTAMA: Mendapatkan semua jadwal dengan status aktivitas
   * Gunakan API service yang sudah ada
   */
  const getAllForPeriod = async (month, year) => {
    loading.value = true
    try {
      // ✅ Gunakan axios melalui API service
      const response = await logAktivitasApi.getAllForPeriod(month, year)
      return response.result || []
    } catch (error) {
      console.error('Error fetching all for period:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * ✅ Menyimpan log aktivitas (sudah benar)
   */
  const createLog = async (logData) => {
    try {
      const result = await logAktivitasApi.createLog(logData)
      return result
    } catch (error) {
      console.error('Gagal menyimpan log:', error)
      throw error
    }
  }

  /**
   * ✅ Mendapatkan log berdasarkan bulan/tahun (sudah benar)
   */
  const getLogsByMonthYear = async (month, year) => {
    try {
      const data = await logAktivitasApi.getLogsByMonthYear(month, year)
      return data
    } catch (error) {
      console.error('Gagal mengambil log by month/year:', error)
      return []
    }
  }

  return {
    logs,
    loading,
    getAllForPeriod,
    createLog,
    getLogsByMonthYear
  }
}