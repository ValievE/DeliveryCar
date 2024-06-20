<template>
  <div class="catalog">
    <modalCar
      :is-opened="isModalOpened"
      :car-index="pickedCar"
      @close-car-modal="openCarModal(false)"
    />
    <h1 class="catalog-title">Каталог</h1>
    <div class="selectors">
      <div
        v-for="(selection, index) in fakeDB"
        :key="index"
        class="selector"
        :class="{ selector_active: activeSelector === index }"
        :style="{
          height:
            activeSelector === index
              ? (mobileMediaSize ? '300px' : '280px') || (tabletMediaSize ? '200px' : '280px')
              : mobileMediaSize
                ? '100px'
                : '70px'
        }"
        @click="setSelector(index)"
      >
        <h3 class="selector__name">
          {{ selection.title }}
        </h3>
        <div class="selector__img" :style="{ backgroundImage: `url('${selection.img}')` }"></div>
      </div>
      <img
        v-if="!isNaN(activeSelector)"
        class="selector__sign"
        src="/img/icons/icon_triangle.svg"
        alt="\/"
        :style="{ gridColumn: activeSelector + 1 }"
      />
    </div>
    <div v-if="!isNaN(activeSelector)" class="catalog-window">
      <div class="catalog-window__header">
        <p class="catalog-window__title">{{ fakeDB[activeSelector].title }}</p>
        <projectButton
          :text="'Фильтры'"
          :size="'small'"
          :color="'orange'"
          @click="openCloseFilters(true)"
        />
      </div>
      <div class="catalog-window__body">
        <div
          v-if="
            mobileMediaSize
              ? fakeDB[activeSelector].filters.length > 0 && isFiltersModalOpened
              : fakeDB[activeSelector].filters.length > 0
          "
          :class="{ filters: !mobileMediaSize, 'filters-burger': mobileMediaSize }"
          :style="{ width: isFiltersOpened ? (mobileMediaSize ? '100%' : '250px') : '0' }"
        >
          <div
            v-if="!mobileMediaSize && !tabletMediaSize"
            class="filters-hide-btn"
            :style="{ width: isFiltersOpened ? '45px' : '35px' }"
          >
            <button class="filters-hide-btn-body" @click="isFiltersOpened = !isFiltersOpened">
              <img
                class="filters-hide-btn-img"
                src="/img/icons/icon_triangle_45deg.svg"
                :style="{ rotate: isFiltersOpened ? '180deg' : '0deg' }"
                alt="?"
              />
            </button>
          </div>
          <div class="filters__body">
            <p class="filters__title">Фильтры</p>
            <div class="filters__list">
              <div class="filters__list-item">
                <label class="filters__label" for="sortBy">Сортировать</label>
                <select
                  id="sortBy"
                  v-model="sortEvent"
                  class="filters__select"
                  @change="sortByPrice"
                >
                  <option class="filters__option" value="default" selected>По-умолчанию</option>
                  <option class="filters__option" value="down">По убыванию цены</option>
                  <option class="filters__option" value="up">По возрастанию цены</option>
                </select>
              </div>
              <div
                v-for="(filter, index) in fakeDB[activeSelector].filters"
                :key="index"
                class="filters__list-item"
              >
                <label class="filters__label" :for="filter.name">{{ filter.name }}</label>
                <select
                  :id="filter.name"
                  v-model="filter.input"
                  placeholder="Выберите значение"
                  class="filters__select"
                  @change="acceptFilters"
                >
                  <option class="filters__option" :value="''" selected>Выберите параметр</option>
                  <option
                    v-for="(filterOpt, FOindex) in filter.values"
                    :key="FOindex"
                    class="filters__option"
                    :value="filterOpt"
                  >
                    {{ filterOpt }}
                  </option>
                </select>
              </div>
            </div>
            <projectButton
              :size="'medium'"
              :color="'orange'"
              :text="'Применить'"
              @click="acceptFilters, openCloseFilters(false)"
            />
          </div>
        </div>
        <div class="catalog-list">
          <div v-if="!actualCarList.length" class="catalog-warning">
            <img
              class="catalog-warning__img"
              src="/img/empty_garage.svg"
              alt="Тут пока что пусто"
            />
          </div>
          <div v-for="(carItem, index) in actualCarList" :key="index" class="catalog-item">
            <div class="catalog-item__body">
              <img class="catalog-item__img" :src="carItem.photos[0]" alt="?" />
              <span class="catalog-item__name">{{
                `${String(carItem.brand)} ${String(carItem.model)} ${String(carItem.info.year)}`
              }}</span>
              <span class="catalog-item__price">{{ `${carItem.price} Р` }}</span>
            </div>
            <button
              class="catalog-item__button"
              @click="openCarModal(true, carItem.carId as number)"
            >
              Узнать подробности
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import projectButton from '@/components/project-button/project-button.vue'
import { ref, toRefs } from 'vue'
import modalCar from '@/components/modal-car/modal-car.vue'
import catalogPageJSON from './catalogPage.json'

