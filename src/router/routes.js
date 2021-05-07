
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('pages/Index.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Register.vue') },
      { path: 'signout', component: () => import('pages/Signout.vue') },
      { path: 'index', component: () => import('pages/MainPage.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
      { path: 'edit-profile', component: () => import('src/pages/EditProfile.vue') },
      { path: 'patient-management', component: () => import('src/pages/PatientManagement.vue') }
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
