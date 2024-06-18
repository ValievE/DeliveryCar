<template>
  <h3 class="section__title">Ваши заказы</h3>
  <div v-if="orderGalleryOpened" class="photos-modal">
    <div class="photos-body">
      <exitButton @click="modalWindow(false)" />
      <div class="main-image">
        <button class="carousel-button carousel-button_fullsize" @click="openFullSize">
          <img class="carousel-button__img" src="/img/icons/icon_fullsize.svg" alt="<" />
        </button>
        <button
          class="carousel-button carousel-button_left"
          @click="
            photoIndex === 1 ? (photoIndex = fakeDB[galleryIndex].photos.length) : photoIndex--
          "
        >
          <img class="carousel-button__img" src="/img/icons/icon_triangle.svg" alt="<" />
        </button>
        <img
          class="main-image__img"
          :src="`/img/cabinet/orders/fakeDB/${fakeDB[galleryIndex].brand} ${fakeDB[galleryIndex].model}/${photoIndex}.webp`"
          alt="?"
        />
        <button
          class="carousel-button carousel-button_right"
          @click="
            photoIndex === fakeDB[galleryIndex].photos.length ? (photoIndex = 1) : photoIndex++
          "
        >
          <img class="carousel-button__img" src="/img/icons/icon_triangle.svg" alt="<" />
        </button>
      </div>
      <div class="photo-carousel">
        <img
          v-for="(photo, index) in fakeDB[galleryIndex].photos"
          :key="index"
          class="carousel-img"
          :class="{ 'carousel-img_active': index + 1 === photoIndex }"
          :src="`/img/cabinet/orders/fakeDB/${fakeDB[galleryIndex].brand} ${fakeDB[galleryIndex].model}/${photo}`"
          alt="?"
          @click="photoIndex = index + 1"
        />
      </div>
    </div>
  </div>
  <div class="orders">
    <div
      v-for="(order, index) in fakeDB"
      :key="index"
      class="order"
      :style="{
        'min-height': orderOpened === index ? '250px' : '0px',
        height: orderOpened === index ? '250px' : 'fit-content'
      }"
    >
      <div class="order__header" @click="openCloseOrder(index)">
        <h4 class="order__number">
          {{
            orderOpened === index
              ? `Заказ #${index}`
              : `Заказ #${index}  ||  ${fakeDB[index].brand} ${fakeDB[index].model}`
          }}
        </h4>
        <img
          class="order__hide-img"
          :class="{ 'order__hide-img_active': orderOpened === index }"
          src="/public/img/icons/icon_triangle.svg"
          alt="🡣"
        />
      </div>
      <div v-if="orderOpened === index" class="order__body">
        <div class="order-info">
          <div
            class="order-info__thumb"
            :style="{
              backgroundImage: `url('/img/cabinet/orders/fakeDB/${fakeDB[index].brand} ${fakeDB[index].model}/1.webp')`
            }"
            @click="modalWindow(true, index)"
          ></div>
          <div class="order-texts">
            <h5 class="order-title">{{ `${order.brand} ${order.model} ${order.year}` }}</h5>
            <p class="car-brief">
              {{
                `${order.info.body} / ${!order.mileage ? 'Новый' : `Пробег: ${order.mileage} км`} / Цвет: ${order.info.color} / Двигатель: ${order.info.engine} (${order.info.hp}л.с.)`
              }}
            </p>
            <p class="paystatus">
              {{ `Статус оплаты: ${order.payed ? 'Оплачено' : 'Ожидание оплаты'}` }}
            </p>
            <p class="carprice">{{ `${order.price} ₽` }}</p>
          </div>
        </div>
        <div class="delivery-status">
          <div class="indicator">
            <div class="indicator-imgs">
              <svg
                class="indicator-img"
                :class="{
                  'indicator-img_passed': order.orderStage > 0,
                  'indicator-img_active': order.orderStage === 0
                }"
                viewBox="0 0 44 44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="indicator-img__item"
                  d="M0 17.6V26.4C0 32.6238 -1.3113e-07 35.7346 1.9338 37.6684C2.4112 38.1458 2.9612 38.5044 3.6124 38.7772C3.59768 38.679 3.58375 38.5808 3.5706 38.4824C3.3 36.4628 3.3 33.9438 3.3 31.0178V12.9844C3.3 10.0584 3.3 7.5372 3.5706 5.5198L3.6146 5.225C2.98596 5.47874 2.41447 5.85575 1.9338 6.3338C-1.3113e-07 8.2676 0 11.3784 0 17.6ZM44 17.6V26.4C44 32.6238 44 35.7346 42.0662 37.6684C41.5888 38.1458 41.0388 38.5044 40.3876 38.7772L40.4294 38.4824C40.7 36.4628 40.7 33.9438 40.7 31.0178V12.9844C40.7 10.0584 40.7 7.5372 40.4294 5.5198C40.4155 5.42142 40.4009 5.32315 40.3854 5.225C41.0388 5.4956 41.5888 5.8564 42.0662 6.3338C44 8.2676 44 11.3784 44 17.6Z"
                />
                <path
                  class="indicator-img__item"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.5338 1.9338C6.6 3.8654 6.6 6.9784 6.6 13.2V30.8C6.6 37.0216 6.6 40.1346 8.5338 42.0662C10.4654 44 13.5784 44 19.8 44H24.2C30.4216 44 33.5346 44 35.4662 42.0662C37.4 40.1346 37.4 37.0216 37.4 30.8V13.2C37.4 6.9784 37.4 3.8654 35.4662 1.9338C33.5346 -1.3113e-07 30.4216 0 24.2 0H19.8C13.5784 0 10.4654 -1.3113e-07 8.5338 1.9338ZM13.75 33C13.75 32.5624 13.9238 32.1427 14.2333 31.8333C14.5427 31.5238 14.9624 31.35 15.4 31.35H22C22.4376 31.35 22.8573 31.5238 23.1667 31.8333C23.4762 32.1427 23.65 32.5624 23.65 33C23.65 33.4376 23.4762 33.8573 23.1667 34.1667C22.8573 34.4762 22.4376 34.65 22 34.65H15.4C14.9624 34.65 14.5427 34.4762 14.2333 34.1667C13.9238 33.8573 13.75 33.4376 13.75 33ZM15.4 22.55C14.9624 22.55 14.5427 22.7238 14.2333 23.0333C13.9238 23.3427 13.75 23.7624 13.75 24.2C13.75 24.6376 13.9238 25.0573 14.2333 25.3667C14.5427 25.6762 14.9624 25.85 15.4 25.85H28.6C29.0376 25.85 29.4573 25.6762 29.7667 25.3667C30.0762 25.0573 30.25 24.6376 30.25 24.2C30.25 23.7624 30.0762 23.3427 29.7667 23.0333C29.4573 22.7238 29.0376 22.55 28.6 22.55H15.4ZM13.75 15.4C13.75 14.9624 13.9238 14.5427 14.2333 14.2333C14.5427 13.9238 14.9624 13.75 15.4 13.75H28.6C29.0376 13.75 29.4573 13.9238 29.7667 14.2333C30.0762 14.5427 30.25 14.9624 30.25 15.4C30.25 15.8376 30.0762 16.2573 29.7667 16.5667C29.4573 16.8762 29.0376 17.05 28.6 17.05H15.4C14.9624 17.05 14.5427 16.8762 14.2333 16.5667C13.9238 16.2573 13.75 15.8376 13.75 15.4Z"
                />
              </svg>
              <svg
                class="indicator-img"
                :class="{
                  'indicator-img_passed': order.orderStage > 1,
                  'indicator-img_active': order.orderStage === 1
                }"
                viewBox="0 0 44 44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="indicator-img__item"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.2 5H25.8C33.9077 5 37.9625 5 40.4802 7.4905C42.2948 9.28187 42.8022 11.8616 42.9441 16.1562H0.0559001C0.1978 11.8616 0.7052 9.28187 2.5198 7.4905C5.03745 5 9.09235 5 17.2 5ZM25.8 39H17.2C9.09235 39 5.03745 39 2.5198 36.5095C-2.563e-07 34.0211 0 30.0134 0 22C0 21.0607 2.00735e-07 20.1767 0.0043002 19.3438H42.9957C43 20.1767 43 21.0607 43 22C43 30.0134 43 34.0211 40.4802 36.5095C37.9625 39 33.9077 39 25.8 39ZM8.6 28.9062C8.17234 28.9062 7.76219 29.0742 7.45979 29.373C7.15739 29.6719 6.9875 30.0773 6.9875 30.5C6.9875 30.9227 7.15739 31.3281 7.45979 31.627C7.76219 31.9258 8.17234 32.0938 8.6 32.0938H17.2C17.6277 32.0938 18.0378 31.9258 18.3402 31.627C18.6426 31.3281 18.8125 30.9227 18.8125 30.5C18.8125 30.0773 18.6426 29.6719 18.3402 29.373C18.0378 29.0742 17.6277 28.9062 17.2 28.9062H8.6ZM22.575 28.9062C22.1473 28.9062 21.7372 29.0742 21.4348 29.373C21.1324 29.6719 20.9625 30.0773 20.9625 30.5C20.9625 30.9227 21.1324 31.3281 21.4348 31.627C21.7372 31.9258 22.1473 32.0938 22.575 32.0938H25.8C26.2277 32.0938 26.6378 31.9258 26.9402 31.627C27.2426 31.3281 27.4125 30.9227 27.4125 30.5C27.4125 30.0773 27.2426 29.6719 26.9402 29.373C26.6378 29.0742 26.2277 28.9062 25.8 28.9062H22.575Z"
                />
              </svg>
              <svg
                class="indicator-img"
                :class="{
                  'indicator-img_passed': order.orderStage > 2,
                  'indicator-img_active': order.orderStage === 2
                }"
                viewBox="0 0 59 44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="indicator-img__item"
                  d="M5.36364 0C3.94111 0 2.57685 0.579462 1.57097 1.61091C0.565096 2.64236 0 4.04131 0 5.5V35.75H5.36364C5.36364 37.938 6.21128 40.0365 7.7201 41.5836C9.22891 43.1308 11.2753 44 13.4091 44C15.5429 44 17.5893 43.1308 19.0981 41.5836C20.6069 40.0365 21.4545 37.938 21.4545 35.75H37.5455C37.5455 37.938 38.3931 40.0365 39.9019 41.5836C41.4107 43.1308 43.4571 44 45.5909 44C47.7247 44 49.7711 43.1308 51.2799 41.5836C52.7887 40.0365 53.6364 37.938 53.6364 35.75H59V22L50.9545 11H42.9091V0M24.1364 5.5L34.8636 16.5L24.1364 27.5V19.25H8.04545V13.75H24.1364M42.9091 15.125H49.6136L54.8968 22H42.9091M13.4091 31.625C14.476 31.625 15.4992 32.0596 16.2536 32.8332C17.008 33.6068 17.4318 34.656 17.4318 35.75C17.4318 36.844 17.008 37.8932 16.2536 38.6668C15.4992 39.4404 14.476 39.875 13.4091 39.875C12.3422 39.875 11.319 39.4404 10.5646 38.6668C9.81019 37.8932 9.38636 36.844 9.38636 35.75C9.38636 34.656 9.81019 33.6068 10.5646 32.8332C11.319 32.0596 12.3422 31.625 13.4091 31.625ZM45.5909 31.625C46.6578 31.625 47.681 32.0596 48.4354 32.8332C49.1898 33.6068 49.6136 34.656 49.6136 35.75C49.6136 36.844 49.1898 37.8932 48.4354 38.6668C47.681 39.4404 46.6578 39.875 45.5909 39.875C44.524 39.875 43.5008 39.4404 42.7464 38.6668C41.992 37.8932 41.5682 36.844 41.5682 35.75C41.5682 34.656 41.992 33.6068 42.7464 32.8332C43.5008 32.0596 44.524 31.625 45.5909 31.625Z"
                />
              </svg>
              <svg
                class="indicator-img"
                :class="{
                  'indicator-img_passed': order.orderStage > 3,
                  'indicator-img_active': order.orderStage === 3
                }"
                viewBox="0 0 44 44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  class="indicator-img__item"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44ZM36.3223 16.2789C37.0754 15.5768 37.1168 14.397 36.4146 13.6439C35.7124 12.8907 34.5327 12.8494 33.7795 13.5516L19.0531 27.2815L10.2206 19.0467C9.46749 18.3445 8.28773 18.3858 7.58556 19.139C6.8834 19.8921 6.92471 21.0718 7.67784 21.774L19.0531 32.3795L36.3223 16.2789Z"
                />
              </svg>
            </div>
            <div class="indicator-circles">
              <div
                class="indicator-circle"
                :class="{ 'indicator-circle_active': order.orderStage === 0 }"
              ></div>
              <div
                class="indicator-circle"
                :class="{ 'indicator-circle_active': order.orderStage === 1 }"
              ></div>
              <div
                class="indicator-circle"
                :class="{ 'indicator-circle_active': order.orderStage === 2 }"
              ></div>
              <div
                class="indicator-circle"
                :class="{ 'indicator-circle_active': order.orderStage === 3 }"
              ></div>
              <div class="indicator-lines">
                <div
                  class="indicator-line"
                  :class="{ 'indicator-line_passed': order.orderStage >= 1 }"
                ></div>
                <div
                  class="indicator-line"
                  :class="{ 'indicator-line_passed': order.orderStage >= 2 }"
                ></div>
                <div
                  class="indicator-line"
                  :class="{ 'indicator-line_passed': order.orderStage >= 3 }"
                ></div>
              </div>
            </div>
            <div class="indicator-texts">
              <p class="indicator-text">Проверка заказа</p>
              <p class="indicator-text">Ожидание оплаты</p>
              <p class="indicator-text">Доставка</p>
              <p class="indicator-text">Заказ завершен</p>
            </div>
          </div>
          <p class="delivery-date">
            {{ `Ожидаемая дата доставки: ${showDate(order.date as number)}` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import exitButton from '@/components/exit-button/exit-button.vue'
import fakeDB from '../cabinetPage.json'

const orderOpened = ref(NaN as number)
const orderGalleryOpened = ref(false as boolean)
const galleryIndex = ref(NaN as number)
const photoIndex = ref(1 as number)

const modalWindow = (arg: boolean, index?: number) => {
  if (arg) {
    orderGalleryOpened.value = true
    document.body.style.overflowY = 'hidden'
    galleryIndex.value = index
    return galleryIndex
  }
  orderGalleryOpened.value = false
  document.body.style.overflowY = 'visible'
  return orderGalleryOpened
}

const openCloseOrder = (index: number) => {
  if (orderOpened.value !== index) {
    orderOpened.value = index
    return orderOpened
  }
  orderOpened.value = NaN
  return orderOpened
}

const showDate = (date: number) => {
  const orderDate = new Date(date).toLocaleDateString()
  return orderDate
}

const openFullSize = () => {
  window.open(
    `/img/cabinet/orders/fakeDB/${fakeDB[galleryIndex.value].brand} ${fakeDB[galleryIndex.value].model}/${photoIndex.value}.webp`
  )
}
</script>

<style scoped src="./orders.css" />
