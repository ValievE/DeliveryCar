<template>
  <div v-if="isOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="modalCarsEmits('closeCarModal')" />
      <div class="section-one">
        <div
          class="section-one__img"
          :style="{
            backgroundImage: `url('${actualCar.avatar}')`
          }"
        ></div>
        <div class="section-one__info-block">
          <h3 class="car-name">
            {{ `${carItem.brand} ${carItem.model}` }}
          </h3>
          <div class="car-description">
            <div class="car-description__item">
              <p class="car-description__text">Кузов:</p>
              <p class="car-description__text">{{ carItem.body }}</p>
            </div>
            <div class="car-description__item">
              <p class="car-description__text">Наличие:</p>
              <p class="car-description__text">
                {{ carItem.in_stock ? `${carItem.in_stock} ед.` : 'Под заказ' }}
              </p>
            </div>
          </div>
          <div class="buy-menu">
            <p class="car-price">{{ `${changePrice(carItem.price)} ₽` }}</p>
            <projectButton :text="'Оформить'" :icon="'cart'" :color="'orange'" :size="'medium'" />
          </div>
        </div>
      </div>

      <div class="info-block">
        <div
          v-for="(parameter, parameterIndex) in actualCarInfo"
          :key="parameterIndex"
          class="info-block__item"
        >
          <span class="parameter-title">{{ parameter.title }}</span>
          <div class="parameter-line"></div>
          <span class="parameter-value">{{ parameter.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import projectButton from '@/components/project-button/project-button.vue'
import { ref, toRefs, watch } from 'vue'

type CarInfo = {
  avatar?: String
  id: Number
  brand: String
  model: String
  hp: Number
  du: String
  fuel: String
  body: String
  in_stock?: Number
  kpp?: String
  price: Number
  year: Number
  mileage?: Number
}

type CarParamsInfo = {
  year: String
  hp: String
  kpp: String
  du: String
  fuel: String
}

type ActualCarInfo = {
  title: String
  value: String
}

const modalCarProps = defineProps({
  isOpened: Boolean,
  carIndex: { type: Number, default: 0 },
  carItem: {
    type: Object || undefined,
    default: ''
  }
})
const { isOpened, carItem } = toRefs(modalCarProps)

const modalCarsEmits = defineEmits(['closeCarModal'])

const actualCar = ref(carItem.value as CarInfo)

const carParameters: CarParamsInfo = {
  year: 'Год',
  hp: 'Мощность',
  kpp: 'КПП',
  du: 'Привод',
  fuel: 'Двигатель'
}

const actualCarInfo = ref<Array<ActualCarInfo>>([])

const setValue = (object: CarInfo) => {
  actualCarInfo.value = []
  const properties = Object.keys(carParameters)
  type PropertyType = keyof CarParamsInfo
  properties.forEach((property) => {
    if (object[property as PropertyType]) {
      actualCarInfo.value.push({
        title: carParameters[property as PropertyType] as string,
        value: `${object[property as PropertyType] as string}${property === 'hp' ? ' л.с.' : property === 'year' ? ' г.' : ''}`
      } as ActualCarInfo)
    }
  })
  return actualCarInfo
}

const changePrice = (arg: number) => {
  const strigifiedPrice = String(arg).split('')
  let priceLength = strigifiedPrice.length
  while (priceLength >= 3) {
    priceLength -= 3
    strigifiedPrice.splice(priceLength, 0, ' ')
  }
  return strigifiedPrice.join('')
}

watch(
  () => carItem.value,
  (newValue) => {
    actualCar.value = newValue as CarInfo
    setValue(actualCar.value)
  }
)
</script>

<style src="./modal-car.css" scoped />
