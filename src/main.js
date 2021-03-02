import Vue from 'vue'
import App from './App.vue'
import NwImg from 'nw-img-vue';
require('./scss/main.scss');

Vue.config.productionTip = false
Vue.use(NwImg);

new Vue({
  render: h => h(App),
}).$mount('#app')
