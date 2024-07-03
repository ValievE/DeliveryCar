<template>
  <div class="catalog">
    <modalCar
      :is-opened="isModalOpened"
      :car-index="pickedCar"
      :car-item="pickedNewCar"
      @close-car-modal="openCarModal(false)"
    />
    <h1 class="catalog-title">Каталог</h1>
    <div class="selectors">
      <div
        v-for="(selection, index) in sectionInfo"
        :key="index"
        class="selector"
        :class="{ selector_active: activeSelector === index }"
        @click="setSelector(index)"
      >
        <h3 class="selector__name">
          {{ selection.title }}
        </h3>
        <div class="selector__img" :style="{ backgroundImage: `url('${selection.img}')` }"></div>
      </div>
      <img
        v-if="!isNaN(activeSelector) && !tabletMediaSize && !mobileMediaSize"
        class="selector__sign"
        src="/img/icons/icon_triangle.svg"
        alt="\/"
        :style="{ gridColumn: activeSelector + 1 }"
      />
    </div>
    <div v-if="!isNaN(activeSelector)" class="catalog-window">
      <div class="catalog-window__header">
        <p class="catalog-window__title">{{ sectionInfo[activeSelector].title }}</p>
        <projectButton
          v-if="mobileMediaSize && sectionInfo[activeSelector].filters.length > 0"
          :text="'Фильтры'"
          :size="'small'"
          :color="'orange'"
          @click="openCloseFilters(true)"
        />
      </div>
      <div class="catalog-window__body">
        <div
          v-if="
            !loadedCarList?.length || mobileMediaSize
              ? sectionInfo[activeSelector].filters.length > 0 && isFiltersModalOpened
              : sectionInfo[activeSelector].filters.length > 0
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
                v-for="(filter, index) in sectionInfo[activeSelector].filters"
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
            <div class="filter-buttons">
              <projectButton
                :size="'medium'"
                :color="'orange'"
                :text="'Применить'"
                @click="acceptFilters(), openCloseFilters(false)"
              />
              <projectButton
                :size="'small'"
                :color="'gray'"
                :text="'Сбросить фильтры'"
                @click="clearFilters(), openCloseFilters(false)"
              />
            </div>
          </div>
        </div>
        <div
          class="catalog-list"
          :style="{
            gridTemplateColumns: isFiltersOpened ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'
          }"
        >
          <div v-if="!actualCarList?.length" class="catalog-warning">
            <unavailableIcon
              v-if="!sectionInfo[activeSelector].isActive"
              :text="'Раздел разрабатывается'"
            />
            <loadingInfoIcon
              v-if="sectionInfo[activeSelector].isActive && !loadedCarList?.length"
            />
            <undefinedCar
              v-if="
                sectionInfo[activeSelector].isActive &&
                loadedCarList?.length &&
                !actualCarList.length
              "
              :text="'К сожалению, автомобиля с такими параметрами у нас нет'"
            />
          </div>
          <div v-for="(carItem, index) in actualCarList" :key="index" class="catalog-item">
            <div
              v-if="!(carItem.brand && carItem.model && carItem.price)"
              class="catalog-item__body_loading loader"
            ></div>
            <div class="catalog-item__brand">
              <span class="catalog-item__brand-text">{{ carItem.brand }}</span>
            </div>
            <div v-if="carItem.brand && carItem.model && carItem.price" class="catalog-item__body">
              <div v-if="!carItem.avatar" class="catalog-item__img_loading loader"></div>
              <div
                v-if="carItem.avatar"
                class="catalog-item__img"
                :style="{
                  backgroundImage: `url('${carItem.avatar}')`
                }"
              ></div>
              <span class="catalog-item__name">{{ `${carItem.model} ${carItem.year}` }}</span>
              <span class="catalog-item__price">{{
                `${changePrice(carItem.price as number)} ₽`
              }}</span>
            </div>
            <button class="catalog-item__button" @click="openCarModal(true, carItem)">
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
import unavailableIcon from '@/components/unavailable-icon/unavailable-icon.vue'
import loadingInfoIcon from '@/components/loading-info-icon/loading-info-icon.vue'
import undefinedCar from '@/components/undefined-car/undefined-car.vue'
import { ref, toRefs, watch } from 'vue'
import modalCar from '@/components/modal-car/modal-car.vue'
import { supabase } from '@/lib/supabaseClient'

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

type CarSort = {
  brand: String
  year: String
  body: String
}

const cabinetProps = defineProps({
  mobileMediaSize: Boolean,
  tabletMediaSize: Boolean
})

const { mobileMediaSize, tabletMediaSize } = toRefs(cabinetProps)

const loadedCarList = ref<Array<CarInfo> | undefined>([])
const actualCarList = ref<Array<CarInfo>>([])
const bufferedCarList = ref<Array<CarInfo>>([])
const activeSelector = ref<number>(NaN)
const isFiltersOpened = ref<boolean>(true)
const sortEvent = ref('default' as 'default' | 'up' | 'down')
const pickedCar = ref(0 as number)
const pickedNewCar = ref<CarInfo>({
  body: '',
  brand: '',
  du: '',
  hp: 0,
  fuel: '',
  id: 0,
  model: '',
  price: 0,
  year: 0
})
const fakeConfigCarsDB: Array<CarInfo> = []
const isModalOpened = ref<boolean>(false)
const isFiltersModalOpened = ref<boolean>(false)

