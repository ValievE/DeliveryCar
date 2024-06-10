<template>
  <div class="catalog">
    <modalCar
      :is-opened="isModalOpened"
      :car-index="pickedCar"
      @closeCarModal="isModalOpened = false"
    />
    <h1 class="catalog-title">Каталог</h1>
    <div class="selectors">
      <div
        class="selector"
        @click="setSelector(index)"
        :class="{ selector_active: activeSelector === index }"
        v-for="(selection, index) in fakeDB"
        :key="index"
      >
        <h3 class="selector__name">
          {{ selection.title }}
        </h3>
        <img class="selector__img" :src="selection.img" />
      </div>
      <img
        class="selector__sign"
        src="/img/icons/icon_triangle.svg"
        alt="\/"
        :style="{ gridColumn: activeSelector + 1 }"
      />
    </div>
    <div class="catalog-window">
      <div class="catalog-window__header">
        <p class="catalog-window__title">{{ fakeDB[activeSelector].title }}</p>
      </div>
      <div class="catalog-window__body">
        <div class="filters" :style="{ width: isFiltersOpened ? '250px' : '0' }">
          <div class="filters-hide-btn" :style="{ width: isFiltersOpened ? '45px' : '35px' }">
            <button @click="openFilters" class="filters-hide-btn-body">
              <img
                class="filters-hide-btn-img"
                src="/img/icons/icon_triangle_45deg.svg"
                :style="{ rotate: isFiltersOpened ? '180deg' : '0deg' }"
              />
            </button>
          </div>
          <div class="filters__body">
            <p class="filters__title">Фильтры</p>
            <div class="filters__list">
              <div class="filters__list-item">
                <label class="filters__label" for="sortBy">Сортировать</label>
                <select
                  class="filters__select"
                  id="sortBy"
                  @change="sortByPrice"
                  v-model="sortEvent"
                >
                  <option class="filters__option" value="default">По-умолчанию</option>
                  <option class="filters__option" value="down">По убыванию цены</option>
                  <option class="filters__option" value="up">По возрастанию цены</option>
                </select>
              </div>
              <div
                class="filters__list-item"
                v-for="(filter, index) in fakeDB[activeSelector].filters"
                :key="index"
              >
                <label class="filters__label" :for="filter.name">{{ filter.name }}</label>
                <select class="filters__select" :id="filter.name">
                  <option class="filters__option" value="">Выберите параметр</option>
                  <option
                    class="filters__option"
                    v-for="(filterOpt, index) in filter.values"
                    :key="index"
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
          <div class="catalog-item" v-for="(carItem, index) in actualCarList" :key="index">
            <div class="catalog-item__body">
              <img class="catalog-item__img" :src="carItem.photos[0]" />
              <span class="catalog-item__name">{{
                String(carItem.brand) +
                ' ' +
                String(carItem.model) +
                ' ' +
                String(carItem.info.year)
              }}</span>
              <span class="catalog-item__price">{{ carItem.price + 'Р' }}</span>
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
import { ref } from 'vue'
import modalCar from '@/components/modal-car/modal-car.vue'
import catalogPageJSON from './catalogPage.json'

const activeSelector = ref(0 as number)
const isFiltersOpened = ref(true as boolean)
const sortEvent = ref('default' as 'default' | 'up' | 'down')
const pickedCar = ref(0 as number)

const openFilters = () =>
  isFiltersOpened.value ? (isFiltersOpened.value = false) : (isFiltersOpened.value = true)

const setSelector = (index: number) => {
  if (index === 0) {
    activeSelector.value = 0
  }
  if (index === 1) {
    activeSelector.value = 1
  }
  if (index === 2) {
    activeSelector.value = 2
  }
}

