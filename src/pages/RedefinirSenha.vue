<template>
    <v-container fluid fill-height class="container-bg">
      <div class="reset-wrapper">
        <div class="reset-container">
          <div class="image-container">
            <img src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?size=626&ext=jpg&ga=GA1.1.642800631.1716660077&semt=ais_user" alt="Imagem de redefinição de senha">
          </div>
          <div class="form-container">
            <h2>Redefinição de senha</h2>
            <v-form @submit.prevent="sendResetEmail" class="form-content">
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
              <v-btn type="submit" color="primary" class="reset-button">
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
  import router from "@/router/router";
  
  const auth = getAuth();
  const email = ref("");
  
  const sendResetEmail = async () => {
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
  .container-bg {
    background-color: #e5e1e1;
    display: flex;
    justify-content: center;
  }
  
  .reset-wrapper {
    width: 100%;
    max-width: 900px; /* Aumenta a largura do contêiner */
    height: 300px; /* Aumenta a altura do contêiner */
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    background-color: white;
    margin-bottom: 160px;
  }
  
  .reset-container {
    display: flex;
    width: 100%;
  }
  
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .form-container {
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
    margin-bottom: 35px;
  }
  
  .form-content {
    width: 65%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .input-group {
    width: 90%;
    margin-bottom: 30px;
  }
  
  .reset-button {
    width: 63%;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }
  
  </style>
  