// src/api/logAktivitas.js
import api from '@/plugins/axios'
import { useSettingsStore } from '@/stores/settings'

function toFormData(data) {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })
  return params
}

export const logAktivitasApi = {
  // ✅ CREATE LOG
  async createLog(log) {
    const settings = useSettingsStore()
    
    const payload = toFormData({
      action: 'create',
      no_id: log.no_id,
      cal_id: log.cal_id,
      jenis: log.jenis,
      tanggal: log.tanggal,
      petugas: log.petugas,
      keterangan: log.keterangan
    })

    try {
      const { data } = await api.post(settings.api.logAktivitas, payload)
      if (!data.success) {
        throw new Error(data.message || 'Gagal menyimpan log aktivitas')
      }
      return data
    } catch (error) {
      console.error('Error in createLog:', error)
      throw error
    }
  },

  // ✅ GET LOGS BY MONTH & YEAR
  async getLogsByMonthYear(month, year) {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { 
          action: 'getbymonthyear', 
          month: String(month), 
          year: String(year) 
        }
      })
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil log aktivitas')
      }
      return data?.data || []
    } catch (error) {
      console.error('Error in getLogsByMonthYear:', error)
      throw error
    }
  },

  // ✅ GET ALL FOR PERIOD (PM + KALIBRASI)
  async getAllForPeriod(month, year) {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { 
          action: 'getallforperiod', 
          month: String(month), 
          year: String(year) 
        }
      })
      
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil data periode')
      }
      
      return data
    } catch (error) {
      console.error('Error in getAllForPeriod:', error)
      throw error
    }
  },

  // ✅ GET PM FOR PERIOD (HANYA PM)
  async getPMForPeriod(month, year) {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { 
          action: 'getpmforperiod', 
          month: String(month), 
          year: String(year) 
        }
      })
      
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil data PM')
      }
      
      return data
    } catch (error) {
      console.error('Error in getPMForPeriod:', error)
      throw error
    }
  },

  // ✅ GET KALIBRASI FOR PERIOD (HANYA KALIBRASI)
  async getKalibrasiForPeriod(month, year) {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { 
          action: 'getkalibrasiforperiod', 
          month: String(month), 
          year: String(year) 
        }
      })
      
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil data kalibrasi')
      }
      
      return data
    } catch (error) {
      console.error('Error in getKalibrasiForPeriod:', error)
      throw error
    }
  },

  // ✅ GET DAFTAR ALAT
  async getDaftarAlat() {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { action: 'getdaftarshalat' }
      })
      
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil daftar alat')
      }
      
      return data?.data || []
    } catch (error) {
      console.error('Error in getDaftarAlat:', error)
      throw error
    }
  },

  // ✅ GET LOG BY NO
  async getLogByNo(no) {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { 
          action: 'get', 
          no: String(no) 
        }
      })
      
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil log')
      }
      
      return data?.item
    } catch (error) {
      console.error('Error in getLogByNo:', error)
      throw error
    }
  },

  // ✅ UPDATE LOG
  async updateLog(log) {
    const settings = useSettingsStore()
    
    const payload = toFormData({
      action: 'update',
      no: log.no,
      no_id: log.no_id,
      cal_id: log.cal_id,
      jenis: log.jenis,
      tanggal: log.tanggal,
      petugas: log.petugas,
      keterangan: log.keterangan
    })

    try {
      const { data } = await api.post(settings.api.logAktivitas, payload)
      if (!data.success) {
        throw new Error(data.message || 'Gagal update log aktivitas')
      }
      return data
    } catch (error) {
      console.error('Error in updateLog:', error)
      throw error
    }
  },

  // ✅ DELETE LOG
  async deleteLog(no) {
    const settings = useSettingsStore()
    
    const payload = toFormData({
      action: 'delete',
      no: String(no)
    })

    try {
      const { data } = await api.post(settings.api.logAktivitas, payload)
      if (!data.success) {
        throw new Error(data.message || 'Gagal hapus log aktivitas')
      }
      return data
    } catch (error) {
      console.error('Error in deleteLog:', error)
      throw error
    }
  },

  // ✅ LIST ALL LOGS
  async listLogs() {
    const settings = useSettingsStore()
    
    try {
      const { data } = await api.get(settings.api.logAktivitas, {
        params: { action: 'list' }
      })
      
      if (!data?.success) {
        throw new Error(data?.message || 'Gagal mengambil semua log')
      }
      
      return data?.data || []
    } catch (error) {
      console.error('Error in listLogs:', error)
      throw error
    }
  },

  // ════════════════════════════════════════════════════════════════
  // ✅ DASHBOARD CHARTS - BARU (TANPA PERLU DEPLOY ULANG GAS)
  // ════════════════════════════════════════════════════════════════

  /**
   * ✅ MENDAPATKAN TOTAL DAFTAR ALAT
   * Menggunakan endpoint existing 'getdaftarshalat' dan menghitung total
   */
  async getTotalDaftarAlat() {
    try {
      const data = await this.getDaftarAlat()
      return {
        success: true,
        total: data.length,
        data: data
      }
    } catch (error) {
      console.error('Error in getTotalDaftarAlat:', error)
      throw error
    }
  },

  /**
   * ✅ MENDAPATKAN JADWAL KALIBRASI PER BULAN DALAM 1 TAHUN
   * Memanggil endpoint 'getkalibrasiforperiod' untuk setiap bulan
   * Menghitung total dan executed (status === 'Selesai')
   */
  async getKalibrasiScheduleByMonth(year) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    try {
      // ✅ PANGGIL SEMUA BULAN SECARA PARALEL (LEBIH CEPAT)
      const results = await Promise.all(
        months.map(month => this.getKalibrasiForPeriod(month, year))
      )
      
      // ✅ AGREGASI DATA PER BULAN
      const scheduleData = months.map((month, index) => {
        const response = results[index]
        const allItems = response?.data || []
        const count = allItems.length
        const executed = allItems.filter(item => item.status === 'Selesai').length
        const executedPercentage = count > 0 ? Math.round((executed / count) * 100) : 0
        
        return { 
          month, 
          count,
          executed,
          executedPercentage,
          label: month.substring(0, 3) // Untuk chart: Jan, Feb, dst
        }
      })
      
      return {
        success: true,
        year,
        data: scheduleData
      }
    } catch (error) {
      console.error('Error in getKalibrasiScheduleByMonth:', error)
      throw error
    }
  },

  /**
   * ✅ MENDAPATKAN JADWAL PM PER BULAN DALAM 1 TAHUN
   * Memanggil endpoint 'getpmforperiod' untuk setiap bulan
   * Menghitung total dan executed (status === 'Selesai')
   */
  async getPMScheduleByMonth(year) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    try {
      // ✅ PANGGIL SEMUA BULAN SECARA PARALEL (LEBIH CEPAT)
      const results = await Promise.all(
        months.map(month => this.getPMForPeriod(month, year))
      )
      
      // ✅ AGREGASI DATA PER BULAN
      const scheduleData = months.map((month, index) => {
        const response = results[index]
        const allItems = response?.data || []
        const count = allItems.length
        const executed = allItems.filter(item => item.status === 'Selesai').length
        const executedPercentage = count > 0 ? Math.round((executed / count) * 100) : 0
        
        return { 
          month, 
          count,
          executed,
          executedPercentage,
          label: month.substring(0, 3) // Untuk chart: Jan, Feb, dst
        }
      })
      
      return {
        success: true,
        year,
        data: scheduleData
      }
    } catch (error) {
      console.error('Error in getPMScheduleByMonth:', error)
      throw error
    }
  },

  /**
   * ✅ MENDAPATKAN TOTAL JADWAL (KALIBRASI + PM) PER TAHUN
   * Menggabungkan data dari kedua fungsi di atas
   */
  async getTotalSchedules(year) {
    try {
      // ✅ AMBIL DATA SECARA PARALEL (LEBIH EFEKTIF)
      const [kalibrasiResult, pmResult] = await Promise.all([
        this.getKalibrasiScheduleByMonth(year),
        this.getPMScheduleByMonth(year)
      ])
      
      // ✅ HITUNG TOTAL PER TAHUN
      const totalKalibrasi = kalibrasiResult.data.reduce((sum, item) => sum + item.count, 0)
      const totalPM = pmResult.data.reduce((sum, item) => sum + item.count, 0)
      
      return {
        success: true,
        year,
        totalKalibrasi,
        totalPM,
        totalAktivitas: totalKalibrasi + totalPM,
        kalibrasiMonthly: kalibrasiResult.data,
        pmMonthly: pmResult.data
      }
    } catch (error) {
      console.error('Error in getTotalSchedules:', error)
      throw error
    }
  }
}