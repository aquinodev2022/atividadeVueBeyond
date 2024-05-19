import Vue from 'vue';
import Vuex from 'vuex';

// funções relacionadas à autenticação do Firebase
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Usando Vuex para gerenciamento de estado
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null, // Estado para armazenar informações do usuário autenticado
    loading: false, // Estado para controlar o status de carregamento
    error: null // Estado para armazenar mensagens de erro
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    // registra um novo usuário
    async register({ commit }, { email, password }) {
      const auth = getAuth();
      commit('setLoading', true);
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        commit('setUser', user);
        commit('setError', null);
      } catch (error) {
        commit('setError', error.message);
      } finally {
        commit('setLoading', false);
      }
    },

    // login de usuário
    async login({ commit }, { email, password }) {
      const auth = getAuth();
      commit('setLoading', true);
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        commit('setUser', user);
        commit('setError', null);
      } catch (error) {
        commit('setError', error.message);
      } finally {
        commit('setLoading', false);
      }
    },

    async logout({ commit }) {
      const auth = getAuth();
      await signOut(auth);
      commit('setUser', null);
    },

    // verifica se o usuário está autenticado
    async checkAuth({ commit }) {
      const auth = getAuth();
      commit('setLoading', true);
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          commit('setUser', user);
          commit('setLoading', false);
          resolve(); // Resolve a Promise após a verificação do estado de autenticação
        });
      });
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user, // verifica se o usuário está autenticado
    getUser: (state) => state.user, // informações do usuário
    isLoading: (state) => state.loading, // status de carregamento
    getError: (state) => state.error //  mensagens de erro
  }
});