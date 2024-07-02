<template>
  <modal-news
    :is-opened="isNewsModalOpened"
    :info="openedNews"
    @close-news-modal="modalWindow(false)"
  />
  <section class="section-one">
    <img class="bg-image" src="/img/bg_img.png" alt="?" />
    <div class="info-block">
      <h1 class="info-block__title">
        Новый автомобиль <br />
        с доставкой до дома
      </h1>
      <p class="info-block__text">
        Покупка нового автомобиля это всегда приятно, а если убрать долгое оформление в автосалоне,
        бумажную волокиту, то еще лучше!
      </p>
      <router-link class="info-block__button" :to="{ name: 'delivery' }">
        <project-button :size="'big'" :text="'Подробнее'" :color="'orange'" :icon="'arrow'" />
      </router-link>
    </div>
  </section>
  <section class="section-two">
    <button
      v-if="!mobileMediaSize"
      class="carousel__button carousel_style"
      @click="changeCarouselPos('left')"
    >
      <img class="carousel__button__img" src="/img/icons/icon_carousel.svg" alt="left" />
    </button>
    <div class="carousel__body">
      <div class="carousel__items" :style="{ left: carouselSwap }">
        <div v-for="(brand, index) in brands" :key="index" class="carousel__item carousel_style">
          <img class="carousel__img" :src="brand.url" :alt="brand.name" :title="brand.name" />
        </div>
      </div>
    </div>
    <button
      v-if="!mobileMediaSize"
      class="carousel__button carousel__button_mirrored carousel_style"
      @click="changeCarouselPos('right')"
    >
      <img class="carousel__button__img" src="/img/icons/icon_carousel.svg" alt="left" />
    </button>
  </section>
  <section class="section-three">
    <h1 class="section-three__title">КАК РАБОТАЕТ НАШ СЕРВИС</h1>
    <div class="work-steps">
      <div
        v-for="(workCard, index) in howWeWork"
        :key="index"
        class="work-steps__card work-steps__card_style"
      >
        <h2 class="work-steps__title">{{ workCard.title }}</h2>
        <p class="work-steps__text">{{ workCard.text }}</p>
      </div>
    </div>
    <div class="catalog-banner">
      <div class="catalog-banner__info">
        <p class="catalog-banner__title">Хотите перейти к выбору автомобилей уже сейчас?</p>
        <router-link to="/catalog" class="catalog-banner__link">
          <project-button
            :size="mobileMediaSize ? 'medium' : 'big'"
            :color="'orange'"
            :icon="'arrow'"
            :text="'Каталог'"
        /></router-link>
      </div>
      <img class="catalog-banner__img" src="/img/vw_golf.png" alt="?" />
    </div>
  </section>
  <section class="section-four">
    <h3 class="section-four__title">АКЦИИ И СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ</h3>
    <div class="special-offers">
      <div v-for="(specialOffer, index) in specialOffers" :key="index" class="special-offer">
        <div class="special-offer__info">
          <p class="special-offer__title">{{ specialOffer.title }}</p>
          <p class="special-offer__text">{{ specialOffer.subtitle }}</p>
        </div>
        <div
          class="special-offer__img"
          :style="{ backgroundImage: `url('${specialOffer.img}')` }"
        ></div>
      </div>
    </div>
  </section>
  <section class="section-five">
    <h4 class="section-five__title">Новости</h4>
    <div class="news-block">
      <div v-if="!loadedNews.length" class="news-card_loading loader"></div>
      <div v-for="(news, index) in loadedNews" :key="index" class="news-card">
        <p class="news-card__title">{{ news.news_title }}</p>
        <p class="news-card__text">{{ news.news_text }}</p>
        <project-button
          :text="'Читать далее'"
          :color="'gray'"
          :size="'small'"
          class="news-card__button"
          @click="modalWindow(true, news)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import modalNews from '@/components/modal-news/modal-news.vue'
import projectButton from '@/components/project-button/project-button.vue'
import { ref, toRefs } from 'vue'
import { supabase } from '@/lib/supabaseClient'

type News = {
  id?: string
  created_at?: string
  news_title?: string
  news_text?: string
  image?: boolean
  url?: string
}

const indexPageProps = defineProps({
  mobileMediaSize: Boolean
})

