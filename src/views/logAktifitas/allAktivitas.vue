<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useLogAktivitas } from '@/composables/useLogAktivitas'
import { printService } from '@/services/printService'

// ✅ Ambil semua fungsi yang diperlukan dari composable
// ❌ HAPUS: formatDateDisplay dari destructuring (karena akan duplicate)
const { 
  loading,
  allActivityLogs,
  initAllActivities,
  fetchAllLogs,
  deleteLog,
  updateLog,
  initDataTable,
  refreshDataTable,
  getStatusBadgeClass,
  getJenisBadgeClass,
   // ✅ STATE & METHODS UNTUK FORM
  showFormDialog,
  formMode,
  currentLog,
  formData,
  isSaving,
  openFormDialog,
  closeFormDialog,
  handleSubmit
} = useLogAktivitas()

// ✅ State untuk error handling
const pageError = ref(null)

// print helpers
const printDate = ref('')
const handlePrint = () => {
  if (allActivityLogs.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Tidak Ada Data',
      text: 'Belum ada data untuk dicetak',
      confirmButtonText: 'OK'
    })
    return
  }

  const now = new Date()
  printDate.value = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
  
  // Call print service
  printService.printAllActivity(allActivityLogs.value, 'All', new Date().getFullYear().toString())
}

// ✅ State untuk refresh
const refresh = () => {
  pageError.value = null
  fetchAllLogs()
}

// ✅ BUKA MODAL EDIT
const openEditDialog = (log) => {
  openFormDialog('update', log)
  $('#logFormModal').modal('show')
}
// ✅ TUTUP MODAL (DIPANGGIL SAAT MODAL DITUTUP)
const handleCloseModal = () => {
  closeFormDialog()
  $('#logFormModal').modal('hide')
}

// ✅ SIMPAN PERUBAHAN
const handleSave = async () => {
  if (!formData.value.keterangan?.trim()) {
    Swal.fire('Peringatan!', 'Keterangan wajib diisi', 'warning')
    return
  }
  
  try {
    await handleSubmit()
    $('#logFormModal').modal('hide')
    await new Promise(resolve => setTimeout(resolve, 200))
     // ✅ REFRESH DATATABLES SETELAH DATA DAN DOM SIAP
    await refreshDataTable('.jadwal-kalibrasi-table')
    Swal.fire('Berhasil!', 'Log aktivitas berhasil diupdate', 'success')
  } catch (error) {
    console.error('Error update log:', error)
    Swal.fire('Error!', error.message || 'Gagal update log', 'error')
  }
}

