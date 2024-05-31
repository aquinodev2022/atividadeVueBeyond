import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfiguracoes = {
  apiKey: "AIzaSyA0JtqLanq7L0xolbGHcyY7tFeq2-nRe7A",
  authDomain: "beyond-vue.firebaseapp.com",
  projectId: "beyond-vue",
  storageBucket: "beyond-vue.appspot.com",
  messagingSenderId: "1063601450053",
  appId: "1:1063601450053:web:3fe7ca65897e4beea7072c",
  measurementId: "G-4XJZJW0MCS"
};

const app = initializeApp(firebaseConfiguracoes);
const db = getFirestore(app);

export { db };

export const auth = getAuth();
