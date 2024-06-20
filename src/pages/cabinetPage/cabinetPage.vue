<template>
  <section class="cabinet">
    <h1 class="cabinet__title">Личный кабинет</h1>
    <div class="cabinet__info">
      <h2 class="cabinet__greeting">{{ `Добро пожаловать, Emil Valiev!` }}</h2>
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
            @click="changeMenu(index)"
          >
            {{ menuItem.title }}
          </router-link>
        </div>
        <div class="cabinet__active-info" :class="{ 'cabinet__active-info_disabled': !activeMenu }">
          <router-view :mobile-media-size="mobileMediaSize" :tablet-media-size="tabletMediaSize" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

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
</script>

<style src="./cabinetPage.css" />
