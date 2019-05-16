import Vue from 'vue'
import App from './App.vue'
import VConsole from 'vconsole';

Vue.config.productionTip = false;

new VConsole();

new Vue({
  render: h => h(App),
}).$mount('#app')
