<template>
  <div v-if="isOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="modalAuthEmits('closeAuthModal')" />
      <div class="action">
        <p
          class="action__item"
          :class="{ action__item_inactive: actualAction === 1 }"
          @click="actualAction = 0"
        >
          авторизация
        </p>
        <p class="action__item">|</p>
        <p
          class="action__item"
          :class="{ action__item_inactive: actualAction === 0 }"
          @click="actualAction = 1"
        >
          регистрация
        </p>
      </div>
      <div v-if="actualAction === 0" class="authorisation">
        <div class="authorisation__inputs">
          <label class="authorisation__label" for="auth-email">Логин</label>
          <input
            id="auth-email"
            v-model="authorisationInfo.email"
            class="authorisation__input"
            type="text"
            title="Login: admin"
            placeholder="Введите ваш логин"
          />
          <label class="authorisation__label" for="auth-pass">Пароль</label>
          <input
            id="auth-pass"
            v-model="authorisationInfo.password"
            class="authorisation__input"
            type="password"
            title="Pass: admin"
            placeholder="Введите ваш пароль"
          />
        </div>
        <span v-if="warningText" class="auth-warning">{{ warningText }}</span>
        <projectButton
          :size="'medium'"
          :text="'Вход'"
          :color="'gray'"
          :button-disabled="isInputsEmpty"
          @click="auth"
        />
      </div>
      <div v-if="actualAction === 1" class="registration">
        <div class="registration__inputs">
          <label class="registration__label" for="reg-email">Email</label>
          <input
            id="reg-email"
            v-model="registrationInfo.email"
            class="registration__input"
            type="text"
            disabled
          />
          <label class="registration__label" for="reg-name">Ваше имя</label>
          <input
            id="reg-name"
            v-model="registrationInfo.name"
            class="registration__input"
            type="text"
            disabled
          />
          <label class="registration__label" for="reg-surname">Ваша фамилия</label>
          <input
            id="reg-surname"
            v-model="registrationInfo.surname"
            class="registration__input"
            type="text"
            disabled
          />
          <label class="registration__label" for="reg-pass">Пароль</label>
          <input
            id="reg-pass"
            v-model="registrationInfo.password"
            class="registration__input"
            type="password"
            disabled
          />
        </div>
        <projectButton
          :size="'medium'"
          :text="'Регистрация'"
          :color="'gray'"
          :button-disabled="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import projectButton from '@/components/project-button/project-button.vue'
import exitButton from '@/components/exit-button/exit-button.vue'
import { ref, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const modalAuthProps = defineProps({
  isLoggedIn: Boolean,
  isOpened: Boolean
})
const modalAuthEmits = defineEmits(['closeAuthModal', 'updatedName', 'isLoggedIn'])
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
const authInfo = {
  name: 'Emil Valiev' as string,
  email: 'ADMIN' as string,
  password: 'admin' as string
}
const currentUser = ref({
  email: '' as String,
  password: '' as String
})
const warningText = ref('' as string)
const auth = () => {
  if (!authorisationInfo.value.email) {
    warningText.value = 'Введите email'
  }

  if (!authorisationInfo.value.password) {
    warningText.value = 'Введите пароль'
  }

  if (
    !currentUser.value.email &&
    !currentUser.value.password &&
    authorisationInfo.value.email.toUpperCase() === authInfo.email &&
    authorisationInfo.value.password === authInfo.password
  ) {
    modalAuthEmits('closeAuthModal')
    modalAuthEmits('isLoggedIn', true)
    modalAuthEmits('updatedName', authInfo.name)
    currentUser.value.email = authorisationInfo.value.email
    currentUser.value.password = authorisationInfo.value.password
    router.push({ name: 'cabinet' })
    return currentUser
  }
  warningText.value = 'Такого пользователя нет'
  setTimeout(() => {
    warningText.value = ''
  }, 4000)
  return currentUser
}

const isInputsEmpty = computed(() => {
  if (
    !actualAction.value &&
    (!authorisationInfo.value.email || !authorisationInfo.value.password)
  ) {
    return true
  }
  return false
})
</script>

<style src="./modal-auth.css" scoped />
