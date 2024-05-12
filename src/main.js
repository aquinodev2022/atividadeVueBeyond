
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/router.js";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfiguracoes = {
  apiKey: "AIzaSyA0JtqLanq7L0xolbGHcyY7tFeq2-nRe7A",
  authDomain: "beyond-vue.firebaseapp.com",
  projectId: "beyond-vue",
  storageBucket: "beyond-vue.appspot.com",
  messagingSenderId: "1063601450053",
  appId: "1:1063601450053:web:3fe7ca65897e4beea7072c",
  measurementId: "G-4XJZJW0MCS"
};

initializeApp(firebaseConfiguracoes);

export const auth = getAuth();

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");