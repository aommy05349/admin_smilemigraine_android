import Vue from 'vue'
import App from './App.vue'
import '@/firebase/init'
import router from './router'
import store from './vuex'
import moment from 'moment'
import { createInstance } from '@/api/instance'

//3rd party components
import VueTextareaAutosize from 'vue-textarea-autosize'
import VuePaginate from 'vuejs-paginate'
import infiniteScroll from 'vue-infinite-scroll'


import shareIt from 'vue-share-it'
Vue.use(shareIt);


Vue.use(VueTextareaAutosize)
Vue.use(infiniteScroll)
Vue.component('paginate', VuePaginate)

Vue.config.productionTip = false

moment.locale('th')
createInstance({ store, router })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
