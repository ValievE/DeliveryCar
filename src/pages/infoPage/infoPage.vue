<template>
  <section v-if="parameter === 'partnership'" class="info-section">
    <h1 class="info-section__title">ПАРТНЕРСКАЯ ПРОГРАММА</h1>
    <p class="info-section__subtitle">Получай комиссию до 15% с наших продаж</p>
    <div class="partnership-block">
      <div v-for="(text, index) in partnership.texts" :key="index" class="partnership-block__item">
        <p class="partnership-title">{{ index + 1 }}</p>
        <p class="partnership-text">{{ text }}</p>
      </div>
    </div>
    <div class="partnership-questions">
      <div
        v-for="(question, index) in partnership.questions"
        :key="index"
        class="partnership-question__body"
        @click="activeCard = activeCard === index ? NaN : index"
      >
        <p class="partnership-question">{{ question.question }}</p>
        <p v-if="activeCard === index" class="partnership-answer">{{ question.answer }}</p>
      </div>
    </div>
  </section>
  <section v-if="parameter === 'personal'" class="info-section">
    <img class="error-img" src="/img/empty_garage.svg" alt="Страницы не существует" />
  </section>
  <section v-if="parameter === 'confidentiality'" class="info-section">
    <img class="error-img" src="/img/empty_garage.svg" alt="Страницы не существует" />
  </section>
  <section v-if="parameter === 'vacanсies'" class="info-section">
    <h1 class="info-section__title">Вакансии</h1>
    <div class="vacancies">
      <div v-for="(vacancy, index) in vacancies" :key="index" class="vacancy">
        <div class="vacancy-header">
          <p class="vacancy-title">{{ vacancy.title }}</p>
          <p class="vacancy-payday">{{ `З/П от ${vacancy.payday} руб.` }}</p>
        </div>
        <p>
          {{
            `Опыт работы в сфере: ${vacancy.exp === 0 ? 'не требуется' : `от ${vacancy.exp} года/лет`}`
          }}
        </p>
        <div class="responsibilities">
          <p class="responsibility-title">Обязанности:</p>
          <p
            v-for="(responsibility, responsibilityIndex) in vacancy.responsibilities"
            :key="responsibilityIndex"
            class="responsibility"
          >
            {{ `• ${responsibility}` }}
          </p>
        </div>
        <div class="requirements">
          <p class="requirement-title">Требования:</p>
          <p
            v-for="(requirement, requirementIndex) in vacancy.requirements"
            :key="requirementIndex"
            class="requirement"
          >
            {{ `• ${requirement}` }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const parameter = ref(route.params.section)
const activeCard = ref(NaN as number)
const partnership = {
  texts: [
    'Зарегистрируйтесь в партнерской программе',
    'Находите и привозите к нам на реализацию ваши автомобили',
    'Покупатель покупает партнерский автомобиль',
    'Автомобиль полностью передается новому владельцу',
    'Вы получаете комиссию с каждого проданного автомобиля'
  ],
  questions: [
    {
      question: 'Как получить партнерский доступ?',
      answer:
        'Зарегистрируйтесь в партнерской программе: 1) Откройте личный кабинет; 2) Заполните необходимую форму, расположенную в настройках. Просим заметить, что доступ одноразовый, при утрате или блокировке партнерство завершается.'
    },
    {
      question: 'Как производятся выплаты партнерам?',
      answer: 'Выплаты производятся с 1 по 5 число каждого месяца. Выплаты производятся по счету.'
    },
    {
      question: 'Какая минимальная выплата партнерам?',
      answer:
        'Минимальная выплата партнерам – 30.000 рублей в зависимости от стоимости автомобиля и уровня партнерства'
    },
    {
      question: 'Какие существуют уровни партнерства?',
      answer:
        'Партнерство делится на 4 уровня: 1) Начальный - процент от продаж 4% ; 2) Базовый - процент от продаж 8%; 3) Продвинутый - процент от продаж 10%, персональная скидка 2%. ; 4) Про - процент от продаж 15%, персональная скидка 5%.'
    }
  ]
}
const vacancies = [
  {
    title: 'Онлайн-менеджер',
    responsibilities: [
      'Продажа автомобилей',
      'Выполнение личного плана продаж',
      'Работа с входящим потоком клиентов',
      'Консультация в автосалоне, помощь клиенту при выборе автомобиля',
      'Полный контроль подготовки автомобилей к продаже',
      'Сопровождение клиентов на всех этапах сделки'
    ],
    requirements: [
      'Применение на практике этапов продаж',
      'Желание ежемесячно наращивать обороты, достигать более высоких показателей',
      'Коммуникабельность, ответственность, навыки презентации, умение убеждать, стремление к саморазвитию, активный и инициативный подход к работе',
      'Увлеченность автомобильной тематикой (понимание устройства автомобиля)'
    ],
    exp: 1,
    payday: 95000
  },
  {
    title: 'Водитель автовоза/Механик',
    responsibilities: [
      'прием автомобилей с автовоза, сопровождение автомобилей до выдачи',
      'перемещение / перегон автомобиля по площадке',
      'поддержание автомобиля в надлежащем товарном состоянии',
      'выполнение прочих поручений руководителя в рамках своего функционала'
    ],
    requirements: [
      'желание работать и развиваться в автомобильной сфере',
      'исполнительность, организованность, ответственность',
      'без вредных привычек',
      'Владение ПК на уровне уверенного пользователя'
    ],
    exp: 0,
    payday: 70000
  }
]

watch(
  () => route.params.section,
  (newSection) => {
    parameter.value = newSection
  }
)
</script>

<style src="./infoPage.css" scoped />