const fakeDB = [
  {
    title: 'Новые автомобили',
    img: '/img/catalog/selectors/new_image.png',
    filters: [
      {
        name: 'Производитель',
        values: ['BMW', 'Geely', 'Haval', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Volkswagen']
      },
      {
        name: 'Модель',
        values: ['Выберите марку']
      },
      {
        name: 'Год производства',
        values: [2022, 2023, 2024]
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Универсал', 'Внедорожник', 'Минивэн']
      }
    ]
  },
  {
    title: 'Автомобили с пробегом',
    img: '/img/catalog/selectors/used_image.png',
    filters: [
      {
        name: 'Производитель',
        values: ['BMW', 'Geely', 'Haval', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Volkswagen']
      },
      {
        name: 'Модель',
        values: ['Выберите марку']
      },
      {
        name: 'Год производства',
        values: [2020, 2021, 2022, 2023, 2024]
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Универсал', 'Внедорожник', 'Минивэн']
      }
    ]
  },
  {
    title: 'Конфигуратор',
    img: '/img/catalog/selectors/configure_image.png',
    filters: [
      {
        name: 'Производитель',
        values: ['BMW', 'Geely', 'Haval', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Volkswagen']
      },
      {
        name: 'Модель',
        values: ['Выберите марку']
      },
      {
        name: 'Год производства',
        values: [2024]
      },
      {
        name: 'Кузов',
        values: ['Хетчбек', 'Седан', 'Универсал', 'Внедорожник', 'Минивэн']
      },
      {
        name: 'Еще чо нидь',
        values: ['Аоаомм', 'Жоаоаоа', 'Гоооол']
      }
    ]
  }
]

type newCar = {
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

const fakeNewCarsDB: Array<newCar> = catalogPageJSON

// const fakeNewCarsDB: Array<newCar> = [
//   {
//     brand: 'BMW',
//     model: 'M4',
//     body: 'Купе',
//     photos: ['/img/catalog/newCars/bmw/m4.png'],
//     inStock: 0,
//     price: 15599000,
//     info: {
//       year: 2024,
//       hp: 510,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'BMW',
//     model: 'M4',
//     body: 'Купе',
//     photos: ['/img/catalog/newCars/bmw/m4.png'],
//     inStock: 2,
//     price: 14999000,
//     info: {
//       year: 2023,
//       hp: 510,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'BMW',
//     model: '5-series',
//     body: 'Седан',
//     photos: ['/img/catalog/newCars/bmw/5series.png'],
//     inStock: 0,
//     price: 12099000,
//     info: {
//       year: 2023,
//       hp: 252,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Mercedes-Benz',
//     model: 'S-Class(S450)',
//     body: 'Седан',
//     photos: ['/img/catalog/newCars/mercedes-benz/s-class.webp'],
//     inStock: 0,
//     price: 26600000,
//     info: {
//       year: 2024,
//       hp: 367,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Mercedes-Benz',
//     model: 'V-Class(V300d)',
//     body: 'Минивэн',
//     photos: ['/img/catalog/newCars/mercedes-benz/v-class.webp'],
//     inStock: 1,
//     price: 14989000,
//     info: {
//       year: 2023,
//       hp: 237,
//       kpp: 'Автомат',
//       du: 'Задний',
//       fuel: 'Дизель'
//     }
//   },
//   {
//     brand: 'Haval',
//     model: 'Jolion',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/haval/jolion.webp'],
//     inStock: 3,
//     price: 1499000,
//     info: {
//       year: 2024,
//       hp: 143,
//       kpp: 'Механическая',
//       du: 'Передний',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Haval',
//     model: 'Dargo',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/haval/dargo.webp'],
//     inStock: 1,
//     price: 1499000,
//     info: {
//       year: 2024,
//       hp: 192,
//       kpp: 'Робот',
//       du: 'Передний',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Porsche',
//     model: 'Cayenne',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/porsche/cayenne.png'],
//     inStock: 0,
//     price: 21550000,
//     info: {
//       year: 2024,
//       hp: 340,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Toyota',
//     model: 'Land Cruiser Prado (150 Series)',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/toyota/prado-150series.webp'],
//     inStock: 1,
//     price: 8490000,
//     info: {
//       year: 2024,
//       hp: 163,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Toyota',
//     model: 'Highlander',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/toyota/highlander-u70.webp'],
//     inStock: 1,
//     price: 7450000,
//     info: {
//       year: 2023,
//       hp: 249,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Toyota',
//     model: 'Camry',
//     body: 'Седан',
//     photos: ['/img/catalog/newCars/toyota/camry-xv70.webp'],
//     inStock: 0,
//     price: 3450000,
//     info: {
//       year: 2023,
//       hp: 209,
//       kpp: 'Автомат',
//       du: 'Передний',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Volkswagen',
//     model: 'ID.6 Crozz Lite Pro',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/volkswagen/id6.webp'],
//     inStock: 0,
//     price: 4000000,
//     info: {
//       year: 2022,
//       hp: 204,
//       kpp: '',
//       du: 'Задний',
//       fuel: 'Электрический'
//     }
//   },
//   {
//     brand: 'Volkswagen',
//     model: 'Touareg',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/volkswagen/touareg.png'],
//     inStock: 0,
//     price: 9500000,
//     info: {
//       year: 2022,
//       hp: 340,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Geely',
//     model: 'Okavango Flagship',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/geely/okavango.webp'],
//     inStock: 0,
//     price: 3100000,
//     info: {
//       year: 2023,
//       hp: 177,
//       kpp: 'Робот',
//       du: 'Передний',
//       fuel: 'Бензин'
//     }
//   },
//   {
//     brand: 'Geely',
//     model: 'Monjaro',
//     body: 'Внедорожник',
//     photos: ['/img/catalog/newCars/geely/monjaro.webp'],
//     inStock: 1,
//     price: 3390000,
//     info: {
//       year: 2024,
//       hp: 238,
//       kpp: 'Автомат',
//       du: 'Полный',
//       fuel: 'Бензин'
//     }
//   }
// ]

const actualCarList = ref([] as Array<newCar>)
const bufferedCarList = ref([] as Array<newCar>)
const isModalOpened = ref(false as boolean)

fakeNewCarsDB.forEach((item) => {
  actualCarList.value.push(item)
})

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
        return
      }
    })

    if (lastHighIndex !== 0) {
      bufferedCarList.value.splice(lastHighIndex, 0, carObject)
      return
    }
  })

  actualCarList.value = [] as Array<newCar>

  if (sortEvent.value === 'default') {
    fakeNewCarsDB.forEach((item) => {
      actualCarList.value.push(item)
    })
  }

  if (sortEvent.value === 'up') {
    bufferedCarList.value.forEach((item) => {
      actualCarList.value.push(item)
      console.log(actualCarList.value)
    })
  }

  if (sortEvent.value === 'down') {
    bufferedCarList.value.forEach((item) => {
      actualCarList.value.splice(0, 0, item)

      console.log(actualCarList.value)
    })
  }

  bufferedCarList.value = [] as Array<newCar>

  return
}

const openCarModal = (arg: number) => {
  pickedCar.value = arg
  isModalOpened.value = true
  return
}
</script>

<style src="./catalogPage.css" scoped />
