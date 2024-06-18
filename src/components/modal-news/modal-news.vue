<template>
  <div v-if="isOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="modalNewsEmits('closeNewsModal')" />
      <h3 class="news-title">{{ info.title }}</h3>
      <p class="news-date">{{ info.date }}</p>
      <p class="news-text">{{ info.text }}</p>
      <div v-if="info.img" class="news-image">
        <img class="news-img" :src="info.img" alt="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import { toRefs } from 'vue'

const modalNewsProps = defineProps({
  isOpened: Boolean,
  info: {
    type: Object || undefined,
    default: ''
  }
})

const { isOpened, info } = toRefs(modalNewsProps)

const modalNewsEmits = defineEmits(['closeNewsModal'])
</script>

<style src="./modal-news.css" scoped />
