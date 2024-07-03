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
      <projectButton
        :text="'Создать обращение'"
        :color="'orange'"
        :size="'medium'"
        :button-disabled="isTextAreaEmpty"
        @click="createTicket"
      />
    </div>
  </div>
  <h3 class="section__title">Техническая поддержка</h3>
  <div class="tickets">
    <div class="tickets-header">
      <h6>Ваши обращения</h6>
      <projectButton
        :text="'Создать обращение'"
        :color="'orange'"
        :size="'medium'"
        @click="openTicketModal(true)"
      />
    </div>
    <div v-for="(ticket, index) in tickets" :key="index" class="ticket">
      <div class="ticket-info">
        <p class="ticket-date">{{ `Дата обращения: ${ticket.create_data}` }}</p>
        <p class="ticket-type">{{ `Тип обращения: ${ticket.type}` }}</p>
        <P
          class="ticket-status"
          :style="{
            backgroundColor: setColor(ticket.status)
          }"
          >{{ ticket.status }}</P
        >
        <p v-if="ticket.answer_data" class="ticket-date">
          {{ `Дата ответа: ${ticket.answer_data}` }}
        </p>
      </div>
      <div class="ticket-separator"></div>
      <div class="ticket-texts">
        <p class="ticket-text">{{ ticket.question_text }}</p>
        <div v-if="ticket.answer_text" class="ticket-text-separator"></div>
        <p v-if="ticket.answer_text" class="ticket-answer">Ответ тех. поддержки</p>
        <p v-if="ticket.answer_text" class="ticket-text">
          {{ ticket.answer_text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import exitButton from '@/components/exit-button/exit-button.vue'
import projectButton from '@/components/project-button/project-button.vue'
import { computed, ref } from 'vue'

type Ticket = {
  type: 'Жалоба' | 'Вопрос'
  ticket_id: number
  create_data: number
  answer_data?: number
  question_text: string
  answer_text?: string
  status: 'Рассмотрение' | 'Получен ответ'
}

type NewTicket = {
  type: 'Вопрос' | 'Жалоба'
  text: string
  date: number
}

const createTicketModalOpened = ref<boolean>(false)

const newTicketInfo = ref<NewTicket>({
  type: 'Вопрос',
  text: '',
  date: 0
})

const isTextAreaEmpty = computed(() => {
  if (!newTicketInfo.value.text) {
    return true
  }
  return false
})

const tickets = ref<Ticket[]>([
  {
    ticket_id: 1,
    create_data: 3141412,
    question_text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dolor diam, iaculis sit amet mauris eu, feugiat dictum turpis. Etiam risus sapien, venenatis in lobortis commodo, elementum ac eros. Ut in ornare nunc, vel mattis erat. Nunc sit amet luctus elit. Vivamus a sagittis neque, quis tristique metus. Nullam at ullamcorper eros. Nulla est ipsum, viverra in erat vel, pharetra pretium tortor. Cras placerat dictum tincidunt. Sed feugiat pulvinar nulla, a rhoncus mi dictum ut. Aenean iaculis tempus sagittis. Integer gravida ex magna, ac egestas sapien ultricies interdum. Aliquam suscipit tortor lectus. Donec a lacus non dui placerat finibus.',
    status: 'Рассмотрение',
    type: 'Вопрос'
  },
  {
    ticket_id: 2,
    create_data: 3141412,
    question_text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dolor diam, iaculis sit amet mauris eu, feugiat dictum turpis. Etiam risus sapien, venenatis in lobortis commodo, elementum ac eros. Ut in ornare nunc, vel mattis erat. Nunc sit amet luctus elit. Vivamus a sagittis neque, quis tristique metus. Nullam at ullamcorper eros. Nulla est ipsum, viverra in erat vel, pharetra pretium tortor. Cras placerat dictum tincidunt. Sed feugiat pulvinar nulla, a rhoncus mi dictum ut. Aenean iaculis tempus sagittis. Integer gravida ex magna, ac egestas sapien ultricies interdum. Aliquam suscipit tortor lectus. Donec a lacus non dui placerat finibus.',
    status: 'Получен ответ',
    answer_data: 41242141,
    answer_text:
      'Vestibulum lacinia faucibus ex, sed dictum nisi lacinia nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut pulvinar vehicula ex eu rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla scelerisque varius felis, sed elementum est ultrices vel. Praesent pellentesque dui eget urna blandit, eu tristique urna hendrerit. Curabitur sit amet odio efficitur, blandit massa id, vulputate lorem.',
    type: 'Жалоба'
  }
])

const setColor = (arg: 'Рассмотрение' | 'Получен ответ') => {
  if (arg === 'Получен ответ') {
    return 'rgb(139, 231, 53)'
  }
  if (arg === 'Рассмотрение') {
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

const createTicket = () => {
  newTicketInfo.value.date = Date.now()
  const newTicket: Ticket = {
    ticket_id: tickets.value[tickets.value.length - 1].ticket_id + 1,
    create_data: newTicketInfo.value.date,
    question_text: newTicketInfo.value.text,
    status: 'Рассмотрение',
    answer_data: 0,
    answer_text: '',
    type: newTicketInfo.value.type
  }

  tickets.value.push(newTicket)
  console.log(newTicketInfo.value)
}
</script>

<style scoped src="./help.css" />
