import Vue from 'vue';
import Vuex from 'vuex';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    error: null
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
    // Ação checkAuth ajustada para retornar uma Promise
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
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});
