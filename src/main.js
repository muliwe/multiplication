// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import VueLocalStorage from 'vue-localstorage'
import App from './App'
import router from './router'
import store from './store/index'

sync(store, router)

Vue.config.productionTip = false

Vue.use(VueLocalStorage, {
  name: 'ls',
  createComputed: true // created computed members from your variable declarations
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App :increment-level="incrementLevel" :current-level="currentLevel" />',
  components: { App },
  data: function () {
    return {
      currentLevel: 0
    }
  },
  watch: {
    currentLevel: function (val) {
      this.$ls.set('currentLevel', val)
    }
  },
  created: function () {
    const self = this

    self.currentLevel = Number(self.$ls.get('currentLevel', 0)) // 0 is default value
  },
  methods: {
    incrementLevel: function () {
      this.currentLevel++
    }
  }
})
