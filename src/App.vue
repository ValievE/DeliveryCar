<template>
  <header class="header">
    <router-link to="/" class="header-logo-link">
      <img class="header-logo" src="/img/logo_dark.svg" alt="DeliveryCar" />
    </router-link>
    <button
      v-if="mobileMediaRequests.isActive"
      class="burger-menu-open-button"
      @click="openBurgerMenu(true, 'header')"
    >
      <div class="burger-menu-open-button__item"></div>
      <div class="burger-menu-open-button__item"></div>
      <div class="burger-menu-open-button__item"></div>
    </button>
    <div
      v-if="!mobileMediaRequests.isActive || isHeaderBurgerOpened"
      :class="{ 'burger-menu': mobileMediaRequests.isActive, menu: !mobileMediaRequests.isActive }"
      @click.self="mobileMediaRequests.isActive ? openBurgerMenu(false, 'header') : ''"
    >
      <exit-button
        v-if="mobileMediaRequests.isActive"
        :burger-menu="true"
        @click="openBurgerMenu(false, 'header')"
      />
      <nav class="nav-bar">
        <router-link
          to="/"
          class="nav-bar__item"
          @click="mobileMediaRequests.isActive ? openBurgerMenu(false, 'header') : ''"
          >Главная</router-link
        >
        <router-link
          to="/catalog"
          class="nav-bar__item"
          @click="mobileMediaRequests.isActive ? openBurgerMenu(false, 'header') : ''"
          >Каталог</router-link
        >
        <router-link
          to="/delivery"
          class="nav-bar__item"
          @click="mobileMediaRequests.isActive ? openBurgerMenu(false, 'header') : ''"
          >Доставка</router-link
        >
        <router-link
          to="/"
          class="nav-bar__item"
          @click="
            rollTo('section-three'),
              mobileMediaRequests.isActive ? openBurgerMenu(false, 'header') : ''
          "
        >
          О нас
        </router-link>
      </nav>
      <a href="tel:+79260003939" class="phone-link">+7 (926) 000-39-39</a>
      <router-link class="cabinet-button" :to="isLoggedIn ? '/cabinet' : ''">
        <project-button
          :text="'Личный кабинет'"
          :size="mobileMediaRequests.isActive ? 'big' : 'small'"
          :color="'gray'"
          :icon="'user'"
          @click="
            mobileMediaRequests.isActive ? openBurgerMenu(false, 'header') : '',
              isLoggedIn ? '' : modalWindow(true)
          "
      /></router-link>
    </div>
  </header>

  <modal-auth
    :is-opened="isAuthModalOpened"
    :is-logged-in="isLoggedIn"
    :user-info="loggedUser.name"
    @close-auth-modal="modalWindow(false)"
  />
  <router-view
    :mobile-media-size="mobileMediaRequests.isActive"
    :tablet-media-size="tabletMediaRequests.isActive"
  />
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
      <button
        v-if="mobileMediaRequests.isActive"
        class="burger-menu-open-button"
        @click="openBurgerMenu(true, 'footer')"
      >
        <div class="burger-menu-open-button__item"></div>
        <div class="burger-menu-open-button__item"></div>
        <div class="burger-menu-open-button__item"></div>
      </button>
      <div
        v-if="!mobileMediaRequests.isActive || isFooterBurgerOpened"
        :class="mobileMediaRequests.isActive ? 'burger-menu footer-burger-menu' : 'footer__links'"
        @click.self="openBurgerMenu(false, 'footer')"
      >
        <exit-button
          v-if="mobileMediaRequests.isActive"
          :burger-menu="true"
          @click="openBurgerMenu(false, 'footer')"
        />
        <router-link
          v-for="(footerLink, index) in footerLinks"
          :key="index"
          :to="footerLink.link"
          class="footer__link"
          @click="openBurgerMenu(false, 'footer'), rollToTop()"
        >
          {{ footerLink.name }}
        </router-link>
      </div>
      <span class="footer__text">© DELIVERYCAR 2024. ВСЕ ПРАВА НЕ ЗАЩИЩЕНЫ</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import exitButton from './components/exit-button/exit-button.vue'
import modalAuth from './components/modal-auth/modal-auth.vue'
import projectButton from './components/project-button/project-button.vue'

const isAuthModalOpened = ref(false as boolean)
const isLoggedIn = ref(false as boolean)
const loggedUser = ref({ name: '' as string })
const isHeaderBurgerOpened = ref(false)
const isFooterBurgerOpened = ref(false)
const mobileMediaRequests = ref({
  width: 800,
  isActive: false
})
const tabletMediaRequests = ref({
  width: 1100,
  isActive: false
})

const actualWindowSize = ref<number>(window.innerWidth)

onMounted(() => {
  if (
    actualWindowSize.value <= tabletMediaRequests.value.width &&
    actualWindowSize.value > mobileMediaRequests.value.width
  ) {
    tabletMediaRequests.value.isActive = true
  }

  if (actualWindowSize.value <= mobileMediaRequests.value.width) {
    mobileMediaRequests.value.isActive = true
    tabletMediaRequests.value.isActive = false
  }

  window.onresize = () => {
    actualWindowSize.value = window.innerWidth

    if (
      actualWindowSize.value <= tabletMediaRequests.value.width &&
      actualWindowSize.value > mobileMediaRequests.value.width
    ) {
      tabletMediaRequests.value.isActive = true
    }

    if (actualWindowSize.value < mobileMediaRequests.value.width) {
      mobileMediaRequests.value.isActive = true
      tabletMediaRequests.value.isActive = false
      return
    }
    mobileMediaRequests.value.isActive = false
    tabletMediaRequests.value.isActive = false
  }
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

const openBurgerMenu = (float: boolean, name: 'header' | 'footer') => {
  if (float) {
    if (name === 'header') {
      isHeaderBurgerOpened.value = true
    }

    if (name === 'footer') {
      isFooterBurgerOpened.value = true
    }

    document.body.style.overflowY = 'hidden'
    return
  }
  isFooterBurgerOpened.value = false
  isHeaderBurgerOpened.value = false
  document.body.style.overflowY = 'visible'
}

const rollToTop = () => {
  document.getElementsByTagName('body')[0].scrollIntoView({ block: 'start', inline: 'center' })
}

const rollTo = (arg: string) => {
  if (mobileMediaRequests.value.isActive) {
    setTimeout(() => {
      document.getElementsByClassName(arg)[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }, 100)
    return
  }
  setTimeout(() => {
    document.getElementsByClassName(arg)[0].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  }, 100)
}
</script>
