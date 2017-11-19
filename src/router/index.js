import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/:session',
      name: 'session',
      component: HomePage,
      props: true
    }
  ]
})
