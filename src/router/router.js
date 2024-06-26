import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store.js';

import TelaLogin from '../pages/TelaLogin.vue';
import RedefinirSenha from '../pages/RedefinirSenha.vue'
import CalendarioPrincipal from '../pages/CalendarioPrincipal.vue'; 
import PaginaNaoEncontrada from '../components/PaginaNaoEncontrada.vue'


Vue.use(VueRouter);

// Guarda de autenticação para verificar se o usuário está autenticado antes de acessar rotas protegidas
const authGuard = async (to, from, next) => { // Verifica a autenticação antes de cada navegação
  await store.dispatch('checkAuth'); // Checa a autenticação antes de cada navegação
  if (!store.getters.isAuthenticated) { // Obtém o estado de autenticação
    next('/login'); // Redireciona para a página de login se o usuário não estiver autenticado
  } else {
    next(); // Permite a navegação para a rota desejada se o usuário estiver autenticado.
  }
};


const routes = [
 {
    path: '/', // rota raiz 
    redirect: '/login' 
  }, 
  
  {
    path: '/login',
    component: TelaLogin
  },
  
 {
  path: "/RedefinirSenha",
  component: RedefinirSenha,
 },

  {
    path: '/Calendario',
    component: CalendarioPrincipal,
    beforeEnter: authGuard // Adiciona a guarda de rota para verificar a autenticação
  },

  {
    path: '*', // Rota para lidar com URLs não encontradas
    component: PaginaNaoEncontrada
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
