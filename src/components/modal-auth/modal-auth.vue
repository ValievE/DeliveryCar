<template>
  <div v-if="isOpened" class="modal-zone" @click.self="modalAuthEmits('closeAuthModal')">
    <div class="modal-window">
      <modalUniversal
        v-if="successRegistration"
        :text="'Регистрация прошла успешно!'"
        :type="'success'"
        :timer="'3s'"
      />
      <exitButton @click="modalAuthEmits('closeAuthModal'), (actualAction = 'login')" />
      <div v-if="successSubmit" class="loading-icon"><loadingInfoIcon /></div>
      <div class="action">
        <p
          class="action__item"
          :class="{ action__item_inactive: actualAction === 'register' }"
          @click="actualAction = 'login'"
        >
          авторизация
        </p>
        <p class="action__item">|</p>
        <p
          class="action__item"
          :class="{ action__item_inactive: actualAction === 'login' }"
          @click="actualAction = 'register'"
        >
          регистрация
        </p>
      </div>
      <div v-if="actualAction === 'login'" class="authorisation">
        <form id="authorisation" class="authorisation__inputs" @submit.prevent="authUser">
          <div class="authorisation-item">
            <label class="authorisation__label" for="auth-email">E-mail</label>
            <input
              id="auth-email"
              v-model="authorisationInfo.email"
              class="authorisation__input"
              type="text"
              placeholder="Введите ваш e-mail"
            />
          </div>
          <div class="authorisation-item">
            <label class="authorisation__label" for="auth-pass">Пароль</label>
            <img
              v-if="authorisationInfo.password"
              class="show-password-btn"
              src="/img/icons/icon_eye.svg"
              alt=""
              @mouseup="
                !tabletMediaSize && !mobileMediaSize ? (authorisationInfo.type = 'password') : ''
              "
              @mousedown="
                !tabletMediaSize && !mobileMediaSize ? (authorisationInfo.type = 'text') : ''
              "
              @click="
                tabletMediaSize || mobileMediaSize
                  ? authorisationInfo.type !== 'password'
                    ? (authorisationInfo.type = 'password')
                    : (authorisationInfo.type = 'text')
                  : ''
              "
            />
            <input
              id="auth-pass"
              v-model="authorisationInfo.password"
              class="authorisation__input"
              :type="authorisationInfo.type"
              placeholder="Введите ваш пароль"
            />
          </div>
        </form>
        <span v-if="warningText" class="auth-warning">{{ warningText }}</span>
        <projectButton
          :type="'submit'"
          :form="'authorisation'"
          :size="'medium'"
          :text="'Вход'"
          :color="'gray'"
          :button-disabled="isInputsEmpty"
        />
      </div>
      <div v-if="actualAction === 'register'" class="registration">
        <form id="registration" class="registration__inputs" @submit.prevent="register">
          <div
            v-for="(registrationItem, index) in registrationItems"
            :key="index"
            class="registation-item"
            :class="{
              'registation-item_denied': registrationItem.input === 'email' && regErrors.email
            }"
          >
            <label class="registration__label" :for="registrationItem.id">{{
              registrationItem.label
            }}</label>
            <img
              v-if="
                registrationItem.input === 'password' &&
                registrationInfo[registrationItem.input as RegisterKeys]
              "
              class="show-password-btn"
              src="/img/icons/icon_eye.svg"
              alt=""
              @mouseup="registrationItem.type = 'password'"
              @mousedown="registrationItem.type = 'text'"
            />
            <p
              v-if="registrationItem.input === 'password' && regErrors.password"
              class="password-hint"
            >
              Пароль должен содержать не менее 6 символов
            </p>
            <input
              :id="registrationItem.id"
              v-model="registrationInfo[registrationItem.input as RegisterKeys]"
              class="registration__input"
              :type="registrationItem.type"
              :placeholder="registrationItem.placeholder"
            />
          </div>
        </form>
        <projectButton
          :type="'submit'"
          :form="'registration'"
          :size="'medium'"
          :text="'Регистрация'"
          :color="'gray'"
          :button-disabled="isInputsEmpty || regErrors.password"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import modalUniversal from '@/components/modal-universal/modal-universal.vue'
