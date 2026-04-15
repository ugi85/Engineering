import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/stores/userStore'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Views
import Dashboard from '@/views/DashboardChart.vue'
import Login from '@/views/pages/examples/login.vue'
import SystemMigration from '@/views/SystemMigration.vue'

// ============================================
// URL SWITCH CONFIGURATION
// ============================================
// VITE_SYSTEM_MODE in .env:
//   - 'landing': Root shows System Migration info page (default)
//   - 'old': Root directly shows old system dashboard
// ============================================
const SYSTEM_MODE = import.meta.env.VITE_SYSTEM_MODE || 'landing'

// Helper function for URL generation (can be used in components)
const generateUrl = (oldPath, newPath) => {
  if (SYSTEM_MODE === 'old') return oldPath
  return newPath || `/old${oldPath}`
}

// ============================================
// ROUTE DEFINITIONS
// ============================================
const routes = [
  // ========================================
  // 1. LANDING PAGE - System Migration Info
  // ========================================
  {
    path: '/',
    name: 'system-migration',
    component: SystemMigration,
    meta: { title: 'Informasi Update Sistem' }
  },

  // ========================================
  // 2. OLD SYSTEM - Wrapped in MainLayout
  // ========================================
  {
    path: '/old',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'old-dashboard',
        component: Dashboard,
      },
      {
        path: 'dashboard',
        name: 'old-dashboard-redirect',
        redirect: { name: 'old-dashboard' }
      },
      {
        path: 'dashboardV2',
        name: 'old-dashboardV2',
        component: () => import('@/views/DashboardV2.vue'),
      },
      {
        path: 'dashboardV3',
        name: 'old-dashboardV3',
        component: () => import('@/views/DashboardV3.vue'),
      },
      {
        path: 'dashChart',
        name: 'old-dashboardChart',
        component: () => import('@/views/DashboardChart.vue'),
      },
      {
        path: 'daftarAlat',
        name: 'old-daftarAlat',
        component: () => import('@/views/daftarAlat/list.vue'),
      },
      {
        path: 'jadwalKalibrasi',
        name: 'old-jadwalKalibrasi',
        component: () => import('@/views/jadwalKalibrasi/list.vue'),
      },
      {
        path: 'logCal',
        name: 'old-logCal',
        component: () => import('@/views/logAktifitas/kalibrasi.vue'),
      },
      {
        path: 'logPm',
        name: 'old-logPm',
        component: () => import('@/views/logAktifitas/pm.vue'),
      },
      {
        path: 'allAktivitas',
        name: 'old-allAktivitas',
        component: () => import('@/views/logAktifitas/allAktivitas.vue'),
      },
      {
        path: 'configurasi',
        name: 'old-configurasi',
        component: () => import('@/views/settings/config.vue'),
      },
      {
        path: 'roles',
        name: 'old-roles',
        component: () => import('@/views/roles/list.vue'),
        meta: { requiresAuth: true, requiresSuperadmin: true }
      },
      {
        path: 'user',
        name: 'old-user',
        component: () => import('@/views/users/list.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'chartMonitoring',
        name: 'old-chartMonitoring',
        component: () => import('@/views/ChartsMonitoring.vue'),
      },
      {
        path: 'widgets',
        name: 'old-widgets',
        component: () => import('@/views/pages/widgets.vue'),
      },
      {
        path: 'top-nav',
        name: 'old-top-nav',
        component: () => import('@/views/pages/layout/top-nav.vue'),
      },
      {
        path: 'top-nav-sidebar',
        name: 'old-top-nav-sidebar',
        component: () => import('@/views/pages/layout/top-nav-sidebar.vue'),
      },
      {
        path: 'boxed',
        name: 'old-boxed',
        component: () => import('@/views/pages/layout/boxed.vue'),
      },
      {
        path: 'charts',
        name: 'old-charts',
        component: () => import('@/views/pages/charts/chartjs.vue'),
      },
      {
        path: 'charts/flot',
        name: 'old-charts-flot',
        component: () => import('@/views/pages/charts/flot.vue'),
      },
      {
        path: 'charts/inline',
        name: 'old-charts-inline',
        component: () => import('@/views/pages/charts/inline.vue'),
      },
      {
        path: 'charts/uplot',
        name: 'old-charts-uplot',
        component: () => import('@/views/pages/charts/uplot.vue'),
      },
      {
        path: 'ui/general',
        name: 'old-ui-general',
        component: () => import('@/views/pages/ui/general.vue'),
      },
      {
        path: 'ui/icons',
        name: 'old-ui-icons',
        component: () => import('@/views/pages/ui/icons.vue'),
      },
      {
        path: 'ui/buttons',
        name: 'old-ui-buttons',
        component: () => import('@/views/pages/ui/buttons.vue'),
      },
      {
        path: 'ui/sliders',
        name: 'old-ui-sliders',
        component: () => import('@/views/pages/ui/sliders.vue'),
      },
      {
        path: 'ui/modals',
        name: 'old-ui-modals',
        component: () => import('@/views/pages/ui/modal.vue'),
      },
      {
        path: 'ui/navbar',
        name: 'old-ui-navbar',
        component: () => import('@/views/pages/ui/navbar.vue'),
      },
      {
        path: 'ui/timeline',
        name: 'old-ui-timeline',
        component: () => import('@/views/pages/ui/timeline.vue'),
      },
      {
        path: 'ui/ribbons',
        name: 'old-ui-ribbons',
        component: () => import('@/views/pages/ui/ribbons.vue'),
      },
      {
        path: 'forms/general',
        name: 'old-forms-general',
        component: () => import('@/views/pages/forms/general.vue'),
      },
      {
        path: 'forms/advanced',
        name: 'old-forms-advanced',
        component: () => import('@/views/pages/forms/advanced.vue'),
      },
      {
        path: 'forms/editors',
        name: 'old-forms-editors',
        component: () => import('@/views/pages/forms/editors.vue'),
      },
      {
        path: 'forms/validation',
        name: 'old-forms-validation',
        component: () => import('@/views/pages/forms/validation.vue'),
      },
      {
        path: 'tables/simple',
        name: 'old-tables-simple',
        component: () => import('@/views/pages/tables/simple.vue'),
      },
      {
        path: 'tables/data',
        name: 'old-tables-data',
        component: () => import('@/views/pages/tables/data.vue'),
      },
      {
        path: 'tables/jsgrid',
        name: 'old-tables-jsgrid',
        component: () => import('@/views/pages/tables/jsgrid.vue'),
      },
      {
        path: 'calendar',
        name: 'old-calendar',
        component: () => import('@/views/pages/calendar.vue'),
      },
      {
        path: 'gallery',
        name: 'old-gallery',
        component: () => import('@/views/pages/gallery.vue'),
      },
      {
        path: 'kanban',
        name: 'old-kanban',
        component: () => import('@/views/pages/kanban.vue'),
      },
      {
        path: 'mailbox/inbox',
        name: 'old-mailbox-inbox',
        component: () => import('@/views/pages/mailbox/mailbox.vue'),
      },
      {
        path: 'mailbox/compose',
        name: 'old-mailbox-compose',
        component: () => import('@/views/pages/mailbox/compose.vue'),
      },
      {
        path: 'mailbox/read-mail',
        name: 'old-mailbox-read-mail',
        component: () => import('@/views/pages/mailbox/read-mail.vue'),
      },
      {
        path: 'examples/invoice',
        name: 'old-examples-invoice',
        component: () => import('@/views/pages/examples/invoice.vue'),
      },
      {
        path: 'examples/profile',
        name: 'old-examples-profile',
        component: () => import('@/views/pages/examples/profile.vue'),
      },
      {
        path: 'examples/e-commerce',
        name: 'old-examples-e-commerce',
        component: () => import('@/views/pages/examples/e-commerce.vue'),
      },
      {
        path: 'examples/projects',
        name: 'old-examples-projects',
        component: () => import('@/views/pages/examples/projects.vue'),
      },
      {
        path: 'examples/project-add',
        name: 'old-examples-project-add',
        component: () => import('@/views/pages/examples/project-add.vue'),
      },
      {
        path: 'examples/project-edit',
        name: 'old-examples-project-edit',
        component: () => import('@/views/pages/examples/project-edit.vue'),
      },
      {
        path: 'examples/project-detail',
        name: 'old-examples-project-detail',
        component: () => import('@/views/pages/examples/project-detail.vue'),
      },
      {
        path: 'examples/contacts',
        name: 'old-examples-contacts',
        component: () => import('@/views/pages/examples/contacts.vue'),
      },
      {
        path: 'examples/faq',
        name: 'old-examples-faq',
        component: () => import('@/views/pages/examples/faq.vue'),
      },
      {
        path: 'examples/contact-us',
        name: 'old-examples-contact-us',
        component: () => import('@/views/pages/examples/contact-us.vue'),
      },
      {
        path: 'examples/legacy-user-menu',
        name: 'old-legacy-user-menu',
        component: () => import('@/views/pages/examples/legacy-user-menu.vue'),
      },
      {
        path: 'examples/language-menu',
        name: 'old-language-menu',
        component: () => import('@/views/pages/examples/language-menu.vue'),
      },
      {
        path: 'examples/404',
        name: 'old-404',
        component: () => import('@/views/pages/examples/404.vue'),
      },
      {
        path: 'examples/500',
        name: 'old-500',
        component: () => import('@/views/pages/examples/500.vue'),
      },
      {
        path: 'examples/pace',
        name: 'old-pace',
        component: () => import('@/views/pages/examples/pace.vue'),
      },
      {
        path: 'examples/blank',
        name: 'old-blank',
        component: () => import('@/views/pages/examples/blank.vue'),
      },
      {
        path: 'examples/starter',
        name: 'old-starter',
        component: () => import('@/views/pages/examples/starter.vue'),
      },
      {
        path: 'search/simple',
        name: 'old-simple',
        component: () => import('@/views/pages/search/simple.vue'),
      },
      {
        path: 'search/enhanced',
        name: 'old-enhanced',
        component: () => import('@/views/pages/search/enhanced.vue'),
      },
      {
        path: 'examples/iframe',
        name: 'old-iframe',
        component: () => import('@/views/pages/examples/iframe.vue'),
      },
    ]
  },

  // ========================================
  // 3. REDIRECT for backward compatibility
  // ========================================
  {
    path: '/dashboard',
    redirect: '/old'
  },
  {
    path: '/dashboardV2',
    redirect: '/old/dashboardV2'
  },
  {
    path: '/dashChart',
    redirect: '/old/dashChart'
  },

  // ========================================
  // 4. NEW SYSTEM - Redirect to external
  // ========================================
  {
    path: '/new-system',
    name: 'new-system',
    beforeEnter: (to, from, next) => {
      const newSystemUrl = import.meta.env.VITE_NEW_SYSTEM_URL || 'https://sistem-baru-anda.com'
      window.location.href = newSystemUrl
    }
  },

  // ========================================
  // 5. AUTH ROUTES
  // ========================================
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/pages/examples/register.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/pages/examples/forgot-password.vue')
      },
      {
        path: 'recover-password',
        name: 'recover-password',
        component: () => import('@/views/pages/examples/recover-password.vue')
      },
      {
        path: 'login-v2',
        name: 'login-v2',
        component: () => import('@/views/pages/examples/login-v2.vue')
      },
      {
        path: 'register-v2',
        name: 'register-v2',
        component: () => import('@/views/pages/examples/register-v2.vue')
      },
      {
        path: 'forgot-password-v2',
        name: 'forgot-password-v2',
        component: () => import('@/views/pages/examples/forgot-password-v2.vue')
      },
      {
        path: 'recover-password-v2',
        name: 'recover-password-v2',
        component: () => import('@/views/pages/examples/recover-password-v2.vue')
      },
      {
        path: 'lockscreen',
        name: 'lockscreen',
        component: () => import('@/views/pages/examples/lockscreen.vue')
      },
    ]
  },

  // ========================================
  // 6. 404 CATCH ALL
  // ========================================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ============================================
