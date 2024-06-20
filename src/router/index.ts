import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/indexPage/indexPage.vue')
    },
    {
      path: '/info/:section',
      name: 'info',
      component: () => import('@/pages/infoPage/infoPage.vue')
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('@/pages/deliveryPage/deliveryPage.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/pages/catalogPage/catalogPage.vue')
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: () => import('@/pages/cabinetPage/cabinetPage.vue'),
      children: [
        {
          name: 'orders',
          path: 'orders',
          component: () => import('@/pages/cabinetPage/orders/orders.vue')
        },
        {
          name: 'settings',
          path: 'settings',
          component: () => import('@/pages/cabinetPage/settings/settings.vue')
        },
        {
          name: 'help',
          path: 'help',
          component: () => import('@/pages/cabinetPage/help/help.vue')
        }
      ]
    }
  ]
})

export default router
