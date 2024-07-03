<template>
  <div v-if="createTicketModalOpened" class="modal-zone">
    <div class="modal-window">
      <exitButton @click="openTicketModal(false)" />
      <h5 class="new-ticket-title">Новое обращение</h5>
      <form class="new-ticket-form">
        <div class="new-ticket__item">
          <label for="new_ticket_type" class="new-ticket-label">Тип обращения:</label>
          <select id="new_ticket_type" v-model="newTicketInfo.type" class="new-ticket-select">
            <option value="Вопрос">Вопрос</option>
            <option value="Жалоба">Жалоба</option>
          </select>
        </div>
        <div class="new-ticket__item">
          <label for="new_ticket_text" class="new-ticket-label">Текст обращения:</label>
          <textarea
            id="new_ticket_text"
            v-model="newTicketInfo.text"
            class="new-ticket-text"
          ></textarea>
        </div>
      </form>
      <div v-if="ticketLoading" class="ticket-loading"><loadingInfoIcon /></div>
      <projectButton
        :text="'Создать обращение'"
        :color="'orange'"
        :size="'medium'"
        :button-disabled="isTextAreaEmpty"
        @click="tryCreate"
      />
    </div>
  </div>
  <h3 class="section__title">Техническая поддержка</h3>
  <div class="tickets">
    <div class="tickets-header">
      <h6 class="tickets-header-title">Ваши обращения</h6>
      <projectButton
        :text="'Создать обращение'"
        :color="'orange'"
        :size="'medium'"
        @click="openTicketModal(true)"
      />
    </div>
    <div v-if="!session?.data.session?.user.user_metadata" class="ticket loader"></div>

    <div v-for="(ticket, index) in userTickets" :key="index" class="ticket">
      <div class="ticket-info">
        <p class="ticket-date">{{ `Дата обращения: ${parseTime(ticket.create_date)}` }}</p>
        <p class="ticket-type">{{ `Тип обращения: ${ticket.type}` }}</p>
        <P
          class="ticket-status"
          :style="{
            backgroundColor: setColor(ticket.answer)
          }"
          >{{ ticket.answer ? 'Получен ответ' : 'Рассмотрение' }}</P
        >
        <p v-if="ticket.answer_data" class="ticket-answer-date">
          {{ `Дата ответа: ${parseTime(ticket.answer_data)}` }}
        </p>
      </div>
      <div class="ticket-separator"></div>
      <div class="ticket-texts">
        <p class="ticket-text">{{ ticket.question }}</p>
        <div v-if="ticket.answer" class="ticket-text-separator"></div>
        <p v-if="ticket.answer" class="ticket-answer">Ответ тех. поддержки</p>
        <p v-if="ticket.answer" class="ticket-text">
          {{ ticket.answer }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import projectButton from '@/components/project-button/project-button.vue'
import loadingInfoIcon from '@/components/loading-info-icon/loading-info-icon.vue'
import { AuthError, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { computed, onMounted, ref, watch } from 'vue'

type SuccessData = {
  session: Session
}

type DeniedData = {
  session: null
}

type SObject =
  | {
      data: SuccessData
      error: null
    }
  | {
      data: DeniedData
      error: AuthError
    }
  | {
      data: DeniedData
      error: null
    }

type Ticket = {
  id?: number
  create_date: number
  type: 'Вопрос' | 'Жалоба'
  question: string
  answer_data: number | null
  answer: string | null
}

type NewTicket = {
  type: 'Вопрос' | 'Жалоба'
  text: string
  date: number
}

const session = ref<SObject>()

const ticketIDs = ref<number[]>()
const userTickets = ref<Ticket[]>([])
const ticketLoading = ref<boolean>(false)

const createTicketModalOpened = ref<boolean>(false)

const newTicketInfo = ref<NewTicket>({
  type: 'Вопрос',
  text: '',
  date: 0
})

async function getTickets() {
  userTickets.value = []
  ticketIDs.value?.forEach(async (ticketID) => {
    const ticket = await supabase.from('tickets').select().eq('id', ticketID)
    userTickets.value?.push(ticket.data?.[0] as Ticket)
  })
}

async function getSession() {
  session.value = await supabase.auth.getSession()
  ticketIDs.value = session.value?.data.session?.user.user_metadata.tickets
  getTickets()
}

getSession()

const isTextAreaEmpty = computed(() => {
  if (!newTicketInfo.value.text) {
    return true
  }
  return false
})

const setColor = (arg?: string | null) => {
  if (arg) {
    return 'rgb(139, 231, 53)'
  }
  if (!arg) {
    return '#ff9900'
  }
  return 'gray'
}

const openTicketModal = (arg: boolean) => {
  if (arg) {
    createTicketModalOpened.value = true
    document.body.style.overflowY = 'hidden'
    return createTicketModalOpened.value
  }
  createTicketModalOpened.value = false
  document.body.style.overflowY = 'visible'
  return createTicketModalOpened.value
}

const parseTime = (arg: number) => {
  const newDate = new Date(arg)
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  } as const
  return newDate.toLocaleString('ru', options)
}

const createTicket = async () => {
  const newTicket: Ticket = {
    answer: null,
    create_date: Date.now(),
    question: newTicketInfo.value.text,
    type: newTicketInfo.value.type,
    answer_data: null
  }

  const { data } = await supabase.from('tickets').insert([newTicket]).select()
  const newTicketIDs = ref<number[]>([])

  if (ticketIDs.value) {
    newTicketIDs.value = ticketIDs.value.map((x) => x)
  }
  newTicketIDs.value.push(data?.[0].id)
  ticketIDs.value = newTicketIDs.value
  await supabase.auth.updateUser({
    data: {
      tickets: newTicketIDs.value
    }
  })
  ticketLoading.value = false
  openTicketModal(false)
}

const tryCreate = () => {
  ticketLoading.value = true
  createTicket()
}
</script>

<style scoped src="./help.css" />
