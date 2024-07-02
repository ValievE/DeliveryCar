<template>
  <div v-if="isOpened" class="modal-zone">
    <!-- <div v-if="isOpened" class="modal-zone">
      <div class="modal-window">
        <exitButton @click="modalAuthEmits('closeAuthModal')" />
      </div>
    </div> -->
    <div class="modal-window">
      <exitButton @click="modalAuthEmits('closeAuthModal')" />
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
          <label class="authorisation__label" for="auth-email">E-mail</label>
          <input
            id="auth-email"
            v-model="authorisationInfo.email"
            class="authorisation__input"
            type="text"
            placeholder="Введите ваш e-mail"
          />
          <label class="authorisation__label" for="auth-pass">Пароль</label>
          <input
            id="auth-pass"
            v-model="authorisationInfo.password"
            class="authorisation__input"
            type="password"
            placeholder="Введите ваш пароль"
          />
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
          >
            <label class="registration__label" :for="registrationItem.id">{{
              registrationItem.label
            }}</label>
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
          :button-disabled="isInputsEmpty"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import projectButton from '@/components/project-button/project-button.vue'
import exitButton from '@/components/exit-button/exit-button.vue'
import { ref, toRefs, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import loadingInfoIcon from '@/components/loading-info-icon/loading-info-icon.vue'
import { Session } from '@supabase/supabase-js'

type RegisterInfo = {
  name: string
  surname: string
  email: string
  password: string
}

type RegisterKeys = keyof RegisterInfo

const router = useRouter()

const modalAuthProps = defineProps({
  isLoggedIn: Boolean,
  isOpened: Boolean
})

const modalAuthEmits = defineEmits(['closeAuthModal'])

const { isOpened } = toRefs(modalAuthProps)
const actualAction = ref<'login' | 'register'>('login')
const successSubmit = ref<boolean>(false)
const authorisationInfo = ref({
  email: '' as string,
  password: '' as string
})

const sessionInfo = ref<Session | null>()

// async function getSession() {
//   sessionInfo.value = (await supabase.auth.getSession()).data.session
//   return sessionInfo.value
// }

// getSession()

supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    successSubmit.value = true
  }
  successSubmit.value = false
})

// const sessionInfo = computed(() => {
//   const info = await getSession()

//   if (info) {
//     return true
//   }
//   return false
// })

const authorisationError = ref<Boolean>(false)

const registrationInfo = ref({
  name: '' as String,
  surname: '' as String,
  email: '' as String,
  password: '' as String
})

const warningText = ref<string>('')

const registrationItems = [
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
]

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
        password: ''
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

const register = async () => {
  try {
    const { error } = await supabase.auth.signUp({
      email: registrationInfo.value.email as string,
      password: registrationInfo.value.password as string,
      options: {
        data: {
          first_name: registrationInfo.value.name,
          secnd_name: registrationInfo.value.surname
        }
      }
    })
    console.error(error)
    if (!error) {
      alert('Успешно')
      registrationInfo.value = {
        name: '',
        surname: '',
        email: '',
        password: ''
      }
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
      password: ''
    }
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