const cabinetProps = defineProps({
  mobileMediaSize: Boolean,
  tabletMediaSize: Boolean
})

const { mobileMediaSize, tabletMediaSize } = toRefs(cabinetProps)

type NewCar = {
  carId: Number
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

const activeSelector = ref(NaN as number)
const isFiltersOpened = ref(true as boolean)
const sortEvent = ref('default' as 'default' | 'up' | 'down')
const pickedCar = ref(0 as number)
const fakeNewCarsDB: Array<NewCar> = catalogPageJSON
const fakeUsedCarsDB: Array<NewCar> = []
const fakeConfigCarsDB: Array<NewCar> = []
const actualCarList = ref([] as Array<NewCar>)
const bufferedCarList = ref([] as Array<NewCar>)
const isModalOpened = ref(false as boolean)
const isFiltersModalOpened = ref<Boolean>(false)

const setSelector = (index: number) => {
  activeSelector.value = index
  actualCarList.value = []
  if (index === 0) {
    fakeNewCarsDB.forEach((item) => {
      actualCarList.value.push(item)
      bufferedCarList.value.push(item)
    })
  }

  if (index === 1) {
    fakeUsedCarsDB.forEach((item) => {
      actualCarList.value.push(item)
    })
  }

  if (index === 2) {
    fakeConfigCarsDB.forEach((item) => {
      actualCarList.value.push(item)
    })
  }
}

const fakeDB = [
  {
    title: 'Новые автомобили',
    img: '/img/catalog/selectors/new_image.png',
    filters: [
      {
        name: 'Производитель',
        values: ['BMW', 'Geely', 'Haval', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Volkswagen'],
        input: '' as string
      },
      {
        name: 'Год производства',
        values: [2022, 2023, 2024],
        input: '' as number | ''
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Купе', 'Универсал', 'Внедорожник', 'Минивэн'],
        input: '' as string
      }
    ]
  },
  {
    title: 'Автомобили с пробегом',
    img: '/img/catalog/selectors/used_image.png',
    filters: []
  },
  {
    title: 'Конфигуратор',
    img: '/img/catalog/selectors/configure_image.png',
    filters: []
  }
]

const carSort = ref({
  brand: '' as string,
  year: '' as number | '',
  body: '' as string
})

const sortByPrice = () => {
  if (sortEvent.value === 'up') {
    actualCarList.value.sort(
      (firstItem, secondItem) => (firstItem.price as number) - (secondItem.price as number)
    )
  }

  if (sortEvent.value === 'down') {
    actualCarList.value.sort(
      (firstItem, secondItem) => (secondItem.price as number) - (firstItem.price as number)
    )
  }

  if (sortEvent.value === 'default') {
    actualCarList.value = [] as Array<NewCar>
    bufferedCarList.value.forEach((item) => {
      actualCarList.value.push(item)
    })
  }
}

const acceptFilters = () => {
  carSort.value.brand = fakeDB[0].filters[0].input as string
  carSort.value.year = fakeDB[0].filters[1].input as number
  carSort.value.body = fakeDB[0].filters[2].input as string
  actualCarList.value = [] as Array<NewCar>
  bufferedCarList.value = [] as Array<NewCar>

  fakeNewCarsDB.forEach((item) => {
    if (item.brand === carSort.value.brand || !carSort.value.brand) {
      if (item.info.year === carSort.value.year || !carSort.value.year) {
        if (item.body === carSort.value.body || !carSort.value.body) {
          bufferedCarList.value.push(item)
          actualCarList.value.push(item)
        }
      }
    }
  })
}

const openCloseFilters = (arg: boolean) => {
  if (arg) {
    isFiltersModalOpened.value = true
    document.body.style.overflowY = 'hidden'
    return
  }
  isFiltersModalOpened.value = false
  document.body.style.overflowY = 'visible'
}

const openCarModal = (float: boolean, index?: number) => {
  if (float && index !== undefined) {
    isModalOpened.value = true
    document.body.style.overflowY = 'hidden'
    pickedCar.value = index
    return isModalOpened
  }
  isModalOpened.value = false
  document.body.style.overflowY = 'visible'
  return isModalOpened
}
</script>

<style src="./catalogPage.css" scoped />
