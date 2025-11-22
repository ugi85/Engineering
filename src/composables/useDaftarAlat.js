// src/composables/useDaftarAlat.js
import { ref, nextTick, watch } from 'vue'
import { daftarAlatApi } from '@/api/daftarAlat'

export function useDaftarAlat() {
  const tools = ref([])
  const loading = ref(true)
  let dataTableInstance = null


  const initDataTable = async () => {
    await nextTick()
    if (dataTableInstance) dataTableInstance.destroy()

    dataTableInstance = $('.example2').DataTable({
      paging: true,
      lengthChange: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      responsive: true,
      rowId: row => row.id
    })
  }



  // Re-inisialisasi DataTable saat data berubah
  watch(tools, initDataTable)

  // Ambil data dengan parameter action=readTools
  const fetchList = async () => {
    loading.value = true
    try {
      // API akan mengirim: ?action=readTools
      tools.value = await daftarAlatApi.fetchList()
    } catch (error) {
      console.error('Gagal memuat daftar alat:', error)
      tools.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    tools,
    loading,
    fetchList
  }
}