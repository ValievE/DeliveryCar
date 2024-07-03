<template>
  <div class="modal-zone">
    <div class="modal-window">
      <img class="universal-icon" :src="`/img/icons/icon_${type}.svg`" alt="" />
      <p class="universal-text">{{ text }}</p>
      <div
        v-if="timer"
        class="timer"
        :style="{
          'animation-duration': `${timer}`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

type TypeOfModal = 'success' | 'denied'

const modalUniProps = defineProps<{
  text: String
  type: TypeOfModal
  timer: String
}>()

const { text, type, timer } = toRefs(modalUniProps)
</script>

<style src="./modal-universal.css" scoped />
