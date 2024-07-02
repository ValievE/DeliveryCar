<template>
  <div class="undefined-car">
    <img class="undefined-car__img" src="/img/icons/undefined-car.svg" alt="" />
    <span class="undefined-car__text">{{ undefinedCarProps.text }}</span>
  </div>
</template>

<script setup lang="ts">
const undefinedCarProps = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.undefined-car {
  width: 400px;
  height: fit-content;
  opacity: 0.6;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
}

.undefined-car__img {
  width: 100%;
}

.undefined-car__text {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
</style>
