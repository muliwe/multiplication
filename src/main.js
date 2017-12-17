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
      currentApp: '', // empty is for multiplication app for consistency
      currentLevel: 0,
      stats: [].fill.call({length: 10}, 0)
    }
  },
  watch: {
    currentApp: function (val) {
      const self = this

      reload(self)
    },
    currentLevel: function (val) {
      this.$ls.set(this.currentApp + 'currentLevel', val)
    },
    stats: function (val) {
      const values = []

      for (let i = 0; i < 10; i++) {
        values.push(val[i] || 0)
      }

      this.$ls.set(this.currentApp + 'stats', values.join(','))
    }
  },
  created: function () {
    const self = this

    reload(self)
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
      return {
        currentApp: this.currentApp,
        currentLevel: this.currentLevel,
        stats: this.stats
      }
    }
  }
})

function reload (vm) {
  vm.currentLevel = Number(vm.$ls.get(vm.currentApp + 'currentLevel', 0)) // 0 is default value

  const stats = vm.$ls.get(vm.currentApp + 'stats', '0,0,0,0,0,0,0,0,0,0').split(',')
  for (let i = 0; i < 10; i++) {
    vm.stats[i] = stats[i]
  }
}
