<template>
  <div v-if="isModalOpened" class="modal-zone">
    <div class="modal-window">
      <div v-if="isLoading" class="loading-icon">
        <loadingInfoIcon />
      </div>
      <modalUniversal
        v-if="isSuccessModalOpened"
        :type="'success'"
        :text="
          isModalOpened === 'email'
            ? `Заявка успешно создана. Подтвердите смену адреса электронный почты по ссылке из письма, отправленного на ${userData?.email}`
            : 'Пароль успешно сменён'
        "
        :timer="isModalOpened === 'email' ? '10s' : '3s'"
      />
      <exitButton @click="openChangeModal(null)" />
      <div class="change-modal">
        <h2 class="modal-title">
          {{ `Смена ${isModalOpened === 'email' ? 'E-mail' : 'пароля'}` }}
        </h2>
        <div class="actual-value-body">
          <img
            v-if="isModalOpened === 'password'"
            class="show-password-btn"
            src="/img/icons/icon_eye.svg"
            alt=""
            @mouseup="
              !tabletMediaSize && !mobileMediaSize ? (modalInputs.addit_type = 'password') : ''
            "
            @mousedown="
              !tabletMediaSize && !mobileMediaSize ? (modalInputs.addit_type = 'text') : ''
            "
            @click="
              tabletMediaSize || mobileMediaSize
                ? modalInputs.addit_type !== 'password'
                  ? (modalInputs.addit_type = 'password')
                  : (modalInputs.addit_type = 'text')
                : ''
            "
          />
          <label for="addit_value" class="actual-value-text">{{
            `${isModalOpened === 'email' ? 'Ваш текущий E-mail' : 'Введите новый пароль'}`
          }}</label>
          <input
            v-if="isModalOpened === 'password'"
            id="addit_value"
            v-model="modalInputs.addit"
            :style="{ paddingRight: '40px' }"
            :type="modalInputs.addit_type"
            class="new-value-input"
          />
          <input
            v-if="isModalOpened === 'email'"
            id="addit_value"
            type="text"
            class="new-value-input"
            disabled
            :value="userData?.email"
          />
        </div>
        <div class="new-value">
          <img
            v-if="isModalOpened === 'password'"
            class="show-password-btn"
            src="/img/icons/icon_eye.svg"
            alt=""
            @mouseup="
              !tabletMediaSize && !mobileMediaSize ? (modalInputs.main_type = 'password') : ''
            "
            @mousedown="
              !tabletMediaSize && !mobileMediaSize ? (modalInputs.main_type = 'text') : ''
            "
            @click="
              tabletMediaSize || mobileMediaSize
                ? modalInputs.main_type !== 'password'
                  ? (modalInputs.main_type = 'password')
                  : (modalInputs.main_type = 'text')
                : ''
            "
          />
          <label for="new_value" class="new-value-label">{{
            `${isModalOpened === 'email' ? 'Введите новый E-mail' : 'Подтвердите новый пароль'}`
          }}</label>
          <input
            id="new_value"
            v-model="modalInputs.main"
            :style="{ paddingRight: isModalOpened === 'password' ? '40px' : 0 }"
            :type="isModalOpened === 'email' ? 'text' : modalInputs.main_type"
            class="new-value-input"
            :disabled="isModalOpened === 'email' && isEmailCooldown"
          />
        </div>
      </div>
      <div
        v-if="
          (isModalOpened === 'email' && isEmailCooldown) ||
          (isModalOpened === 'password' && isPasswordCooldown)
        "
        class="new-request-warning"
      >
        <p class="new-request-warning-text">Новый запрос можно сделать через:</p>
        <p class="new-request-warning-timer">{{ `${timer} сек` }}</p>
      </div>
      <p v-if="errorText" class="new-request-error">{{ errorText }}</p>
      <projectButton
        :text="'Сохранить изменения'"
        :color="'orange'"
        :size="'medium'"
        :button-disabled="
          (isModalOpened === 'email' && isEmailCooldown) ||
          (isModalOpened === 'password' && isPasswordCooldown)
        "
        @click="save"
      />
    </div>
  </div>
  <h3 class="section__title">Настройки</h3>
  <div class="settings">
    <div v-if="isLoading" class="settings-loading-icon">
      <loadingInfoIcon />
    </div>
    <div v-for="(settingsItem, index) in settingsItems" :key="index" class="settings-item">
      <label :for="settingsItem.id" class="settings-item-label">{{ settingsItem.title }}</label>
      <input
        :id="settingsItem.id"
        v-model="settingsItem.input"
        type="text"
        class="settings-item-input"
        :disabled="isLoading"
      />
    </div>
    <div class="settings-button">
      <projectButton
        :text="'Сохранить изменения'"
        :size="'small'"
        :color="'orange'"
        @click="save"
      />
    </div>
  </div>
  <h6 class="section__title">Безопасность</h6>
  <div class="safety-settings">
    <projectButton
      v-for="(safetySettingsItem, index) in safetySettingsItems"
      :key="index"
      :text="safetySettingsItem.title"
      :size="'medium'"
      :color="'orange'"
      @click="openChangeModal(safetySettingsItem.id)"
    />
  </div>
