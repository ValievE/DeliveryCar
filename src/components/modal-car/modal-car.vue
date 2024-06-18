<template>
  <div v-if="isOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="modalCarsEmits('closeCarModal')" />
      <div class="section-one">
        <img
          class="section-one__img"
          :src="fakeNewCarsDB[carIndex ? carIndex : 0].photos[0]"
          alt="?"
        />
        <div class="section-one__info-block">
          <h3 class="car-name">
            {{
              `${fakeNewCarsDB[carIndex ? carIndex : 0].brand} ${fakeNewCarsDB[carIndex ? carIndex : 0].model}`
            }}
          </h3>
          <div class="car-description">
            <div class="car-description__item">
              <p class="car-description__text"></p>
              <div class="car-description__line"></div>
              <p class="car-description__text"></p>
            </div>
          </div>
          <div class="buy-menu">
            <p class="car-price">{{ `${fakeNewCarsDB[carIndex ? carIndex : 0].price} Р` }}</p>
            <projectButton :text="'Оформить'" :icon="'cart'" :color="'orange'" :size="'medium'" />
          </div>
        </div>
      </div>

      <div class="info-block">
        <div class="info-block__item"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import projectButton from '@/components/project-button/project-button.vue'
import { toRefs } from 'vue'
import catalogPageJSON from '@/router/catalogPage/catalogPage.json'

const modalCarProps = defineProps({ isOpened: Boolean, carIndex: { type: Number, default: 0 } })
const { isOpened, carIndex } = toRefs(modalCarProps)

const modalCarsEmits = defineEmits(['closeCarModal'])

type NewCar = {
  brand: String
  model: String
  body: String
  photos: Array<string>
  inStock: Number
  price: Number
  info: {
    year: Number
    hp: Number
    kpp: String
    du: String
    fuel: String
  }
}

const fakeNewCarsDB: Array<NewCar> = catalogPageJSON
</script>

<style src="./modal-car.css" scoped />
