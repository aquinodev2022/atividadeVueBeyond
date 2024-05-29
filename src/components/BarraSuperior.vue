<template>
  <div>
    <v-app-bar color="blue darken-3">

      <div id="alinharIcone">
        <v-icon aria-label="Ícone de um calendário" id="iconeCalendario">mdi-calendar</v-icon>
        <h2>Calendário</h2>
      </div>

      <v-spacer></v-spacer>
      <!-- Ícone de configurações só aparece se o usuário estiver logado -->
      <v-icon v-if="estaLogado" @click="abrirDialogo = true" aria-label="Ícone que representa as configurações"
        id="iconeConfiguracoes">mdi-cog</v-icon>
    </v-app-bar>

    <v-dialog v-model="abrirDialogo" max-width="630px">
      <v-card>
        <v-card-title id="tituloConfiguracoes">Configurações do calendário</v-card-title>

        <v-btn color="red" id="botaoLogout" @click="SairDaConta">
          <v-icon id="iconeLogout">mdi-logout-variant</v-icon>
          Sair da conta
        </v-btn>

        <v-btn color="blue darken-3" id="botaoAlterarSenha" @click="AlterarSenha">
          <v-icon id="iconeAlterarSenha">mdi-lock-reset</v-icon>
          Alterar Senha
        </v-btn>

        <v-btn color="grey" id="botaoCancelarDialogo" @click="abrirDialogo = false">
          <v-icon id="iconeCancelarDialogo">mdi-cancel</v-icon>
          Cancelar
        </v-btn>

      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
#alinharIcone {
  text-decoration: none;
  display: flex;
}

#iconeCalendario {
  font-size: 30px;
  color: white;
  margin-bottom: 1px;
}

h2 {
  color: white;
  margin-left: 10px;
}

#iconeConfiguracoes {
  color: white;
  font-size: 30px;
  cursor: pointer;
}

#tituloConfiguracoes {
  margin-left: 24.50%;
  margin-bottom: 2%;
}

#botaoLogout {
  margin-bottom: 20px;
  margin-left: 30px;
}

#botaoAlterarSenha {
  margin-bottom: 20px;
  margin-left: 18px;
}

#botaoCancelarDialogo {
  position: absolute;
  bottom: 20px;
  margin-left: 3%;
  width: 138px;
}

#iconeLogout,
#iconeAlterarSenha,
#iconeCancelarDialogo {
  margin-right: 8px;
}
</style>

<script>
import { signOut, onAuthStateChanged, getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from "../router/router";

export default {
  data() {
    return {
      // Estado inicial por padrão do componente 
      abrirDialogo: false,
      estaLogado: false
    };
  },

  created() {
    const auth = getAuth(); // obtem o serviço de autenticação do Firebase
    onAuthStateChanged(auth, (user) => { // Verifica as mudanças de estado de autenticação
      if (user) {
        this.estaLogado = true;
      } else {
        this.estaLogado = false;
      }
    });
  },

  methods: {
    async SairDaConta() {
      try {
        const auth = getAuth();
        await signOut(auth);
        alert("Logout realizado com sucesso!");
        router.push("/login");
        this.abrirDialogo = false;
      } catch (error) {
        alert("Erro ao fazer logout:", error);
      }
    },

    async AlterarSenha() {
      const auth = getAuth();
      // Obtém o usuário atualmente autenticado
      const user = auth.currentUser;
      // Obtém o email do usuário atual
      const email = user ? user.email : null;

      // Verifica se o email do usuário existe
      if (email) {
        try {
          // Envia um email de redefinição de senha para o email fornecido
          await sendPasswordResetEmail(auth, email);
          alert(`Um email para redefinir sua senha foi enviado para ${email}`);
          this.abrirDialogo = false;
        } catch (error) {
          alert("Erro ao enviar email de redefinição de senha:", error);
        }
      } else {
        alert("Usuário não encontrado ou não autenticado.");
      }
    }
  }
};
</script>