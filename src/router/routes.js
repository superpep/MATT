
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'index', component: () => import('pages/MainPage.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'user-management', component: () => import('pages/UserManagement.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