const sectionInfo = ref([
  {
    title: 'Новые автомобили',
    img: '/img/catalog/selectors/new_image.png',
    url: 'new_cars',
    isActive: true,
    filters: [
      {
        name: 'Производитель',
        key: 'brand',
        values: [] as string[],
        input: '' as string
      },
      {
        name: 'Год производства',
        key: 'year',
        values: [] as string[],
        input: '' as string
      },
      {
        name: 'Кузов',
        key: 'body',
        values: [] as string[],
        input: '' as string
      }
    ]
  },
  {
    title: 'Автомобили с пробегом',
    img: '/img/catalog/selectors/used_image.png',
    url: 'used_cars',
    isActive: true,
    filters: []
  },
  {
    title: 'Конфигуратор',
    img: '/img/catalog/selectors/configure_image.png',
    url: '',
    isActive: false,
    filters: []
  }
])

const carSort = ref<CarSort>({
  brand: '',
  year: '',
  body: ''
})

function createFilters(arg: 'new_cars' | 'used_cars') {
  sectionInfo.value.forEach((sectionInfoValue) => {
    if (sectionInfoValue.url === arg) {
      sectionInfoValue.filters.forEach((filter) => {
        loadedCarList.value?.forEach((carItem) => {
          const carItemKeys = Object.keys(carItem) as string[]
          type FilterKeys = keyof CarInfo
          if (carItemKeys.includes(filter.key)) {
            if (!filter.values.includes(carItem[filter.key as FilterKeys] as string)) {
              filter.values.push(carItem[filter.key as FilterKeys] as string)
            }
          }
        })
      })
    }
  })
}

const getData = async (arg: 'new_cars' | 'used_cars') => {
  const { data: newCars, error } = await supabase.from(arg).select('*')
  console.error('error', error)
  loadedCarList.value = newCars?.map((x) => x)
  if (loadedCarList.value) {
    createFilters(arg)
  }
}

const sortByPrice = () => {
  if (sortEvent.value === 'up') {
    actualCarList.value?.sort(
      (firstItem, secondItem) => (firstItem.price as number) - (secondItem.price as number)
    )
  }

  if (sortEvent.value === 'down') {
    actualCarList.value?.sort(
      (firstItem, secondItem) => (secondItem.price as number) - (firstItem.price as number)
    )
  }

  if (sortEvent.value === 'default') {
    actualCarList.value = [] as Array<CarInfo>
    bufferedCarList.value.forEach((item) => {
      actualCarList.value.push(item)
    })
  }
}

const acceptFilters = () => {
  carSort.value.brand = sectionInfo.value[0].filters[0].input as string
  carSort.value.year = sectionInfo.value[0].filters[1].input as string
  carSort.value.body = sectionInfo.value[0].filters[2].input as string
  actualCarList.value = [] as Array<CarInfo>
  bufferedCarList.value = [] as Array<CarInfo>

  loadedCarList.value?.forEach((item) => {
    if (item.brand === carSort.value.brand || !carSort.value.brand) {
      if (Number(item.year) === Number(carSort.value.year) || carSort.value.year === '') {
        if (item.body === carSort.value.body || !carSort.value.body) {
          actualCarList.value.push(item)
          bufferedCarList.value.push(item)
        }
      }
    }
  })

  sortByPrice()
}

const clearFilters = () => {
  sectionInfo.value.forEach((section) => {
    section.filters.forEach((filter) => {
      filter.input = ''
    })
  })

  acceptFilters()

  return sectionInfo.value
}

const setSelector = (index: number) => {
  if (index !== activeSelector.value) {
    setTimeout(
      () => {
        document.getElementsByClassName('catalog-window')[0].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      },
      mobileMediaSize.value ? 300 : 100
    )
    clearFilters()
    loadedCarList.value = []
    activeSelector.value = index
    actualCarList.value = []
    if (index === 0) {
      getData('new_cars')
    }

    if (index === 1) {
      getData('used_cars')
    }

    if (index === 2) {
      fakeConfigCarsDB.forEach((item) => {
        actualCarList.value?.push(item)
      })
    }
  }
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

const openCarModal = async (float: boolean, object?: CarInfo) => {
  if (float && object?.id !== undefined) {
    isModalOpened.value = true
    document.body.style.overflowY = 'hidden'
    pickedNewCar.value = object
    return isModalOpened
  }
  isModalOpened.value = false
  document.body.style.overflowY = 'visible'
  return isModalOpened
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
  () => loadedCarList.value,
  () => {
    if (loadedCarList.value) {
      actualCarList.value = loadedCarList.value.map((x) => x)

      actualCarList.value.forEach(async (item) => {
        const fileName = await supabase.storage.from('cars').list(`new_cars/${item.id}/`, {
          limit: 10,
          offset: 0
        })
        const imageUrl = await supabase.storage
          .from('cars')
          .getPublicUrl(`new_cars/${item.id}/${fileName.data![0].name as string}`)
        item.avatar = imageUrl.data.publicUrl
      })

      bufferedCarList.value = actualCarList.value.map((item) => item)
    }
  }
)
</script>

<style src="./catalogPage.css" scoped />
