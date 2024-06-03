<template>
  <div class="modal-zone" v-if="isOpened">
    <div class="modal-window">
      <exitButton @click="$emit('closeNewsModal')" />
      <p>{{ actualNews }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import { ref, toRefs } from 'vue'

const modalNewsProps = defineProps({
  isOpened: Boolean,
  info: Object || undefined
})

const { isOpened, info } = toRefs(modalNewsProps)

const actualNews = ref(info)
</script>

<style src="./modal-news.css" scoped />
