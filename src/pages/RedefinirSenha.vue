<template>
  <v-container fluid fill-height class="containerBody">
    <div class="reset-wrapper">
      <div class="reset-container">
        <div class="containerImagem">
          <img src="../assets/imagemRedefinirSenha.avif" alt="Imagem de redefinição de senha">
        </div>
        <div class="containerConteudo">
          <h2>Redefinição de senha</h2>
          <v-form @submit.prevent="enviarEmailRedefinirSenha" class="form-content">
            <div class="inputEmail">
              <v-text-field v-model="email" id="email" name="email" type="email" placeholder="Email" hide-details
                solo></v-text-field>
            </div>
            <v-btn type="submit" color="primary" class="botaoEnviarRedefinicao">
              Enviar Email de Redefinição
            </v-btn>
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

const enviarEmailRedefinirSenha = async () => {
  if (!email.value) {
    alert("Por favor, insira seu email para redefinir a senha.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value);
    alert("Email para redefinição de senha enviado. Verifique sua caixa de entrada.");
    router.push("/login");
  } catch (error) {
    alert("Erro ao enviar email de redefinição de senha. Verifique o email informado e tente novamente.");
  }
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
  margin-top: 20px;
  margin-bottom: 20px;
}

.form-content {
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputEmail {
  width: 90%;
  margin-bottom: 35px;
}

.botaoEnviarRedefinicao {
  width: 75%;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

/* Remove o ícone de configurações da tela de redefinição de senha */
#iconeConfiguracoes {
  display: none;
}

</style>