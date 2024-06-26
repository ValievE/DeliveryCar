<template>
  <div class="unavailable-icon">
    <div class="unavailable-icon__image-flow">
      <img
        class="unavailable-icon__image-first-item"
        src="/img/icons/anim icon/unavailable_icon/icon_wranch.svg"
        alt=""
      />
      <img
        class="unavailable-icon__image-second-item"
        src="/img/icons/anim icon/unavailable_icon/icon_screw.svg"
        alt=""
      />
    </div>
    <span class="unavailable-icon__text">{{ unavailableIconProps.text }}</span>
  </div>
</template>

<script lang="ts" setup>
const unavailableIconProps = defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.unavailable-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  opacity: 0.4;
}

.unavailable-icon__text {
  text-transform: uppercase;
  font-size: 22px;
  text-align: center;
  width: 300px;
}

.unavailable-icon__image-flow {
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
}

.unavailable-icon__image-first-item {
  width: 100%;
}

.unavailable-icon__image-second-item {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  animation: unavailableIcon linear infinite 2s;
  rotate: 0deg;
}

@keyframes unavailableIcon {
  0% {
    rotate: -360deg;
  }
  50% {
    rotate: -180deg;
  }
}

@media (max-width: 800px) {
  .unavailable-icon__text {
    font-size: 18px;
    width: 250px;
  }
}
</style>
