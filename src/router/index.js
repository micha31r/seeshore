import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'
import CreateView from '../views/CreateView.vue'
import ShareView from '../views/ShareView.vue'
import UserView from '../views/UserView.vue'

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
      path: '/user',
      name: 'user',
      component: UserView
    }
  ]
})

export default router
