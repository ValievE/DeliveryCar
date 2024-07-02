<template>
  <div v-if="!userSession?.data.session" class="cabinet-warning">
    <p class="cabinet-warning__icon">{{ `:(` }}</p>
    <p class="cabinet-warning__text">Для доступа в кабинет нужна авторизация</p>
  </div>
  <section v-if="userSession?.data.session" class="cabinet">
    <h1 class="cabinet__title">Личный кабинет</h1>
    <div class="cabinet__info">
      <h2 class="cabinet__greeting">
        {{
          `Добро пожаловать, ${userSession.data.session.user.user_metadata.first_name} ${userSession.data.session.user.user_metadata.secnd_name}`
        }}
      </h2>
      <div class="cabinet__flow">
        <div class="cabinet__menu" :class="{ cabinet__menu_disabled: !activeMenu }">
          <router-link
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :to="
              menuItem.url === '/'
                ? '/'
                : `/cabinet/${menuItem.isActive ? menuItem.url : menuItems[0].url}`
            "
            :title="menuItem.isActive ? '' : 'На данный момент этот раздел недоступен'"
            class="cabinet__button"
            :class="{
              cabinet__button_active: activeMenu === menuItem.url,
              cabinet__button_default: menuItem.isActive,
              cabinet__button_disabled: !menuItem.isActive
            }"
            @click="changeMenu(index), exit(index)"
          >
            {{ menuItem.title }}
          </router-link>
        </div>
        <div
          v-if="activeMenu"
          class="cabinet__active-info"
          :class="{ 'cabinet__active-info_disabled': !activeMenu }"
        >
          <router-view :mobile-media-size="mobileMediaSize" :tablet-media-size="tabletMediaSize" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { supabase } from '@/lib/supabaseClient'
import { AuthError, Session } from '@supabase/supabase-js'
import { onMounted, ref, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type SuccessData = {
  session: Session
}

type DeniedData = {
  session: null
}

type Object =
  | {
      data: SuccessData
      error: null
    }
  | {
      data: DeniedData
      error: AuthError
    }
  | {
      data: DeniedData
      error: null
    }

type CabMenu = {
  title: String
  url: 'orders' | 'settings' | 'help' | '/'
  isActive: Boolean
}

const cabinetProps = defineProps({
  mobileMediaSize: Boolean,
  tabletMediaSize: Boolean
})

const { mobileMediaSize, tabletMediaSize } = toRefs(cabinetProps)

const router = useRouter()
const route = useRoute()
const userSession = ref<Object>()
const activeMenu = ref('' as CabMenu['url'] | '')
const menuItems: Array<CabMenu> = [
  { title: 'Заказы', url: 'orders', isActive: true },
  { title: 'Настройки', url: 'settings', isActive: false },
  { title: 'Тех. поддержка', url: 'help', isActive: false },
  { title: 'Выход', url: '/', isActive: true }
]

menuItems.forEach((menuItem) => {
  if (menuItem.url === router.currentRoute.value.name) {
    activeMenu.value = menuItem.url
  }
})

async function getSession() {
  userSession.value = await supabase.auth.getSession()
}

async function logOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  }
}

const changeMenu = (arg: number) => {
  if (arg === 3) {
    document.getElementsByTagName('body')[0].scrollIntoView({ block: 'start', inline: 'center' })
  }

  if (menuItems[arg].isActive) {
    activeMenu.value = menuItems[arg].url
    return activeMenu
  }
  return activeMenu.value
}

const exit = (arg: number) => {
  if (arg === 3) {
    logOut()
  }
}

onMounted(() => {
  getSession()
})

watch(
  () => route.name,
  (newValue) => {
    if (newValue === 'cabinet') {
      activeMenu.value = ''
    }
  }
)
</script>

<style src="./CabinetView.css" scoped />