const { mobileMediaSize } = toRefs(indexPageProps)
const loadedNews = ref<Array<News>>([])

const getData = async () => {
  const { data: allNews, error } = await supabase.from('news').select('*')
  console.error(error)
  loadedNews.value = allNews?.map((item) => item) as Array<News>
  return loadedNews.value
}

getData()

const brands = [
  {
    name: 'Mercedes-Benz',
    url: '/img/brands/mercedes.png'
  },
  {
    name: 'BMW',
    url: '/img/brands/bmw.png'
  },
  {
    name: 'Porsche',
    url: '/img/brands/porsche.png'
  },
  {
    name: 'Volkswagen',
    url: '/img/brands/volkswagen.png'
  },
  {
    name: 'Toyota',
    url: '/img/brands/toyota.png'
  },
  {
    name: 'Dodge',
    url: '/img/brands/dodge.png'
  },
  {
    name: 'Geely',
    url: '/img/brands/geely.png'
  },
  {
    name: 'Haval',
    url: '/img/brands/haval.png'
  }
]

const howWeWork = [
  {
    title: 'Выбор автомобиля',
    text: 'Все начинается с выбора подходящего для вас автомобиля'
  },
  {
    title: 'Создание заказа',
    text: 'На этом этапе вы выбираете атрибуты автомобиля, такие как цвет, комплектация, доп. опции, после чего создается полноценный заказ'
  },
  {
    title: 'Оформление документов',
    text: 'Оформление документов не займет много времени, наш договор находится в открытом доступе, потребуется лишь электронная подпись'
  },
  {
    title: 'Оплата',
    text: 'Мы работаем по предоплате с гарантией возврата средств'
  },
  {
    title: 'доставка',
    text: 'Конечный и самый приятный этап - получение автомобиля, мы доставляем своими силами, вы проверяете автомобиль на наличие дефектов и только после этого мы можем считать сделку закрытой.'
  }
]

const specialOffers = [
  {
    title: 'Первый автомобиль',
    subtitle: 'Приобретайте автомобиль по госпрограмме “Первый автомобиль”',
    text: '',
    img: '/img/specialOffers/sp_image_1.png'
  },
  {
    title: 'Бесплатное обслуживание',
    subtitle:
      'При покупке автомобиля до 12.12.2024 мы дарим двухлетнее бесплатное обслуживание автомобиля.',
    text: '',
    img: '/img/specialOffers/sp_image_2.png'
  }
]

const isNewsModalOpened = ref(false)
const openedNews = ref({} as News)

const carouselSwap = ref('0px')
const carouselActualPos = ref(0)

const modalWindow = (arg: boolean, news?: News) => {
  if (arg && news !== undefined) {
    isNewsModalOpened.value = true
    document.body.style.overflowY = 'hidden'
    openedNews.value = news
    return isNewsModalOpened
  }
  isNewsModalOpened.value = false
  document.body.style.overflowY = 'visible'
  return isNewsModalOpened
}

const changeCarouselPos = (arg: string) => {
  const carouselMaxWidth =
    document.getElementsByClassName('carousel__items')[0].clientWidth -
    document.getElementsByClassName('carousel__body')[0].clientWidth
  const carouselMinWidth = 0

  const carouselStep: number = mobileMediaSize.value ? 150 : 280

  if (arg === 'right') {
    carouselActualPos.value -= carouselStep
    if (carouselActualPos.value === -carouselMaxWidth - carouselStep) {
      carouselActualPos.value = carouselMinWidth
    }
    if (
      carouselActualPos.value < -carouselMaxWidth &&
      carouselActualPos.value !== -carouselMaxWidth
    ) {
      carouselActualPos.value = -carouselMaxWidth
    }
  }

  if (arg === 'left') {
    carouselActualPos.value += carouselStep
    if (carouselActualPos.value === carouselMinWidth + carouselStep) {
      carouselActualPos.value = -carouselMaxWidth
    }
    if (
      carouselActualPos.value > carouselMinWidth &&
      carouselActualPos.value !== carouselMinWidth
    ) {
      carouselActualPos.value = carouselMinWidth
    }
  }

  carouselSwap.value = `${carouselActualPos.value}px`
  return carouselSwap.value
}
</script>

<style scoped src="./indexPage.css" />