// ✅ Fungsi Hapus Log dengan konfirmasi SweetAlert
const handleDelete = async (no, noId, calId) => {
  try {
    const result = await Swal.fire({
      title: 'Hapus Log Aktivitas?',
      html: `Yakin hapus log <strong>${noId} - ${calId}</strong>?<br><small class="text-muted">Data tidak bisa dikembalikan!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      await deleteLog(no)
      await new Promise(resolve => setTimeout(resolve, 200))
       // ✅ REFRESH DATATABLES SETELAH DATA DAN DOM SIAP
    await refreshDataTable('.jadwal-kalibrasi-table')
      Swal.fire('Dihapus!', 'Log aktivitas berhasil dihapus.', 'success')
    }
  } catch (error) {
    console.error('Error saat hapus log:', error)
    Swal.fire('Error!', error.message || 'Gagal menghapus log', 'error')
  }
}

// ✅ WATCH UNTUK KONTROL MODAL
watch(showFormDialog, (newVal) => {
  if (newVal) {
    $('#logFormModal').modal('show')
  } else {
    $('#logFormModal').modal('hide')
  }
})

// ✅ Inisialisasi dengan error handling lengkap
onMounted(async () => {
  try {
    await initAllActivities()
    await nextTick()
    
    // Validasi jQuery & DataTables
    if (typeof window.$ === 'undefined' || typeof window.$.fn.DataTable === 'undefined') {
      throw new Error('jQuery atau DataTables belum di-load')
    }
    
    initDataTable('.jadwal-kalibrasi-table')
    console.log('[AllAktivitas] Inisialisasi berhasil')
  } catch (error) {
    console.error('[AllAktivitas] Error:', error)
    pageError.value = error.message || 'Gagal memuat halaman'
    Swal.fire('Error!', error.message || 'Gagal memuat data', 'error')
  }
})
</script>

<template>
  <div class="content-wrapper">
    <!-- Header -->
    <section class="content-header">
      <div class="container-fluid d-flex justify-content-between align-items-start">
        <div>
          <h1 class="mb-0">Semua Log Aktivitas</h1>
          <small class="text-muted">Menampilkan semua aktivitas Kalibrasi dan PM yang pernah dilaksanakan</small>
        </div>
        <div class="d-flex align-items-center no-print">
          <span class="badge badge-info mr-3">
            <i class="fas fa-database mr-1"></i>Total: {{ allActivityLogs.length }}
          </span>
          <button
            class="btn btn-secondary btn-sm mr-2"
            :disabled="loading || allActivityLogs.length===0"
            @click="handlePrint"
            title="Cetak semua log aktivitas"
          >
            <i class="fas fa-print mr-1"></i>Print
          </button>
          <!-- <button 
            @click="refresh" 
            class="btn btn-outline-secondary"
            :disabled="loading"
          >
            <i class="fas fa-sync-alt mr-1"></i>Refresh
          </button> -->
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <!-- print header -->
        <div class="print-header d-none">
          <div class="company-logo">AGIS</div>
          <div class="company-name">PT. AGIS INSTRUMENT SERVICES</div>
          <div class="company-address">Jl. Raya Industri No. 123, Kawasan Industri MM2100</div>
          <div class="company-address">Cikarang Barat, Bekasi 17520 - Indonesia</div>
          <div class="company-address">Telp: (021) 897-1234 | Email: info@agis.co.id</div>
          <h1 class="report-title">LAPORAN LOG AKTIVITAS</h1>
          <div class="report-period">
            Dicetak pada: {{ printDate }}
          </div>
        </div>
        <div class="card">
          <!-- <div class="card-header bg-primary">
            <h3 class="card-title text-white">
              <i class="fas fa-history mr-2"></i>Riwayat Aktivitas Lengkap
            </h3>
          </div> -->
          
          <div class="card-body">
            <!-- ✅ ERROR STATE - TAMPILKAN JIKA ADA ERROR -->
            <div v-if="pageError" class="alert alert-danger alert-dismissible fade show no-print">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              <strong>Error:</strong> {{ pageError }}
              <button type="button" class="close" @click="pageError = null">
                <span>&times;</span>
              </button>
            </div>

            <!-- ✅ LOADING STATE -->
            <div v-else-if="loading" class="text-center py-5 no-print">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <p class="mt-3 text-primary font-weight-bold">Memuat data log aktivitas...</p>
              <p class="text-muted small">Mohon tunggu, sedang mengambil data dari server...</p>
            </div>

            <!-- ✅ DATA DITEMUKAN -->
            <div v-else-if="allActivityLogs.length > 0">
              <div class="table-responsive">
                <table class="table table-bordered table-hover jadwal-kalibrasi-table">
                  <thead>
                    <tr>
                      <th class="align-middle text-center" >No</th>
                      <th class ="align-middle text-center" >No.ID</th>
                      <th class ="align-middle text-center" >Description</th>
                      <th class ="align-middle text-center" >Log ID</th>
                      <th class ="align-middle text-center" >Jenis</th>
                      <th class ="align-middle text-center" >PIC</th>
                      <th class ="align-middle text-center" >Execute Date</th>
                      <th class ="align-middle text-center">Keterangan</th>
                      <!-- <th  class="text-center">Status</th> -->
                      <th class ="align-middle text-center">Aksi</th>
                    </tr>  
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(log, index) in allActivityLogs" 
                      :key="log.no || index"
                    >
                      <td class="text-center font-weight-bold">{{ index + 1 }}</td>
                      <td class="font-weight-bold">{{ log.no_id || '-' }}</td>
                      <td>{{ log.description || log.type_model || '-' }}</td>
                      <td class="font-italic">{{ log.cal_id || '-' }}</td>
                      <td class="text-center">
                        <span :class="['badge', getJenisBadgeClass(log.jenis)]">
                          {{ log.jenis || '-' }}
                        </span>
                      </td>
                      <td class="text-center font-weight-bold">{{ log.petugas || '-' }}</td>
                      <!-- ✅ GUNAKAN formattedDate yang sudah di-compute di composable -->
                      <td class="text-center font-weight-bold">
                        <span :class="log.status === 'Selesai' ? 'text-success' : 'text-muted'">
                          {{ log.formattedDate || '-' }}
                        </span>
                      </td>
                      <td>{{ log.keterangan || '-' }}</td>
                       <td class="text-center">
                        <!-- ✅ TAMBAHKAN BUTTON EDIT -->
                        <button 
                          class="btn btn-warning btn-sm mr-1" 
                          @click="openEditDialog(log)"
                          title="Edit Log"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          class="btn btn-danger btn-sm" 
                          @click="handleDelete(log.no, log.no_id, log.cal_id)"
                          title="Hapus Log"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Summary Info -->
              <div class="alert alert-info mt-4 mb-0">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <i class="fas fa-info-circle mr-2"></i>
                    <strong>Info:</strong> Gunakan fitur search, sort, dan paging untuk navigasi
                  </div>
                  <div class="d-flex">
                    <span class="badge badge-light mr-2">
                      <i class="fas fa-balance-scale mr-1"></i>{{ allActivityLogs.filter(l => l.jenis === 'Kalibrasi').length }} Kalibrasi
                    </span>
                    <span class="badge badge-light">
                      <i class="fas fa-tools mr-1"></i>{{ allActivityLogs.filter(l => l.jenis === 'PM').length }} PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ DATA TIDAK DITEMUKAN -->
            <div v-else class="text-center py-5">
              <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
              <p class="text-muted mt-3">
                <strong>Belum ada log aktivitas</strong><br>
                <small class="text-muted">Log aktivitas akan muncul setelah jadwal kalibrasi atau PM dilaksanakan</small>
              </p>
              <button @click="refresh" class="btn btn-primary mt-3">
                <i class="fas fa-sync-alt mr-1"></i>Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

     <!-- ✅ MODAL EDIT LOG -->
    <div class="modal fade" id="logFormModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-edit mr-2"></i>
              {{ formMode === 'create' ? 'Tambah' : 'Edit' }} Log Aktivitas
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="handleCloseModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>No. ID</label>
              <input 
                v-model="formData.no_id" 
                type="text" 
                class="form-control" 
                readonly 
                placeholder="No. ID"
              />
            </div>
            <div class="form-group">
              <label>Log ID</label>
              <input 
                v-model="formData.cal_id" 
                type="text" 
                class="form-control" 
                readonly 
                placeholder="Log ID"
              />
            </div>
            <div class="form-group">
              <label>Jenis Aktivitas</label>
              <input 
                v-model="formData.jenis" 
                type="text" 
                class="form-control" 
                readonly 
                :class="formData.jenis === 'PM' ? 'bg-info' : 'bg-warning'"
                placeholder="Jenis"
              />
            </div>
            <div class="form-group">
              <label>PIC (Petugas)</label>
              <input 
                v-model="formData.petugas" 
                type="text" 
                class="form-control" 
                placeholder="Nama petugas"
                required
              />
            </div>
            <div class="form-group">
              <label>Tanggal Pelaksanaan</label>
              <input 
                v-model="formData.tanggal" 
                type="date" 
                class="form-control" 
                required
              />
            </div>
            <div class="form-group">
              <label>Keterangan</label>
              <textarea 
                v-model="formData.keterangan" 
                class="form-control" 
                rows="3" 
                placeholder="Keterangan hasil aktivitas"
                required
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-dismiss="modal"
              @click="handleCloseModal"
              :disabled="isSaving"
            >
              Batal
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="handleSave"
              :disabled="isSaving || !formData.keterangan?.trim()"
            >
              <span v-if="isSaving">
                <span class="spinner-border spinner-border-sm mr-1"></span>
                Menyimpan...
              </span>
              <span v-else>
                <i class="fas fa-save mr-1"></i>
                {{ formMode === 'create' ? 'Simpan' : 'Update' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.card-header {
  border-radius: 0.5rem 0.5rem 0 0 !important;
}

.table-responsive { 
  overflow-x: auto; 
  margin-top: 15px;
}

.table thead th { 
  background-color: #e9f0f7; 
  color: black;
  font-weight: 600; 
  vertical-align: middle;
}

/* ✅ TABEL NORMAL DENGAN HOVER EFFECT SAJA */
.table-hover tbody tr:hover {
  background-color: #f8f9fa !important; /* ✅ HOVER ABU-ABU TERANG */
}


.badge {
  padding: 0.4em 0.8em;
  border-radius: 0.25rem;
  font-size: 0.85em;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.badge-success { 
  background-color: #28a745; 
  color: white; 
}

.badge-danger { 
  background-color: #dc3545; 
  color: white; 
}

.badge-info {
  background-color: #17a2b8;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn { 
  cursor: pointer; 
}

.btn:disabled { 
  opacity: 0.65; 
  cursor: not-allowed; 
}

/* Center alignment */
.table td.text-center,
.table th.text-center {
  text-align: center;
  vertical-align: middle;
}

/* Table styling */
.table-sm {
  font-size: 0.875rem;
}

.table-sm th,
.table-sm td {
  padding: 0.6rem;
  vertical-align: middle;
}

/* Alert styling */
.alert {
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

/* print-specific helpers */
@media print {
  @page {
    size: landscape;
    margin: 10mm;
  }
  .no-print {
    display: none !important;
  }
  .print-header.d-none {
    display: block !important;
  }
  .print-header {
    text-align: center;
    margin-bottom: 20px;
  }
  .print-header .company-logo {
    font-size: 28px;
    font-weight: bold;
    color: #003366;
  }
  .print-header .company-name {
    font-size: 24px;
    font-weight: bold;
    color: #003366;
  }
  .print-header .company-address {
    font-size: 12px;
    color: #555;
    line-height: 1.3;
  }
  .print-header .report-title {
    margin-top: 10px;
    font-size: 22px;
    color: #0056b3;
    font-weight: bold;
  }
  .print-header .report-period {
    font-size: 14px;
    color: #666;
  }
  .print-footer {
    text-align: center;
    margin-top: 30px;
    font-size: 12px;
    color: #666;
  }
  .print-footer .footer-timestamp {
    font-weight: 500;
    color: #0056b3;
    margin-bottom: 5px;
  }
  .print-footer .footer-page {
    margin-top: 3px;
  }
  .print-footer .footer-disclaimer {
    margin-top: 15px;
    font-style: italic;
    color: #888;
    font-size: 11px;
  }
  /* hide datatables controls */
  .dataTables_wrapper {
    display: none !important;
  }
}

.dataTables_info {
  font-size: 0.875rem;
  color: #6c757d;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-sm th,
  .table-sm td {
    padding: 0.4rem;
    font-size: 0.8rem;
  }
  
  .content-header .badge {
    margin-bottom: 0.5rem;
  }
  
  .alert {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .alert .d-flex {
    flex-direction: column;
    width: 100%;
  }
  
  .alert .badge {
    margin-top: 0.5rem;
    margin-left: 0;
  }
}
</style>