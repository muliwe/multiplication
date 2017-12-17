import Vue from 'vue'
import Router from 'vue-router'
import Multiplication from '@/pages/Multiplication'
import Addition from '@/pages/Addition'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Multiplication
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
    },
    {
      path: '/addition/',
      name: 'addition',
      component: Addition
    },
    {
      path: '/addition/:session',
      name: 'addition-session',
      component: Addition,
      props: true
    },
    {
      path: '/:session',
      name: 'home-session',
      component: Multiplication,
      props: true
    }
  ]
})
