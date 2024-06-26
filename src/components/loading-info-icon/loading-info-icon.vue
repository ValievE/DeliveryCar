<template>
  <img
    class="loading-info-icon"
    src="/img/icons/anim icon/loadingInfo_icon/loading_icon.svg"
    alt=""
  />
</template>

<script setup lang="ts"></script>

<style scoped>
.loading-info-icon {
  width: 100px;
  height: 100px;
  animation: loadingInfo 1s infinite linear;
  transition: all ease-in-out 0.3s;
}

@keyframes loadingInfo {
  0% {
    rotate: -360deg;
  }
  50% {
    rotate: -180deg;
  }
}
</style>
