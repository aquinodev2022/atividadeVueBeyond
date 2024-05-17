import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store.js';
import TelaLogin from '../pages/TelaLogin.vue';
import CalendarioPrincipal from '../pages/CalendarioPrincipal.vue'; 
import PaginaNaoEncontrada from '../components/PaginaNaoEncontrada.vue'

Vue.use(VueRouter);

const authGuard = async (to, from, next) => {
  await store.dispatch('checkAuth'); // Checa a autenticação antes de cada navegação
  if (!store.getters.isAuthenticated) {
    next('/');
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    redirect: '/login' // Redireciona '/' para '/login'
  },
  
  {
    path: '/login',
    component: TelaLogin
  },
  
  {
    path: '/Calendario',
    component: CalendarioPrincipal,
    beforeEnter: authGuard // Adiciona o guarda de rota
  },

  {
    path: '*',
    component: PaginaNaoEncontrada
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
