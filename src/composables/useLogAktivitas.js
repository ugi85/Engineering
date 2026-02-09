// src/composables/useLogAktivitas.js
import { ref, computed, watch } from 'vue'
import { logAktivitasApi } from '@/api/logAktivitas'

export function useLogAktivitas() {

  // ✅ STATE MANAGEMENT
  const loading = ref(false)
  const logs = ref([])
  const currentLog = ref(null)
  const showFormDialog = ref(false)
  const formMode = ref('create')

  // ✅ FILTER STATE
  const selectedMonth = ref('January')
  const selectedYear = ref(new Date().getFullYear().toString())
  const filterType = ref('all')

  // ✅ FORM STATE
  const formData = ref({
    no_id: '',
    cal_id: '',
    jenis: '',
    tanggal: '',
    petugas: '',
    keterangan: ''
  })

  const keteranganError = ref(false)

  // ✅ OPTIONS
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = computed(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())
  })

  const filterOptions = [
    { label: 'Semua', value: 'all' },
    { label: 'PM', value: 'pm' },
    { label: 'Kalibrasi', value: 'kalibrasi' }
  ]

  const jenisOptions = [
    { label: 'PM', value: 'PM' },
    { label: 'Kalibrasi', value: 'Kalibrasi' }
  ]

  // ✅ COMPUTED: Filtered Logs
  const filteredLogs = computed(() => {
    return logs.value.filter(log => {
      if (filterType.value === 'pm') {
        return log.jenis === 'PM'
      } else if (filterType.value === 'kalibrasi') {
        return log.jenis === 'Kalibrasi'
      }
      return true
    })
  })

  const isFormValid = computed(() => {
    return formData.value.keterangan?.trim() !== ''
  })

  // ✅ WATCH: Reset form
  watch(showFormDialog, (newVal) => {
    if (newVal && currentLog.value) {
      formData.value = {
        no_id: currentLog.value['No.ID'] || currentLog.value.no_id || '',
        cal_id: currentLog.value['Calibration Id.'] || currentLog.value.cal_id || '',
        jenis: currentLog.value.jenis || '',
        tanggal: currentLog.value.execute_date || currentLog.value.tanggal || '',
        petugas: currentLog.value.pic || currentLog.value.petugas || '',
        keterangan: currentLog.value.ket || currentLog.value.keterangan || ''
      }
    } else if (newVal) {
      formData.value = {
        no_id: '',
        cal_id: '',
        jenis: '',
        tanggal: '',
        petugas: authStore.user?.name || '',
        keterangan: ''
      }
    }
  })

  // ✅ FETCH DATA
  async function fetchData() {
    loading.value = true

    try {
      let response

      if (filterType.value === 'pm') {
        response = await logAktivitasApi.getPMForPeriod(selectedMonth.value, selectedYear.value)
      } else if (filterType.value === 'kalibrasi') {
        response = await logAktivitasApi.getKalibrasiForPeriod(selectedMonth.value, selectedYear.value)
      } else {
        response = await logAktivitasApi.getAllForPeriod(selectedMonth.value, selectedYear.value)
      }

      logs.value = response.data || []
      console.log(`✅ Berhasil memuat ${logs.value.length} data`)

      return logs.value
    } catch (error) {
      console.error('❌ Error fetching data:', error)
      alert(error.message || 'Gagal memuat data')
      throw error
    } finally {
      loading.value = false
    }
  }

  // ✅ CREATE LOG
  async function createLog(logData) {
    loading.value = true

    try {
      const response = await logAktivitasApi.createLog({
        ...logData,
        petugas: logData.petugas || authStore.user?.name || 'Unknown'
      })

      console.log('✅ Log berhasil disimpan')
      await fetchData()
      closeFormDialog()

      return response
    } catch (error) {
      console.error('❌ Error creating log:', error)
      alert(error.message || 'Gagal menyimpan log')
      throw error
    } finally {
      loading.value = false
    }
  }

  // ✅ UPDATE LOG
  async function updateLog(logData) {
    loading.value = true

    try {
      const response = await logAktivitasApi.updateLog(logData)

      console.log('✅ Log berhasil diupdate')
      await fetchData()
      closeFormDialog()

      return response
    } catch (error) {
      console.error('❌ Error updating log:', error)
      alert(error.message || 'Gagal update log')
      throw error
    } finally {
      loading.value = false
    }
  }

  // ✅ DELETE LOG (Tanpa ConfirmDialog PrimeVue)
  async function deleteLog(no) {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus log ini?')
    if (!confirmed) return false

    loading.value = true

    try {
      await logAktivitasApi.deleteLog(no)

      console.log('✅ Log berhasil dihapus')
      await fetchData()
      return true
    } catch (error) {
      console.error('❌ Error deleting log:', error)
      alert(error.message || 'Gagal menghapus log')
      return false
    } finally {
      loading.value = false
    }
  }

  // ✅ GET LOG BY NO
  async function getLogByNo(no) {
    try {
      const log = await logAktivitasApi.getLogByNo(no)
      return log
    } catch (error) {
      console.error('❌ Error getting log:', error)
      alert(error.message || 'Gagal mengambil detail log')
      throw error
    }
  }

  // ✅ GET DAFTAR ALAT
  async function getDaftarAlat() {
    try {
      const data = await logAktivitasApi.getDaftarAlat()
      return data
    } catch (error) {
      console.error('❌ Error getting daftar alat:', error)
      alert(error.message || 'Gagal mengambil daftar alat')
      throw error
    }
  }

  // ✅ FORM DIALOG
  function openFormDialog(mode = 'create', log = null) {
    formMode.value = mode
    currentLog.value = log ? { ...log } : null
    showFormDialog.value = true
  }

  function closeFormDialog() {
    showFormDialog.value = false
    currentLog.value = null
    formMode.value = 'create'
    keteranganError.value = false
  }

  // ✅ HANDLE FILTER CHANGE
  async function handleFilterChange() {
    await fetchData()
  }

  // ✅ HANDLE FORM SUBMIT
  async function handleSubmit() {
    if (!isFormValid.value) {
      keteranganError.value = true
      alert('Keterangan wajib diisi!')
      return
    }

    keteranganError.value = false

    try {
      if (formMode.value === 'create') {
        await createLog(formData.value)
      } else {
        await updateLog({
          ...formData.value,
          no: currentLog.value.log_no || currentLog.value.no
        })
      }
    } catch (error) {
      console.error('Form submit error:', error)
    }
  }

  // ✅ HELPER FUNCTIONS
  function getStatusBadgeClass(status) {
    if (status === 'Selesai') return 'badge-success'
    if (status === 'Belum') return 'badge-danger'
    return 'badge-secondary'
  }

  function getJenisBadgeClass(jenis) {
    if (jenis === 'PM') return 'badge-info'
    if (jenis === 'Kalibrasi') return 'badge-warning'
    return 'badge-secondary'
  }

  // ✅ INIT
  async function init(month = 'January', year = new Date().getFullYear().toString()) {
    selectedMonth.value = month
    selectedYear.value = year
    await fetchData()
  }

  return {
    // State
    loading,
    logs,
    currentLog,
    showFormDialog,
    formMode,
    selectedMonth,
    selectedYear,
    filterType,
    formData,
    keteranganError,

    // Computed
    filteredLogs,
    isFormValid,

    // Options
    months,
    years,
    filterOptions,
    jenisOptions,

    // Methods
    fetchData,
    getAllForPeriod: fetchData,
    getLogsByMonthYear: fetchData,
    getDaftarAlat,
    listLogs: fetchData,
    getLogByNo,
    createLog,
    updateLog,
    deleteLog,
    openFormDialog,
    closeFormDialog,
    handleFilterChange,
    handleSubmit,
    getStatusBadgeClass,
    getJenisBadgeClass,
    init
  }
}