<template>
  <button
    :class="{
      'project-button_gray': buttonProps.color === 'gray',
      'project-button_orange': buttonProps.color === 'orange',
      'project-button_small': buttonProps.size === 'small',
      'project-button_medium': buttonProps.size === 'medium',
      'project-button_big': buttonProps.size === 'big'
    }"
    class="project-button"
  >
    <img
      v-if="activeIcon !== ''"
      class="project-button-img"
      :class="{
        'project-button-img_small': buttonProps.size === 'small',
        'project-button-img_medium': buttonProps.size === 'medium',
        'project-button-img_big': buttonProps.size === 'big',
        'project-button-img_orange': buttonProps.color === 'orange'
      }"
      :src="activeIcon"
    />
    <span class="project-button-title">{{ buttonProps.text }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const buttonProps = defineProps({
  size: String,
  color: String,
  text: String,
  icon: String
})

const activeIcon = ref('')

if (buttonProps.icon === 'arrow') {
  activeIcon.value = '/img/icons/icon_arrow.svg'
}

if (buttonProps.icon === 'user') {
  activeIcon.value = '/img/icons/icon_user.svg'
}

if (buttonProps.icon === 'cart') {
  activeIcon.value = '/img/icons/icon_cart.svg'
}
</script>

<style src="./project-button.css" scoped />
