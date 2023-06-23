import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'
import CreateView from '../views/CreateView.vue'
import ShareView from '../views/ShareView.vue'
import PeopleView from '../views/PeopleView.vue'
import QRView from '../views/QRView.vue'

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
