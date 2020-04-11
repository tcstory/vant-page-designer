import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ide',
    name: 'IDE',
    component: () => import(/* webpackChunkName: "ide" */ '../views/Ide.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