// NAVIGATION GUARD
// ============================================
router.beforeEach((to, from, next) => {
  // Set page title
  const title = to.meta.title || 'Engineering System'
  document.title = title

  // If SYSTEM_MODE is 'old' and accessing root, redirect to old system
  if (SYSTEM_MODE === 'old' && to.path === '/') {
    next('/old')
    return
  }

  // Skip auth checks for auth routes and landing page
  // Also skip for routes under /old path (old system routes)
  if (to.path.startsWith('/auth') || to.path === '/' || to.name === 'system-migration' || to.path.startsWith('/old')) {
    next()
    return
  }

  const Swal = window.Swal || window.SweetAlert2
  const isLoggedIn = !!userStore.state.user
  const permissions = userStore.state.permissions || []

  // Helper untuk show alert
  const showAlert = (message) => {
    if (Swal) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: message
      })
    } else {
      console.warn('Akses Ditolak:', message)
    }
  }

  // Check permission
  if (isLoggedIn && to.meta.requiresPermission) {
    const hasPermission = permissions.includes(to.meta.requiresPermission)
    if (!hasPermission) {
      showAlert('Anda tidak memiliki izin untuk mengakses halaman ini')
      next({ path: '/old/dashChart' })
      return
    }
  }

  // Check admin role
  if (to.meta.requiresAdmin && isLoggedIn) {
    if (permissions.length > 0) {
      if (!permissions.includes('user:view')) {
        showAlert('Anda tidak memiliki izin untuk mengakses halaman ini')
        next({ path: '/old/dashChart' })
        return
      }
    } else if (userStore.state.user?.role !== 'admin') {
      showAlert('Anda tidak memiliki izin untuk mengakses halaman ini')
      next({ path: '/old/dashChart' })
      return
    }
  }

  // Check superadmin role
  if (to.meta.requiresSuperadmin && isLoggedIn) {
    const user = userStore.state.user
    const isSuperadmin = user && (
      (user.role && user.role.toLowerCase() === 'superadmin') ||
      (user.email && user.email.toLowerCase().startsWith('super@'))
    )

    if (!isSuperadmin) {
      showAlert('Halaman ini hanya dapat diakses oleh Super Admin')
      next({ path: '/old/dashChart' })
      return
    }
  }

  next()
})

export { SYSTEM_MODE, generateUrl }
export default router
