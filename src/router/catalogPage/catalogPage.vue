<template>
  <div class="catalog">
    <modalCar
      :is-opened="isModalOpened"
      :car-index="pickedCar"
      @close-car-modal="isModalOpened = false"
    />
    <h1 class="catalog-title">Каталог</h1>
    <div class="selectors">
      <div
        v-for="(selection, index) in fakeDB"
        :key="index"
        class="selector"
        :class="{ selector_active: activeSelector === index }"
        @click="setSelector(index)"
      >
        <h3 class="selector__name">
          {{ selection.title }}
        </h3>
        <img class="selector__img" :src="selection.img" alt="?" />
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
      </div>
      <div class="catalog-window__body">
        <div class="filters" :style="{ width: isFiltersOpened ? '250px' : '0' }">
          <div class="filters-hide-btn" :style="{ width: isFiltersOpened ? '45px' : '35px' }">
            <button class="filters-hide-btn-body" @click="openFilters">
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
                  <option class="filters__option" value="default">По-умолчанию</option>
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
                  v-model="carSort.model"
                  class="filters__select"
                  @change="test"
                >
                  <option class="filters__option" value="">Выберите параметр</option>
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
            <button class="catalog-item__button" @click="openCarModal(index)">
              Узнать подробности
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import modalCar from '@/components/modal-car/modal-car.vue'
import catalogPageJSON from './catalogPage.json'

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
const carSort = reactive({
  brand: '',
  model: '',
  year: 0,
  body: ''
})

const openFilters = () => {
  isFiltersOpened.value = !isFiltersOpened.value
  return isFiltersOpened
}

const setSelector = (index: number) => {
  activeSelector.value = index
  actualCarList.value = []
  if (index === 0) {
    fakeNewCarsDB.forEach((item) => {
      actualCarList.value.push(item)
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
        input: carSort.brand
      },
      {
        name: 'Модель',
        values: ['Выберите марку'],
        input: carSort.model
      },
      {
        name: 'Год производства',
        values: [2022, 2023, 2024],
        input: carSort.year
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Универсал', 'Внедорожник', 'Минивэн'],
        input: carSort.body
      }
    ]
  },
  {
    title: 'Автомобили с пробегом',
    img: '/img/catalog/selectors/used_image.png',
    filters: [
      {
        name: 'Производитель',
        values: ['BMW', 'Geely', 'Haval', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Volkswagen'],
        input: carSort.brand
      },
      {
        name: 'Модель',
        values: ['Выберите марку'],
        input: carSort.model
      },
      {
        name: 'Год производства',
        values: [2020, 2021, 2022, 2023, 2024],
        input: carSort.year
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Универсал', 'Внедорожник', 'Минивэн'],
        input: carSort.body
      }
    ]
  },
  {
    title: 'Конфигуратор',
    img: '/img/catalog/selectors/configure_image.png',
    filters: [
      {
        name: 'Производитель',
        values: ['BMW', 'Geely', 'Haval', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Volkswagen'],
        input: carSort.brand
      },
      {
        name: 'Модель',
        values: ['Выберите марку'],
        input: carSort.model
      },
      {
        name: 'Год производства',
        values: [2024],
        input: carSort.year
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Универсал', 'Внедорожник', 'Минивэн'],
        input: carSort.body
      },
      {
        name: 'Еще чо нидь',
        values: ['Аоаомм', 'Жоаоаоа', 'Гоооол'],
        input: carSort.body
      }
    ]
  }
]

const sortByPrice = () => {
  actualCarList.value.forEach((carObject) => {
    if (bufferedCarList.value.length === 0) {
      bufferedCarList.value.push(carObject)
      return
    }

    if (carObject.price < bufferedCarList.value[0].price) {
      bufferedCarList.value.splice(0, 0, carObject)
      return
    }

    let lastHighIndex = 0 as number

    bufferedCarList.value.forEach((bCarObject, index) => {
      if (carObject.price > bCarObject.price) {
        lastHighIndex = index + 1
        return
      }

      if (carObject.price === bCarObject.price) {
        lastHighIndex = index + 1
      }
    })

    if (lastHighIndex !== 0) {
      bufferedCarList.value.splice(lastHighIndex, 0, carObject)
    }
  })

  actualCarList.value = [] as Array<NewCar>

  if (sortEvent.value === 'default') {
    fakeNewCarsDB.forEach((item) => {
      actualCarList.value.push(item)
    })
  }

  if (sortEvent.value === 'up') {
    bufferedCarList.value.forEach((item) => {
      actualCarList.value.push(item)
    })
  }

  if (sortEvent.value === 'down') {
    bufferedCarList.value.forEach((item) => {
      actualCarList.value.splice(0, 0, item)
    })
  }

  bufferedCarList.value = [] as Array<NewCar>
}

const openCarModal = (arg: number) => {
  pickedCar.value = arg
  isModalOpened.value = true
}

const test = () => {
  console.log(carSort)
}
</script>

<style src="./catalogPage.css" scoped />
