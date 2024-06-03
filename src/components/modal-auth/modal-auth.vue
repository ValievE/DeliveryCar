<template>
  <div class="modal-zone" v-if="isOpened">
    <div class="modal-window">
      <exitButton @click="$emit('closeAuthModal')" />
      <div class="action">
        <p
          class="action__item"
          @click="actualAction = 0"
          :class="{ action__item_inactive: actualAction === 1 }"
        >
          авторизация
        </p>
        <p class="action__item">|</p>
        <p
          class="action__item"
          @click="actualAction = 1"
          :class="{ action__item_inactive: actualAction === 0 }"
        >
          регистрация
        </p>
      </div>
      <div class="authorisation" v-if="actualAction === 0">
        <div class="authorisation__inputs">
          <label class="authorisation__label" for="auth-email">Email</label>
          <input
            class="authorisation__input"
            type="text"
            id="auth-email"
            placeholder="Введите ваш email"
            v-model="authorisationInfo.email"
          />
          <label class="authorisation__label" for="auth-pass">Пароль</label>
          <input
            class="authorisation__input"
            type="password"
            id="auth-pass"
            placeholder="Введите ваш пароль"
            v-model="authorisationInfo.password"
          />
        </div>
        <projectButton @click="sendInfo" :size="'medium'" :text="'Вход'" :color="'gray'" />
      </div>
      <div class="registration" v-if="actualAction === 1">
        <div class="registration__inputs">
          <label class="registration__label" for="reg-email">Email</label>
          <input
            class="registration__input"
            type="text"
            id="reg-email"
            v-model="registrationInfo.email"
          />
          <label class="registration__label" for="reg-name">Ваше имя</label>
          <input
            class="registration__input"
            type="text"
            id="reg-name"
            v-model="registrationInfo.name"
          />
          <label class="registration__label" for="reg-surname">Ваша фамилия</label>
          <input
            class="registration__input"
            type="text"
            id="reg-surname"
            v-model="registrationInfo.surname"
          />
          <label class="registration__label" for="reg-pass">Пароль</label>
          <input
            class="registration__input"
            type="password"
            id="reg-pass"
            v-model="registrationInfo.password"
          />
        </div>
        <projectButton :size="'medium'" :text="'Регистрация'" :color="'gray'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import projectButton from '@/components/project-button/project-button.vue'
import exitButton from '@/components/exit-button/exit-button.vue'
import { ref, toRefs, watch } from 'vue'

const modalAuthProps = defineProps({
  isOpened: Boolean
})

const { isOpened } = toRefs(modalAuthProps)

const actualAction = ref(0 as number)

const authorisationInfo = ref({
  email: '' as String,
  password: '' as String
})

const registrationInfo = ref({
  name: '' as String,
  surname: '' as String,
  email: '' as String,
  password: '' as String
})

// const isAuthEmpty = ref(true as Boolean)
// const isRegEmpty = ref(true as Boolean)

const authInfo = {
  email: 'admin' as string,
  password: 'admin' as string
}

const sendInfo = () => {
  if (
    authorisationInfo.value.email === authInfo.email &&
    authorisationInfo.value.password === authInfo.password
  ) {
    alert('Успех')
  }
}

// watch(
//   () => {
//     if (
//       (registrationInfo.value.email ||
//         registrationInfo.value.password ||
//         registrationInfo.value.name ||
//         registrationInfo.value.surname) === ''
//     ) {
//       return (isRegEmpty.value = true)
//     }
//     return (isRegEmpty.value = false)
//   },
//   () => {
//     if (authorisationInfo.value.email === '') {
//       return (isAuthEmpty.value = true)
//     }
//     return (isAuthEmpty.value = false)
//   }
// )
</script>

<style src="./modal-auth.css" scoped />
