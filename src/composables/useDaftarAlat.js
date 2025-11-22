// src/composables/useDaftarAlat.js
import { ref, nextTick, watch } from 'vue'
import { daftarAlatApi } from '@/api/daftarAlat'

// === Konfigurasi Cache ===
const CACHE_KEY = 'daftar_alat_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit

export function useDaftarAlat() {
  const tools = ref([])
  const loading = ref(true)
  let dataTableInstance = null

  // === Inisialisasi DataTables ===
  const initDataTable = async () => {
    await nextTick()
    if (dataTableInstance) {
      dataTableInstance.destroy()
    }

    // Sesuaikan dengan class di template Anda
    const table = document.querySelector('.daftar-alat-table')
    if (table) {
      // @ts-ignore
      dataTableInstance = $(table).DataTable({
        paging: true,
        lengthChange: true, 
        searching: true,
        ordering: true,
        info: true, 
        autoWidth: false,
        responsive: false,
        scrollX: true,
        // Hapus rowId karena data tidak punya field `id`
      })
    }
  }

  watch(tools, initDataTable)

  // === Fetch dengan Cache + Background Revalidate ===
  const fetchList = async () => {
    loading.value = true

    // Coba baca dari cache
    const cached = localStorage.getItem(CACHE_KEY)
    const now = Date.now()

    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < CACHE_DURATION) {
          // Tampilkan langsung dari cache
          tools.value = data
          loading.value = false

          // Update di background
          daftarAlatApi
            .fetchList()
            .then((freshData) => {
              tools.value = freshData
              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ data: freshData, timestamp: Date.now() })
              )
            })
            .catch((err) => {
              console.warn('Background update gagal:', err)
            })

          return
        }
      } catch (e) {
        console.warn('Cache corrupted, ignoring:', e)
      }
    }

    // Jika tidak ada cache valid, ambil dari API
    try {
      const freshData = await daftarAlatApi.fetchList()
      tools.value = freshData
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: freshData, timestamp: now })
      )
    } catch (error) {
      console.error('Gagal mengambil data alat:', error)
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