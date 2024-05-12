<template>
  <v-container fluid fill-height style="background-image: linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%);">
    <v-row align="center" justify="center">
      <v-col md="5">
        <img src="@/assets/telaLogin.png" alt="Imagem de fundo" class="imagem-fundo">
      </v-col>
      
      <v-col md="4" > 
        <v-card class="elevation-8 cardLogin"> 
          <v-toolbar dark color="primary">
            <h1 class="flex-grow-1 text-center white--text">LOGIN</h1>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
              <v-text-field v-model="password" label="Senha" type="password" required></v-text-field>
              
              <div style="display: flex; justify-content: center; margin-top: 20px;">
                <v-btn color="primary" type="submit" style="margin-right: 25px;">
                  <v-icon left>mdi-login-variant</v-icon>
                  Entrar
                </v-btn>
                <v-btn color="primary" @click="registrarUsuario">
                  <v-icon left style="margin-right: 10px; padding-left: 10px;">mdi-account-plus-outline</v-icon>
                  Cadastrar
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router/router";

const auth = getAuth();
const email = ref("");
const password = ref("");

const registrarUsuario = async () => {
  if (!email.value || !password.value) {
    alert("Insira tanto o email quanto a senha para se cadastrar. Tente novamente!");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    alert("Registro realizado com sucesso!");
    router.push("/Calendario");
  } catch (error) {
    alert("Email já existe. Forneça outro email para fazer o cadastro!");
  }
};

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert("Login realizado com sucesso!");
    router.push("/Calendario");
  } catch (error) {
    alert("Email e senha inválidos. Tente novamente!");
  }
};
</script>

<style scoped>
.imagem-fundo {
  width: 100%;
  height: auto;
}

.calendario-btn {
  position: absolute;
  top: 90px; 
  right: 30px; 
  border-radius: 9px; 
  background-color: #054478;
}

.cardLogin {
  border-radius: 12px;
  background-color: #ffffff; 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
}

.cardLogin .v-text-field { 
  margin-bottom: 20px; 
}

.cardLogin .v-btn { 
  width: 135px; 
}
</style>
