<template>
  <section class="delivery">
    <img class="delivery-bg" src="/img/bg_evacuator.png" alt="" />
    <h1 class="delivery-title">Доставка</h1>
    <div class="delivery-overflow">
      <div class="delivery-stages">
        <div v-for="(stage, index) in deliveryStages" :key="index" class="delivery-stage">
          <span class="delivery-stage-number">{{ index + 1 }}</span>
          <p class="delivery-stage-title">{{ stage.title }}</p>
          <p class="delivery-stage-text">{{ stage.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const deliveryStages = [
  {
    title: 'Выбор автомобиля' as string,
    text: 'Всё начинается с выбора автомобиля. У нас вы сможете выбрать от самых новых автомобилей до наиболее свежих поддержанных автомобилей. Кстати, автомобили мы тщательно проверяем и предоставляем отчет.' as string
  },
  {
    title: 'Конфигурация' as string,
    text: 'На данном этапе вы можете дооснастить автомобиль дополнительными деталями и функциями.' as string
  },
  {
    title: 'Оформление заказа' as string,
    text: 'Наступает, наверное, самый "неинтересный" процесс, надо будет прочитать и подписать две бумаги. Договор у нас типовой и в открытом доступе, так что вы сможете заранее его изучить. Оплата происходит онлайн или в нашем физическом офисе.' as string
  },
  {
    title: 'Доставка' as string,
    text: 'Поистине самый долгий процесс в нашей работе. В зависимости от наличия автомобиля и вашего местоположения, вы его получите в промежутке от нескольких дней до месяца. Автомобиль вам привезут на автовозе прямо к дому.' as string
  },
  {
    title: 'Завершение заказа' as string,
    text: 'Ваш автомобиль стоит у дома с полным пакетом документов, но вам обязательно надо лично убедиться в целостности и сохранности автомобиля и подписать акт приема и передачи. Теперь вы можете полноценно наслаждаться за рулем вашего автомобиля. Удачи на дорогах!' as string
  }
]
</script>

<style src="./deliveryPage.css" scoped />
