<template>
  <div v-if="isOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="modalNewsEmits('closeNewsModal')" />
      <h3 class="news-title">{{ info.news_title }}</h3>
      <p class="news-date">{{ createdData }}</p>
      <p class="news-text">{{ info.news_text }}</p>
      <div v-if="info.image" class="news-image">
        <div v-if="!info.url" class="news-img_loading loader"></div>
        <img v-if="info.url" class="news-img" :src="info.url" alt="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import { supabase } from '@/lib/supabaseClient'
import { computed, toRefs, watch } from 'vue'

type News = {
  id?: string
  created_at?: string
  news_title?: string
  news_text?: string
  image?: boolean
  url?: string
}

interface Props {
  isOpened: boolean
  info: News
}

const modalNewsProps = defineProps<Props>()

const { isOpened, info } = toRefs(modalNewsProps)

const modalNewsEmits = defineEmits(['closeNewsModal'])

const createdData = computed(() => {
  const newData = new Date(info.value.created_at as string)
  return newData.toLocaleDateString()
})

const getImage = async () => {
  const fileName = await supabase.storage.from('news').list(`${info.value.id}`, {
    limit: 10,
    offset: 0
  })
  const imageUrl = await supabase.storage
    .from('news')
    .getPublicUrl(`${info.value.id}/${fileName.data![0].name}`)
  info.value.url = imageUrl.data.publicUrl
}

watch(
  () => isOpened.value,
  () => {
    if (info.value.image) {
      getImage()
    }
  }
)
</script>

<style src="./modal-news.css" scoped />
