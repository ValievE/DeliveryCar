<template>
  <div class="catalog">
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

      <!-- <div
        class="selector"
        @click="setSelector(0)"
        :class="{ selector_active: activeSelector === 0 }"
      >
        <h3 class="selector__name">
          Новые <br />
          автомобили
        </h3>
        <img class="selector__img" src="/img/catalog/selectors/new_image.png" />
      </div>
      <div
        class="selector"
        @click="setSelector(1)"
        :class="{ selector_active: activeSelector === 1 }"
      >
        <h3 class="selector__name">
          Автомобили <br />
          с пробегом
        </h3>
        <img class="selector__img" src="/img/catalog/selectors/used_image.png" />
      </div>
      <div
        class="selector"
        @click="setSelector(2)"
        :class="{ selector_active: activeSelector === 2 }"
      >
        <h3 class="selector__name">Конфигуратор</h3>
        <img class="selector__img" src="/img/catalog/selectors/configure_image.png" />
      </div> -->
      <img
        class="selector__sign"
        src="/public/img/icons/icon_triangle.svg"
        alt="\/"
        :style="{ gridColumn: activeSelector + 1 }"
      />
    </div>
    <div class="catalog-window">
      <div class="catalog-window__header">
        <p class="catalog-window__title">{{ `Новые автомобили` }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeSelector = ref(0 as number)

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
    img: '/img/catalog/selectors/new_image.png'
  },
  {
    title: 'Автомобили с пробегом',
    img: '/img/catalog/selectors/used_image.png'
  },
  {
    title: 'Конфигуратор',
    img: '/img/catalog/selectors/configure_image.png'
  }
]
</script>

<style src="./catalogPage.css" scoped />
