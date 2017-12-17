import Vuex from 'vuex'
import Vue from 'vue'
import generateTask from './generate-task'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    generateTask
  }
})
