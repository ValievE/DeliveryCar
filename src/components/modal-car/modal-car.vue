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
              <p class="car-description__text">{{ carParameters.body }}:</p>
              <p class="car-description__text">{{ fakeNewCarsDB[carIndex].body }}</p>
            </div>
            <div class="car-description__item">
              <p class="car-description__text">{{ carParameters.inStock }}:</p>
              <p class="car-description__text">
                {{
                  fakeNewCarsDB[carIndex].inStock
                    ? `${fakeNewCarsDB[carIndex].inStock} ед.`
                    : 'Под заказ'
                }}
              </p>
            </div>
          </div>
          <div class="buy-menu">
            <p class="car-price">{{ `${fakeNewCarsDB[carIndex ? carIndex : 0].price} Р` }}</p>
            <projectButton :text="'Оформить'" :icon="'cart'" :color="'orange'" :size="'medium'" />
          </div>
        </div>
      </div>

      <div class="info-block">
        <div
          v-for="(carInfo, carInfoIndex) in Object.values(fakeNewCarsDB[carIndex].info)"
          :key="carInfoIndex"
          class="info-block__item"
        >
          <span class="parameter-title">{{
            (carParameters.info as any)[Object.keys(fakeNewCarsDB[carIndex].info)[carInfoIndex]]
          }}</span>
          <div class="parameter-line"></div>
          <span class="parameter-value">{{
            `${carInfo} ${Object.keys(fakeNewCarsDB[carIndex].info)[carInfoIndex] === 'year' ? 'г.' : ''} ${Object.keys(fakeNewCarsDB[carIndex].info)[carInfoIndex] === 'hp' ? 'л.с.' : ''}`
          }}</span>
        </div>
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

type CarParamsInfo1 = {
  year: Number
  hp: Number
  kpp: String
  du: String
  fuel: String
}

type NewCar = {
  brand: String
  model: String
  body: String
  photos: Array<string>
  inStock: Number
  price: Number
  info: CarParamsInfo1
}

type CarParamsInfo = {
  year: String
  hp: String
  kpp: String
  du: String
  fuel: String
}

interface NewCarParams {
  brand: String
  model: String
  body: String
  inStock: String
  price: String
  info: CarParamsInfo
}

const carParameters: NewCarParams = {
  brand: 'Производитель',
  model: 'Модель',
  body: 'Кузов',
  inStock: 'Наличие',
  price: 'Цена',
  info: {
    year: 'Год',
    hp: 'Мощность',
    kpp: 'Коробка передач',
    du: 'Привод',
    fuel: 'Двигатель'
  } as CarParamsInfo
}
const fakeNewCarsDB: Array<NewCar> = catalogPageJSON
</script>

<style src="./modal-car.css" scoped />
