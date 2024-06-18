import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./indexPage/indexPage.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./catalogPage/catalogPage.vue')
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: () => import('./cabinetPage/cabinetPage.vue'),
      children: [
        {
          name: 'orders',
          path: 'orders',
          component: () => import('./cabinetPage/orders/orders.vue')
        },
        {
          name: 'settings',
          path: 'settings',
          component: () => import('./cabinetPage/settings/settings.vue')
        },
        {
          name: 'help',
          path: 'help',
          component: () => import('./cabinetPage/help/help.vue')
        }
      ]
    }
  ]
})

export default router
