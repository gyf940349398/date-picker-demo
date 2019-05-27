<template>
  <div id="app">
    <DatePicker
      :startDate="new Date('2015/01/01 08:00:00')"
      :endDate="new Date('2022/12/31 08:00:00')"
      :dateItemWidth="62"
      :isDecrease="true"
      @dateChange="dateChange" />
  </div>
</template>

<script>
import DatePicker from './components/DatePicker.vue'

export default {
  name: 'app',
  methods: {
    dateChange (date) {
      console.log(JSON.stringify(date));
    }
  },
  components: {
    DatePicker
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
