<template>
  <section class="cabinet">
    <h1 class="cabinet__title">Личный кабинет</h1>
    <div class="cabinet__info">
      <h2 class="cabinet__greeting">{{ `Добро пожаловать, Иван!` }}</h2>
      <div class="cabinet__flow">
        <div class="cabinet__menu" :class="{ cabinet__menu_disabled: !activeMenu }">
          <router-link
            v-for="(menuItem, index) in menuItems"
            :key="index"
            :to="menuItem.url === '/' ? '/' : `/cabinet/${menuItem.url}`"
            class="cabinet__button"
            :class="{
              cabinet__button_active: activeMenu === menuItem.url
            }"
            :disabled="menuItem.isActive"
            @click="activeMenu = menuItem.url"
            >{{ menuItem.title }}</router-link
          >
        </div>
        <div class="cabinet__active-info" :class="{ 'cabinet__active-info_disabled': !activeMenu }">
          <router-view />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type CabMenu = {
  title: String
  url: 'orders' | 'settings' | 'help' | '/'
  isActive: Boolean
}

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
</script>

<style src="./cabinetPage.css" />
