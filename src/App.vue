<template>
  <header class="header">
    <router-link to="/" class="header-logo-link">
      <img class="header-logo" src="/img/logo_dark.svg" alt="DeliveryCar" />
    </router-link>
    <div class="menu">
      <nav class="nav-bar">
        <router-link to="/" class="nav-bar__item">Главная</router-link>
        <router-link to="/catalog" class="nav-bar__item">Каталог</router-link>
        <router-link to="/" class="nav-bar__item">Доставка</router-link>
        <router-link to="/cabinet" class="nav-bar__item">О нас</router-link>
      </nav>
      <a href="tel:+79260003939" class="phone-link">+7 (926) 000-39-39</a>
      <project-button
        :text="'Личный кабинет'"
        :size="'small'"
        :color="'gray'"
        :icon="'user'"
        @click="modalWindow(true)"
      />
    </div>
  </header>

  <modal-auth :is-opened="isAuthModalOpened" @close-auth-modal="modalWindow(false)" />
  <router-view />
  <footer class="footer">
    <div class="footer__body">
      <div class="footer__line">
        <img class="footer__logo" src="/img/logo_light.svg" alt="DeliveryCar" />
        <div class="social-media">
          <a
            v-for="(item, index) in socialMedia"
            :key="index"
            class="social-media__link"
            :href="item.url"
          >
            <img class="social-media__img" :src="item.img" :alt="item.name" />
          </a>
        </div>
      </div>
      <div class="footer__links">
        <a href="/" class="footer__link">Партнерская программа</a>
        <a href="/" class="footer__link">Персональные данные</a>
        <a href="/" class="footer__link">Политика конфиденциальности</a>
        <a href="/" class="footer__link">Служба поддержки</a>
        <a href="/" class="footer__link">Вакансии</a>
      </div>
      <span class="footer__text">© DELIVERYCAR 2024. ВСЕ ПРАВА НЕ ЗАЩИЩЕНЫ</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import modalAuth from './components/modal-auth/modal-auth.vue'
import projectButton from './components/project-button/project-button.vue'

const isAuthModalOpened = ref(false)

const socialMedia = [
  {
    name: 'Instagram',
    url: '',
    img: '/img/icons/icon_instagram.svg'
  },
  {
    name: 'Telegram',
    url: '',
    img: '/img/icons/icon_telegram.svg'
  },
  {
    name: 'VK',
    url: '',
    img: '/img/icons/icon_vk.svg'
  },
  {
    name: 'WhatsApp',
    url: '',
    img: '/img/icons/icon_whatsapp.svg'
  }
]

const modalWindow = (arg: boolean) => {
  if (arg) {
    isAuthModalOpened.value = true
    document.body.style.overflowY = 'hidden'
    return isAuthModalOpened
  }
  isAuthModalOpened.value = false
  document.body.style.overflowY = 'visible'
  return isAuthModalOpened
}
</script>
