<template>
  <div
    class="exit-button"
    :class="{
      'exit-button-burger': buttonProps.burgerMenu
    }"
  >
    <img class="exit-icon" src="/img/icons/icon_x.svg" alt="X" />
  </div>
</template>

<script setup lang="ts">
const buttonProps = defineProps({
  burgerMenu: Boolean
})
</script>

<style src="./exit-button.css" scoped />
