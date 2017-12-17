import Vue from 'vue'
import Router from 'vue-router'
import Multiplication from '@/pages/Multiplication'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Multiplication
    },
    {
      path: '/:session',
      name: 'home-session',
      component: Multiplication,
      props: true
    },
    {
      path: '/multiplication/',
      name: 'multiplication',
      component: Multiplication
    },
    {
      path: '/multiplication/:session',
      name: 'multiplication-session',
      component: Multiplication,
      props: true
    }
  ]
})
