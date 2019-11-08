import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home/Home.vue'
import Client from '../components/client/Client.vue'
import Register from '../components/account/Register.vue'
import Login from '../components/account/Login.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/client',
      name: 'Client',
      component: Client,
    },
    {
      path: '/account/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/account/login',
      name: 'Login',
      component: Login
    }
  ],
})
