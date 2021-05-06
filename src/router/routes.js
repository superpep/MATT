
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/Index.vue') },
      { path: 'signout', component: () => import('pages/Signout.vue') },
      { path: 'index', component: () => import('pages/MainPage.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'user-management', component: () => import('pages/UserManagement.vue') },
      { path: 'patient-management', component: () => import('pages/PatientManagement.vue') }
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
