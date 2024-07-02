import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

let userSession

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
      children: [
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
          component: () => import('@/views/CabinetView.vue'),
          meta: { requiresAuth: true },
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
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    userSession = await supabase.auth.getSession()
    if (userSession.data.session === null) {
      next({ name: 'home' })
    }
  }
  next()
})

export default router
