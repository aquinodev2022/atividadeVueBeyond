<template>
  <v-container fluid fill-height class="containerGeral">
    <!-- Adiciona o v-snackbar para exibir mensagens -->
    <v-snackbar id="popupMensagem" v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color" top right>
      <div class="snackbar-content">
        {{ snackbar.message }}
        <v-btn icon @click="fecharSnackbar" class="snackbar-close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-snackbar>

    <div class="login-wrapper">
      <div class="containerLogin">
        <div class="login-image">
          <img src="@/assets/imagemLogin.jpg" alt="Imagem de Login">
        </div>
        <div class="FormLogin">
          <h2>Login</h2>
          <v-form @submit.prevent="login">
            <div class="inputLogin">
              <v-text-field v-model="email" id="email" name="email" type="email" placeholder="Email" required hide-details solo></v-text-field>
            </div>
            <div class="inputLogin">
              <v-text-field v-model="password" id="password" name="password" type="password" placeholder="Senha" required hide-details solo></v-text-field>
            </div>
            <v-btn type="submit" color="success" class="botaoLogin" :loading="loginLoading">
              Entrar
            </v-btn>
            <v-btn color="primary" @click="registrarUsuario" class="botaoRegistrar" :loading="registerLoading">
              Cadastrar
            </v-btn>
            <a href="#" @click.prevent="navegarParaRedefinirSenha" class="irParaRedefinirSenha">
              Esqueceu sua Senha?
            </a>
          </v-form>
        </div>
      </div>
    </div>
    <!-- Renderiza o ícone de configurações se o usuário estiver autenticado -->
    <v-btn v-if="isAuthenticated" icon>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-container>
</template>


<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router/router";

const auth = getAuth();
const email = ref("");
const password = ref("");
const loginLoading = ref(false); // Variável de estado para controle de carregamento do login
const registerLoading = ref(false); // Variável de estado para controle de carregamento do registro

// Adiciona o estado do v-snackbar
const snackbar = ref({
  show: false,
  message: "",
  timeout: 5000, 
  color: "success" 
});

let timeoutID; // Declaração da variável para o ID do temporizador

const login = async () => {
  try {
    loginLoading.value = true; // Define o estado de carregamento do login como verdadeiro
    await signInWithEmailAndPassword(auth, email.value, password.value);
    exibirSnackbar("Login realizado com sucesso!", "success");
    setTimeout(() => {
      router.push("/Calendario");
      loginLoading.value = false; // Define o estado de carregamento do login como falso após o redirecionamento
    }, 2500); 
  } catch (error) {
    exibirSnackbar("Email e senha inválidos. Tente novamente!", "error");
    loginLoading.value = false; // Define o estado de carregamento do login como falso em caso de erro
  }
};

const registrarUsuario = async () => {
  if (!email.value || !password.value) {
    exibirSnackbar("Insira tanto o email quanto a senha para se cadastrar. Tente novamente!", "error");
    return;
  }

  if (password.value.length < 6) {
    exibirSnackbar("A senha deve ter pelo menos 6 caracteres. Tente novamente!", "error");
    return;
  }

  try {
    registerLoading.value = true; // Define o estado de carregamento do registro como verdadeiro
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    exibirSnackbar("Registro realizado com sucesso!", "success");
    setTimeout(() => {
      router.push("/Calendario");
      registerLoading.value = false; // Define o estado de carregamento do registro como falso após o redirecionamento
    }, 3000); // Redireciona após 3 segundos
  } catch (error) {
    exibirSnackbar("Email já existe. Forneça outro email para fazer o cadastro!", "error");
    registerLoading.value = false; // Define o estado de carregamento do registro como falso em caso de erro
  }
};

const navegarParaRedefinirSenha = () => {
  router.push("/RedefinirSenha");
};

// Função para exibir o v-snackbar
const exibirSnackbar = (message, color) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;

  // Limpa o temporizador anterior, se houver
  clearTimeout(timeoutID);

  // Define um novo temporizador para fechar o snackbar após o tempo limite
  timeoutID = setTimeout(() => {
    snackbar.value.show = false;
  }, snackbar.value.timeout);
};

const fecharSnackbar = () => {
  clearTimeout(timeoutID); // Limpa o temporizador antes de fechar o v-snackbar
  snackbar.value.show = false;
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

#popupMensagem {
  margin-top: 70px;
  max-width: 60%; 
}

.snackbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 450px;
}

/* Estilo para o botão de fechar no snackbar */
.snackbar-close-btn {
  margin-left: 16px;
  padding: 0;
  min-width: auto;
}

.containerGeral {
  background-color: #e5e1e1;
}

.login-wrapper {
  width: 100%;
  max-width: 900px;
  border-radius: 14px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 156px;
}

.containerLogin {
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

.FormLogin {
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

.inputLogin {
  margin-bottom: 15px;
  text-align: left;
}

.botaoLogin {
  width: 42%;
  padding: 10px;
  margin: 25px 15px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.botaoLogin:hover {
  background-color: #218838;
}

.botaoRegistrar {
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

.botaoRegistrar:hover {
  background-color: #0056b3;
}

.irParaRedefinirSenha {
  display: block;
  margin: 10px 0;
  color: white;
  text-align: center;
  cursor: pointer;
}


</style>
