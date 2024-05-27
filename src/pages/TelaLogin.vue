<template>
  <v-container fluid fill-height class="container-bg">
    <div class="login-wrapper">
      <div class="login-container">
        <div class="login-image">
          <img src="@/assets/imagemLogin.jpg" alt="Imagem de Login">
        </div>
        <div class="login-form">
          <h2>Login</h2>
          <v-form @submit.prevent="login">
            <div class="input-group">
              <v-text-field
                v-model="email"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                hide-details
                solo
              ></v-text-field>
            </div>
            <div class="input-group">
              <v-text-field
                v-model="password"
                id="password"
                name="password"
                type="password"
                placeholder="Senha"
                required
                hide-details
                solo
              ></v-text-field>
            </div>
            <v-btn type="submit" color="success" class="login-button">
              Entrar
            </v-btn>
            <v-btn color="primary" @click="registrarUsuario" class="register-button">
              Cadastrar
            </v-btn>
            <a href="#" @click.prevent="navegarParaRedefinirSenha" class="forgot-password-link">
              <v-icon></v-icon>
              Esqueceu a Senha?
            </a>
          </v-form>
        </div>
      </div>
    </div>
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

  if (password.value.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres. Tente novamente!");
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

const navegarParaRedefinirSenha = () => {
  router.push("/RedefinirSenha");
};

// Adiciona uma variável de estado para controlar se o usuário está autenticado
const isAuthenticated = ref(false);

// Observa o estado de autenticação do usuário
auth.onAuthStateChanged(user => {
  isAuthenticated.value = !!user;
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.container-bg {
  background-color: #e5e1e1;
  display: flex;
  justify-content: center;
}

.login-wrapper {
  width: 100%;
  max-width: 900px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 156px; 
}

.login-container {
  display: flex;
}

.login-image {
  flex: 1;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-form {
  flex: 1;
  padding: 40px;
  background-color: #0056b3; 
}

h2 {
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
  font-size: 2em;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.login-button {
  width: 42%;
  padding: 10px;
  margin: 25px 15px ;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #218838;
}

.register-button {
  width: 42%;
  padding: 10px;
  margin: 25px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #0056b3;
}

.forgot-password-link {
  display: block;
  margin: 10px 0;
  color: white;
  text-align: center;
  cursor: pointer;
}

/* Estilo para ocultar o ícone de configurações se o usuário não estiver autenticado */
#iconeConfiguracoes {
  display: none;
}
</style>