import projectButton from '@/components/project-button/project-button.vue'
import exitButton from '@/components/exit-button/exit-button.vue'
import { ref, toRefs, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import loadingInfoIcon from '@/components/loading-info-icon/loading-info-icon.vue'

type RegisterInfo = {
  name: string
  surname: string
  email: string
  password: string
}

type RegisterKeys = keyof RegisterInfo

const router = useRouter()

const modalAuthProps = defineProps({
  isOpened: Boolean,
  mobileMediaSize: Boolean,
  tabletMediaSize: Boolean
})

const modalAuthEmits = defineEmits(['closeAuthModal'])

const { isOpened, mobileMediaSize, tabletMediaSize } = toRefs(modalAuthProps)
const actualAction = ref<'login' | 'register'>('login')
const successSubmit = ref<boolean>(false)
const successRegistration = ref<boolean>(false)
const authorisationInfo = ref({
  email: '' as string,
  password: '' as string,
  type: 'password' as 'password' | 'text'
})

const regErrors = ref({
  password: false,
  email: false
})

supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    successSubmit.value = true
  }
  successSubmit.value = false
})

const authorisationError = ref<Boolean>(false)

const registrationInfo = ref({
  name: '' as String,
  surname: '' as String,
  email: '' as String,
  password: '' as String
})

const warningText = ref<string>('')

const registrationItems = ref([
  {
    id: 'reg-email',
    label: 'Email',
    placeholder: 'Введите Email',
    input: 'email',
    type: 'text'
  },
  {
    id: 'reg-name',
    label: 'Ваше Имя',
    placeholder: 'Введите Имя',
    input: 'name',
    type: 'text'
  },
  {
    id: 'reg-surname',
    label: 'Ваша Фамилия',
    placeholder: 'Введите Фамилию',
    input: 'surname',
    type: 'text'
  },
  {
    id: 'reg-pass',
    label: 'Пароль',
    placeholder: 'Введите пароль',
    input: 'password',
    type: 'password'
  }
])

const auth = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: authorisationInfo.value.email as string,
      password: authorisationInfo.value.password as string
    })

    if (!error) {
      modalAuthEmits('closeAuthModal')
      router.push({ name: 'cabinet' })
      authorisationInfo.value = {
        email: '',
        password: '',
        type: 'password'
      }
    }

    if (error?.message === 'Invalid login credentials') {
      successSubmit.value = false
      authorisationError.value = true
      warningText.value = 'Неправильный логин или пароль'
    }
  } catch (error) {
    console.error(error)
  }
}

const authUser = () => {
  successSubmit.value = true
  auth()
}

const upperCase = (arg: string) => {
  const newString = arg[0].toUpperCase() + arg.slice(1).toLocaleLowerCase()
  return newString
}

const register = async () => {
  try {
    const { error } = await supabase.auth.signUp({
      email: registrationInfo.value.email as string,
      password: registrationInfo.value.password as string,
      options: {
        data: {
          first_name: upperCase(registrationInfo.value.name as string),
          secnd_name: upperCase(registrationInfo.value.surname as string),
          tickets: []
        }
      }
    })

    if (error?.message === 'Unable to validate email address: invalid format') {
      regErrors.value.email = true
    }
    if (!error) {
      successRegistration.value = true
      setTimeout(() => {
        modalAuthEmits('closeAuthModal')
        router.push({ name: 'cabinet' })
        regErrors.value.email = false
        registrationInfo.value = {
          name: '',
          surname: '',
          email: '',
          password: ''
        }
        successRegistration.value = false
      }, 3000)
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => Object.values(authorisationInfo.value),
  () => {
    warningText.value = ''
    authorisationError.value = false
  }
)

watch(
  () => actualAction.value,
  () => {
    authorisationInfo.value = {
      email: '',
      password: '',
      type: 'password'
    }
  }
)

watch(
  () => registrationInfo.value.password,
  (newValue) => {
    if (newValue.length < 6 && newValue.length !== 0) {
      regErrors.value.password = true
      return regErrors.value.password
    }
    regErrors.value.password = false
    return regErrors.value.password
  }
)

watch(
  () => registrationInfo.value.name,
  () => {
    const reg = /[^a-zA-Zа-яА-ЯёЁ]/
    registrationInfo.value.name = registrationInfo.value.name.replace(reg, '')
    return registrationInfo.value.name
  }
)

watch(
  () => registrationInfo.value.surname,
  () => {
    const reg = /[^a-zA-Zа-яА-ЯёЁ]/
    registrationInfo.value.surname = registrationInfo.value.surname.replace(reg, '')
    return registrationInfo.value.surname
  }
)

const isInputsEmpty = computed(() => {
  let inputs
  if (actualAction.value === 'login') {
    inputs = authorisationInfo.value
  }

  if (actualAction.value === 'register') {
    inputs = registrationInfo.value
  }

  let emptyInputs = 0

  Object.values(inputs as object).forEach((item) => {
    if (!item) {
      emptyInputs += 1
    }
  })

  if (emptyInputs > 0) {
    return true
  }
  return false
})
</script>

<style src="./modal-auth.css" scoped />
