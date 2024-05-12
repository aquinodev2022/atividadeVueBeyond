import Vue from 'vue';
import VueRouter from 'vue-router';

import TelaLogin from '../pages/TelaLogin.vue';
import CalendarioPrincipal from '../pages/CalendarioPrincipal.vue'; 

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: TelaLogin
  },
  {
    path: '/Calendario',
    component: CalendarioPrincipal 
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
