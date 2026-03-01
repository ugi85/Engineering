// src/composables/useDaftarAlat.js
import { ref, nextTick, watch } from 'vue'
import { daftarAlatApi } from '@/api/daftarAlatApi'

// === Konfigurasi Cache ===
const CACHE_KEY = 'daftar_alat_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit

export function useDaftarAlat() {
  const tools = ref([])
  const loading = ref(true)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  let dataTableInstance = null

  // === Inisialisasi DataTables ===
  const initDataTable = async () => {
    await nextTick()
    if (dataTableInstance) {
      dataTableInstance.clear()
      dataTableInstance.destroy(true) // true = bersihkan wrapper
      dataTableInstance = null
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
        autoWidth: true,
        responsive: false,
        scrollX: true,
        lengthMenu: [
        [10, 25, 50, 100, -1],    // nilai -1 = "All"
        [10, 25, 50, 100, "All"]  // label yang ditampilkan
        ],
        language: {
          // url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/id.json',
          search: "_INPUT_",
          searchPlaceholder: "Cari data..."
        },
      })
    }
  }

  watch(
    tools,
    () => {
      initDataTable()
    },
    { deep: true }
  )

  // === Fetch dengan Cache + Background Revalidate ===
  const fetchList = async (force = false) => {
    loading.value = true

    // Coba baca dari cache
    const cached = localStorage.getItem(CACHE_KEY)
    const now = Date.now()

    if (!force && cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < CACHE_DURATION) {
          // Tampilkan langsung dari cache
          tools.value = data
          loading.value = false
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

   // === CREATE / UPDATE: Simpan alat ===
  const saveTool = async (tool) => {
    isSaving.value = true
    try {
      const result = await daftarAlatApi.saveTool(tool)
      // ⛔ Buang cache lama
      localStorage.removeItem(CACHE_KEY)

      // ⛔ Paksa ambil data terbaru dari server
      await fetchList(true)
      
      Swal.fire(
        'Berhasil!',
        `Alat berhasil ${tool.no ? 'diupdate' : 'ditambahkan'}`,
        'success'
      )
      return result
    } catch (error) {
      console.error('Gagal simpan alat:', error)
      Swal.fire('Error!', error.message || 'Gagal menyimpan data alat', 'error')
    } finally {
      isSaving.value = false
    }
  }

  const deleteTool = async (no, description = '') => {
  const confirm = await Swal.fire({
    title: 'Hapus Alat?',
    text: `Yakin hapus alat "${description || no}"? Data tidak bisa dikembalikan!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  })

  if (!confirm.isConfirmed) return

  isDeleting.value = true
  try {
    console.log('[DEBUG] Memulai hapus alat dengan no:', no) // ✅ Debug 1

    const result = await daftarAlatApi.deleteTool(no)

    // ✅ Debug 2: Periksa respons API
    console.log('[DEBUG] Respons API delete:', result)

    // ✅ Validasi respons
    if (!result || !result.success) {
      throw new Error(result?.message || 'Respons tidak valid dari server')
    }

        // ⚡ Optimistic update: langsung hilangkan di UI
    tools.value = tools.value.filter((t) => String(t.no) !== String(no))

    // Buang cache lama
    localStorage.removeItem(CACHE_KEY)

    // Ambil ulang dari server (force = true, abaikan cache)
    await fetchList(true)
    
    Swal.fire('Berhasil!', 'Alat berhasil dihapus', 'success')
    return result

  } catch (error) {
    // ✅ Debug 3: Tangkap dan tampilkan error lengkap
    console.error('[ERROR] Gagal menghapus alat:', {
      no,
      error: error.message,
      stack: error.stack,
      originalError: error
    })

    // Tampilkan pesan error ke pengguna
    Swal.fire(
      'Gagal Menghapus!',
      error.message || 'Terjadi kesalahan saat menghapus data',
      'error'
    )
  } finally {
    isDeleting.value = false
    console.log('[DEBUG] Proses hapus selesai') // ✅ Debug 4
  }
}

  return {
    tools,
    loading,
    fetchList,
    saveTool,
    deleteTool,
    isSaving,
    isDeleting
  }
}