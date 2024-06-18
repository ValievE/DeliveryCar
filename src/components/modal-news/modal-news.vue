<template>
  <div v-if="isOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="modalNewsEmits('closeNewsModal')" />
      <p>{{ actualNews }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import { ref, toRefs } from 'vue'

const modalNewsProps = defineProps({
  isOpened: Boolean,
  info: {
    type: Object || undefined,
    default: ''
  }
})

const { isOpened, info } = toRefs(modalNewsProps)

const modalNewsEmits = defineEmits(['closeNewsModal'])

const actualNews = ref(info)
</script>

<style src="./modal-news.css" scoped />