</template>

<script setup lang="ts">
import modalUniversal from '@/components/modal-universal/modal-universal.vue'
import projectButton from '@/components/project-button/project-button.vue'
import exitButton from '@/components/exit-button/exit-button.vue'
import loadingInfoIcon from '@/components/loading-info-icon/loading-info-icon.vue'
import { onMounted, ref, toRefs } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { UserMetadata } from '@supabase/supabase-js'

type Change = 'password' | 'email'

const helpProps = defineProps({
  mobileMediaSize: Boolean,
  tabletMediaSize: Boolean
})

const { mobileMediaSize, tabletMediaSize } = toRefs(helpProps)

const isModalOpened = ref<Change | null>(null)

const timer = ref(60)
const isEmailCooldown = ref<boolean>(false)
const isPasswordCooldown = ref<boolean>(false)
const isSuccessModalOpened = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const errorText = ref<string>('')

const settingsItems = ref([
  {
    title: 'Имя',
    url: '',
    input: '',
    id: 'name'
  },
  {
    title: 'Фамилия',
    url: '',
    input: '',
    id: 'surname'
  }
])

const modalInputs = ref({
  main: '' as string,
  addit: '' as string,
  main_type: 'password' || 'text',
  addit_type: 'password' || 'text'
})

const userData = ref<UserMetadata>()

const getData = async () => {
  const newSession = await supabase.auth.getSession()
  userData.value = newSession.data.session?.user.user_metadata
  settingsItems.value[0].input = userData.value?.first_name
  settingsItems.value[1].input = userData.value?.secnd_name
  return userData
}

onMounted(() => {
  getData()
})

const safetySettingsItems = [
  {
    title: 'Сменить Email',
    url: '',
    input: '',
    id: 'email' as Change
  },
  {
    title: 'Сменить пароль',
    url: '',
    input: '',
    id: 'password' as Change
  }
]

const openChangeModal = (arg: Change | null) => {
  if (arg) {
    isModalOpened.value = arg
    document.body.style.overflowY = 'hidden'
    return isModalOpened.value
  }
  modalInputs.value.addit = ''
  modalInputs.value.main = ''
  isModalOpened.value = null
  document.body.style.overflowY = 'visible'
  return isModalOpened.value
}

const saveSafeChanges = async () => {
  try {
    let timerSuccessModal = 0
    if (isModalOpened.value === 'email') {
      await supabase.auth.updateUser({ email: modalInputs.value.main })
      timerSuccessModal = 10000
      isEmailCooldown.value = true
      setTimeout(() => {
        isEmailCooldown.value = false
      }, 60000)
    }

    if (isModalOpened.value === 'password') {
      const { error } = await supabase.auth.updateUser({ password: modalInputs.value.main })
      if (error?.message === 'New password should be different from the old password.') {
        isLoading.value = false
        errorText.value = 'Новый пароль должен отличаться от старого'
        return
      }
      timerSuccessModal = 4000
      isPasswordCooldown.value = true
      setTimeout(() => {
        isPasswordCooldown.value = false
      }, 60000)
    }
    isSuccessModalOpened.value = true
    isLoading.value = false
    setTimeout(() => {
      isSuccessModalOpened.value = false
    }, timerSuccessModal)
    timer.value = 60
    const timerInterval = setInterval(() => {
      timer.value -= 1
      return timer.value
    }, 1000)
    setTimeout(() => {
      clearInterval(timerInterval)
    }, 60000)
  } catch (error) {
    console.error(error)
  }
}

const saveSettingChanges = async () => {
  await supabase.auth.updateUser({
    data: {
      first_name: settingsItems.value[0].input,
      secnd_name: settingsItems.value[1].input
    }
  })
  isLoading.value = false
}

const save = () => {
  if (isModalOpened.value) {
    if (isModalOpened.value === 'email') {
      if (modalInputs.value.main === userData.value?.email) {
        errorText.value = 'Введите новый e-mail'
        return errorText.value
      }
    }

    if (isModalOpened.value === 'password') {
      if (modalInputs.value.main !== modalInputs.value.addit) {
        errorText.value = 'Пароли не совпадают'
        return errorText.value
      }
    }
    errorText.value = ''
    saveSafeChanges()
    isLoading.value = true
    return isLoading.value
  }
  saveSettingChanges()
  isLoading.value = true
  return isLoading.value
}
</script>

<style scoped src="./settings.css" />
