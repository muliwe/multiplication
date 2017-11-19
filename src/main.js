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
  template: '<App :increment-level="incrementLevel" :current-data="currentData" :set-data="setData" />',
  components: { App },
  data: function () {
    return {
      currentLevel: 0,
      stats: [].fill.call({length: 10}, 0)
    }
  },
  watch: {
    currentLevel: function (val) {
      this.$ls.set('currentLevel', val)
    },
    stats: function (val) {
      const values = []

      for (let i = 0; i < 10; i++) {
        values.push(val[i] || 0)
      }

      this.$ls.set('stats', values.join(','))
    }
  },
  created: function () {
    const self = this

    self.currentLevel = Number(self.$ls.get('currentLevel', 0)) // 0 is default value

    const stats = self.$ls.get('stats', '0,0,0,0,0,0,0,0,0,0').split(',')
    for (let i = 0; i < 10; i++) {
      self.stats[i] = stats[i]
    }
  },
  methods: {
    incrementLevel: function () {
      this.currentLevel++
    },
    setData: function (data) {
      const self = this

      Object.keys(data).forEach(key => {
        self[key] = data[key]
      })
    },
    currentData: function () {
      const self = this

      return {
        currentLevel: self.currentLevel,
        stats: self.stats
      }
    }
  }
})
