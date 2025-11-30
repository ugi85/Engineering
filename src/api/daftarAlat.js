// src/api/daftarAlat.js
import api from '@/plugins/axios'
import { useSettingsStore } from '@/stores/settings'

// Utility untuk format POST agar tidak ada masalah spasi menjadi '+'
function toFormData(data) {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value)) // pastikan nilai diubah ke string
    }
  })
  return params
}

export const daftarAlatApi = {
  async fetchList() {
    const settings = useSettingsStore()
    const { data } = await api.get(settings.api.daftarAlat, { params: { action: 'list' } })
    return data.success ? data.data || [] : []
  },


  /**
   * Ambil detail alat berdasarkan ID
   */
  async getToolById(id) {
    const settings = useSettingsStore()
    try {
      const { data } = await api.get(settings.api.daftarAlat, {
        params: { action: 'getToolById', id }
      })
      return data.success ? data.tool : null
    } catch (error) {
      console.error('Error fetching tool by ID:', error)
      return null
    }
  },

  /**
   * Simpan alat (create atau update)
   */
  async saveTool(tool) {
    const settings = useSettingsStore()
    const action = tool.id ? 'updateTool' : 'createTool'
    
    const payload = toFormData({
      action,
      id: tool.id,
      nama_alat: tool.nama_alat,
      merek: tool.merek,
      tipe: tool.tipe,
      serial_number: tool.serial_number,
      tanggal_kalibrasi: tool.tanggal_kalibrasi,
      status: tool.status,
      // tambahkan field lain sesuai kebutuhan
    })

    const { data } = await api.post(settings.api.daftarAlat, payload)
    if (!data.success) {
      throw new Error(data.message || 'Gagal menyimpan data alat')
    }

    // Jika respons tidak mengembalikan `tool`, buat dari payload
    if (!data.tool) {
      data.tool = { id: data.id || tool.id, ...tool }
    }

    return data
  },

  /**
   * Hapus alat berdasarkan ID
   */
  async deleteTool(id) {
    const settings = useSettingsStore()
    const payload = toFormData({ action: 'deleteTool', id })
    const { data } = await api.post(settings.api.daftarAlat, payload)
    if (!data.success) {
      throw new Error(data.message || 'Gagal menghapus data alat')
    }
    return data
  }
}