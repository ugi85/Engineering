<script setup>
import { ref, watch, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { usePermissions } from '@/composables/usePermissions'

const permission = usePermissions()

// Key untuk force re-render saat permission berubah
const renderKey = ref(0)

// State untuk menu toggle (menggantikan AdminLTE jQuery treeview)
const openMenus = ref({
  logAktivitas: false,
  settings: false
})

// System name from config
const systemName = ref('EEHS Dashboard')
const logoUrl = ref('/favicon.ico')
const logoKey = ref(0)

// Computed untuk login status - akses .value karena permission.isLoggedIn sudah computed
const isLoggedIn = computed(() => permission.isLoggedIn.value)

// Computed untuk permission checks
const canViewUsers = computed(() => permission.can('user:view'))
const canViewDaftarAlat = computed(() => permission.can('daftarAlat:view'))
const canViewJadwalKalibrasi = computed(() => permission.can('jadwalKalibrasi:view'))
const canViewLogAktivitas = computed(() => permission.can('logAktivitas:view'))
const canViewConfig = computed(() => permission.can('config:view'))

// Computed untuk cek apakah user adalah superadmin
const isSuperAdmin = computed(() => {
  if (!isLoggedIn.value) {
    console.log('[Sidebar] isSuperAdmin - Not logged in')
    return false
  }
  const user = permission.user.value
  console.log('[Sidebar] isSuperAdmin - User:', user, 'Role:', user?.role)
  // Check role = 'superadmin' OR email starts with 'super@'
  return user && (
    (user.role && user.role.toLowerCase() === 'superadmin') ||
    (user.email && user.email.toLowerCase().startsWith('super@'))
  )
})

// Toggle menu function (menggantikan AdminLTE jQuery treeview)
const toggleMenu = (menuName) => {
  openMenus.value[menuName] = !openMenus.value[menuName]
}

// Force refresh sidebar saat permission berubah
const handlePermissionChange = () => {
  console.log('[Sidebar] Permission changed - forcing re-render')
  renderKey.value++
}

// Function to load config
const loadConfig = () => {
  try {
    const config = localStorage.getItem('qms_frontend_config_v2')
    if (config) {
      const parsed = JSON.parse(config)

      // Load system name
      if (parsed.systemName) {
        systemName.value = parsed.systemName
      }

      // Load logo - priority: logoDataUrl > logoUrl > favicon
      if (parsed.logoDataUrl && parsed.logoDataUrl.trim() !== '') {
        logoUrl.value = parsed.logoDataUrl
      } else if (parsed.logoUrl && parsed.logoUrl.trim() !== '') {
        logoUrl.value = parsed.logoUrl
      } else {
        logoUrl.value = '/favicon.ico'
      }

      logoKey.value++

      // Update favicon in document head
      const link = document.querySelector("link[rel~='icon']")
      if (link) {
        if (parsed.faviconDataUrl) {
          link.href = parsed.faviconDataUrl
        } else if (parsed.faviconUrl) {
          link.href = parsed.faviconUrl
        } else {
          link.href = '/favicon.ico'
        }
      }
    }
  } catch (e) {
    console.error('Error loading config:', e)
  }
}

// Load config on mount
onMounted(() => {
  loadConfig()

  // Listen untuk permission changes
  window.addEventListener('permissions-changed', handlePermissionChange)

  console.log('[Sidebar] Mounted - watching for permission changes')
})

onUnmounted(() => {
  window.removeEventListener('permissions-changed', handlePermissionChange)
})

// Watch for config changes
watch(
  () => localStorage.getItem('qms_frontend_config_v2'),
  () => {
    loadConfig()
  }
)

// Handle logout
const handleLogout = () => {
  permission.logout()
}
</script>

<style scoped>
/* Animasi rotate untuk arrow menu */
.rotate-angle {
  transform: rotate(-90deg);
  transition: transform 0.3s ease;
}

/* Ensure menu-open shows the submenu */
.menu-open > .nav-treeview {
  display: block;
}

/* Smooth transition for submenu */
.nav-treeview {
  transition: all 0.3s ease;
}
</style>

<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
      <RouterLink to="/old/dashChart" class="brand-link">
      <img
        :key="logoKey"
        :src="logoUrl"
        :alt="systemName + ' Logo'"
        class="brand-image img-circle elevation-3"
        style="opacity: .8"
        @error="logoUrl = '/favicon.ico'; logoKey++"
      >
      <span class="brand-text font-weight-light">{{ systemName }}</span>
    </RouterLink>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li class="nav-item menu-open">
            <ul class="nav nav-treeview">
              <!-- Dashboard - Selalu tampil untuk semua orang -->
              <li class="nav-item">
                <RouterLink to="/old/dashChart" class="nav-link">
                  <i class="fas fa-tachometer-alt nav-icon"></i>
                  <p>Dashboard Chart</p>
                </RouterLink>
              </li>

              <!-- Menu di bawah ini tampil untuk semua (public + login) -->
              <li class="nav-item" v-if="canViewUsers" :key="'users-' + renderKey">
                <RouterLink to="/old/user" class="nav-link">
                  <i class="fas fa-users nav-icon"></i>
                  <p>Data Users</p>
                </RouterLink>
              </li>
              <li class="nav-item" v-if="canViewDaftarAlat" :key="'daftarAlat-' + renderKey">
                <RouterLink to="/old/daftarAlat" class="nav-link">
                  <i class="fas fa-tools nav-icon"></i>
                  <p>Daftar Alat</p>
                </RouterLink>
              </li>
              <li class="nav-item" v-if="canViewJadwalKalibrasi" :key="'jadwalKalibrasi-' + renderKey">
                <RouterLink to="/old/jadwalKalibrasi" class="nav-link">
                  <i class="fas fa-balance-scale nav-icon"></i>
                  <p>Jadwal Kalibrasi</p>
                </RouterLink>
              </li>
            </ul>
          </li>

          <!-- Log Aktifitas - Tampil untuk semua (public + login) -->
          <li class="nav-item" v-if="canViewLogAktivitas" :key="'logAktivitas-' + renderKey" :class="{ 'menu-open': openMenus.logAktivitas }">
            <a href="#" class="nav-link" @click.prevent="toggleMenu('logAktivitas')">
              <i class="nav-icon fas fa-edit"></i>
              <p>
                Log Aktifitas
                <i class="fas fa-angle-left right" :class="{ 'rotate-angle': openMenus.logAktivitas }"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <RouterLink to="/old/logCal" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Log Kalibrasi</p>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/old/logPm" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Log PM</p>
                </RouterLink>
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <RouterLink to="/old/allAktivitas" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>All Aktivitas</p>
                </RouterLink>
              </li>
            </ul>
          </li>

          <!-- Settings - Hanya untuk LOGIN -->
          <li class="nav-item" v-if="isLoggedIn && canViewConfig" :key="'settings-' + renderKey" :class="{ 'menu-open': openMenus.settings }">
            <a href="#" class="nav-link" @click.prevent="toggleMenu('settings')">
              <i class="fas fa-cogs nav-icon"></i>
              <p>
                Settings
                <i class="right fas fa-angle-left" :class="{ 'rotate-angle': openMenus.settings }"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item" v-if="canViewConfig" :key="'configurasi-' + renderKey">
                <RouterLink to="/old/configurasi" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Konfigurasi Sistem</p>
                </RouterLink>
              </li>
              <li class="nav-item" v-if="isSuperAdmin" :key="'roles-' + renderKey">
                <RouterLink to="/old/roles" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Roles & Permissions</p>
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
