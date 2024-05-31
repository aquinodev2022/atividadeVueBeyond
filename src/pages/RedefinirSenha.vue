<template>
  <v-container fluid fill-height class="containerBody">
    <!-- Adiciona o v-snackbar para exibir mensagens -->
    <v-snackbar id="popupMensagem" v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color" top right>
      <div class="snackbar-content">
        {{ snackbar.message }}
        <v-btn icon @click="fecharSnackbar" class="snackbar-close-btn">
          <v-icon style="margin-left: 25px;">mdi-close</v-icon>
        </v-btn>
      </div>
    </v-snackbar>

    <div class="reset-wrapper">
      <div class="reset-container">
        <div class="containerImagem">
          <img src="../assets/imagemRedefinirSenha.avif" alt="Imagem de redefinição de senha">
        </div>
        <div class="containerConteudo">
          <h2>Redefinição de senha</h2>
          <v-form @submit.prevent="enviarEmailRedefinirSenha" class="form-content">
            <div class="inputEmail">
              <v-text-field v-model="email" id="email" name="email" type="email" placeholder="Email" hide-details solo></v-text-field>
            </div>

            <div class="botao-container">
              <v-btn color="grey lighten-1" class="botaoVoltar">
                <router-link to="/" id="voltarTelaLogin">
                  <v-icon>mdi-arrow-left</v-icon>
                  Voltar para Login
                </router-link>
              </v-btn>
              <v-btn type="submit" color="light-blue" class="botaoEnviarRedefinicao" :loading="emailSending">
                <v-icon id="iconeEmailRedefinicao" left>mdi-email</v-icon>
                Enviar Email de Redefinição
              </v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from "../router/router";

const auth = getAuth();
const email = ref("");
const emailSending = ref(false); // Variável de estado para controle de envio de email

const snackbar = ref({
  show: false,
  message: "",
  timeout: 5000,
  color: "success"
});

const enviarEmailRedefinirSenha = async () => {
  if (!email.value) {
    exibirSnackbar("Por favor, insira seu email para redefinir a senha.", "error");
    return;
  }

  try {
    emailSending.value = true; // Define o estado de envio de email como verdadeiro
    await sendPasswordResetEmail(auth, email.value);
    exibirSnackbar("Email para redefinição de senha enviado. Verifique sua caixa de entrada.", "success");
    setTimeout(() => {
      router.push("/login");
      emailSending.value = false; // Define o estado de envio de email como falso após o redirecionamento
    }, 5000);
  } catch (error) {
    exibirSnackbar("Erro ao enviar email de redefinição de senha. Verifique o email informado e tente novamente.", "error");
    emailSending.value = false; // Define o estado de envio de email como falso em caso de erro
  }
};

const fecharSnackbar = () => {
  snackbar.value.show = false;
};

const exibirSnackbar = (message, color) => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
};
</script>

<style scoped>
.containerBody {
  background-color: #e5e1e1;
  display: flex;
  justify-content: center;
}

.reset-wrapper {
  width: 100%;
  max-width: 900px;
  height: 300px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  margin-bottom: 160px;
}

.reset-container {
  display: flex;
  width: 100%;
}

.containerImagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.containerConteudo {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0056b3;
}

h2 {
  color: white;
  text-align: center;
  margin-bottom: 3vh;
}

.form-content {
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputEmail {
  width: 100%;
  margin-bottom: 10vh;
}

.botao-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.botaoVoltar,
.botaoEnviarRedefinicao {
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 53vh;
}

.botaoVoltar {
  width: 10%;
  margin-right: 50px;
  position: absolute;
  right: 42%;
}

#voltarTelaLogin {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333333;
}

.botaoEnviarRedefinicao {
  width: 15%;
  position: absolute;
  left: 57%;
  background-color: #007bff;
  color: white;
}

#iconeEmailRedefinicao {
  color: black;
}

#popupMensagem {
  margin-top: 70px;
  max-width: 60%;
}

.snackbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 450px
}


.snackbar-close-btn {
  padding: 0;
  min-width: auto;
}
</style>
