<template>
  <header class="header">
    <router-link to="/" class="header-logo-link">
      <img class="header-logo" src="/img/logo_dark.svg" alt="DeliveryCar" />
    </router-link>
    <div class="menu">
      <nav class="nav-bar">
        <router-link to="/" class="nav-bar__item">Главная</router-link>
        <router-link to="/catalog" class="nav-bar__item">Каталог</router-link>
        <router-link to="/delivery" class="nav-bar__item">Доставка</router-link>
        <router-link to="/" class="nav-bar__item" @click="rollTo('section-three')"
          >О нас</router-link
        >
      </nav>
      <a href="tel:+79260003939" class="phone-link">+7 (926) 000-39-39</a>
      <router-link class="cabinet-button" :to="isLoggedIn ? '/cabinet' : ''">
        <project-button
          :text="isLoggedIn ? loggedUser.name : 'Личный кабинет'"
          :size="'small'"
          :color="'gray'"
          :icon="'user'"
          @click="isLoggedIn ? '' : modalWindow(true)"
      /></router-link>
    </div>
  </header>

  <modal-auth
    :is-opened="isAuthModalOpened"
    :is-logged-in="isLoggedIn"
    :user-info="loggedUser.name"
    @is-logged-in="
      (newValue) => {
        isLoggedIn = newValue
      }
    "
    @updated-name="
      (newName) => {
        loggedUser.name = newName
      }
    "
    @close-auth-modal="modalWindow(false)"
  />
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
        <router-link
          v-for="(footerLink, index) in footerLinks"
          :key="index"
          :to="footerLink.link"
          class="footer__link"
          @click="rollToTop"
        >
          {{ footerLink.name }}
        </router-link>
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

const isAuthModalOpened = ref(false as boolean)
const isLoggedIn = ref(false as boolean)
const loggedUser = ref({
  name: '' as string
})
const footerLinks = [
  {
    name: 'Партнерская программа',
    link: '/info/partnership'
  },
  {
    name: 'Персональные данные',
    link: '/info/personal'
  },
  {
    name: 'Политика конфиденциальности',
    link: '/info/confidentiality'
  },
  {
    name: 'Вакансии',
    link: '/info/vacanсies'
  }
]

const socialMedia = [
  {
    name: 'Instagram',
    url: 'https://www.youtube.com/watch?v=KvH3v9uyyf0',
    img: '/img/icons/icon_instagram.svg'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/evdsg01',
    img: '/img/icons/icon_telegram.svg'
  },
  {
    name: 'VK',
    url: 'https://vk.com/id62878382',
    img: '/img/icons/icon_vk.svg'
  },
  {
    name: 'WhatsApp',
    url: 'https://www.whatsapp.com/',
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

const rollToTop = () => {
  document.getElementsByTagName('body')[0].scrollIntoView({ block: 'start', inline: 'center' })
}

const rollTo = (arg: string) => {
  setTimeout(() => {
    document.getElementsByClassName(arg)[0].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  }, 100)
}
</script>
