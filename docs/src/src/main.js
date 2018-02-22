import Vue from 'vue/dist/vue.esm.js'
import App from './app.vue'
import VueRouter from 'vue-router'
import Page from './page.vue'
import './lib/diff.js'

/*
--------------------------------------------------------------------------
*/

const routes = [
  {path: '*/', redirect: './Introduction'},
  {path: '*/docs/', redirect: './docs/Introduction'},
  {path: '*/:page', component: Page}
]

const router = new VueRouter({
  routes,
  mode: 'history',
  history: true,
  linkActiveClass: 'uk-active'
})

Vue.use(VueRouter)

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
  data: () => ({
    page: false,
    loading: false
  })
})
