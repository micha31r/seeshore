import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading
const HomeView = () => import('../views/HomeView.vue')
const AccountView = () => import('../views/AccountView.vue')
const CreateView = () => import('../views/CreateView.vue')
const ShareView = () => import('../views/ShareView.vue')
const PeopleView = () => import('../views/PeopleView.vue')
const QRView = () => import('../views/QRView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/share',
      name: 'share',
      component: ShareView
    },
    {
      path: '/people',
      name: 'people',
      component: PeopleView
    },
    {
      path: '/qr',
      name: 'qr',
      component: QRView
    }
  ]
})

export default router
