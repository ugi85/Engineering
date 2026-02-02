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

  // ✅ TAMBAHKAN INI
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
  }
}