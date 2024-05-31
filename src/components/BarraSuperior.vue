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
        <v-btn color="red" id="botaoLogout" @click="SairDaConta" :loading="loadingSairDaConta">
          <v-icon v-if="!loadingSairDaConta" id="iconeLogout">mdi-logout-variant</v-icon>
          <v-icon v-else>mdi-loading</v-icon>
          Sair da conta
        </v-btn>
        <v-btn color="blue darken-3" id="botaoAlterarSenha" @click="AlterarSenha" :loading="loadingAlterarSenha">
          <v-icon v-if="!loadingAlterarSenha" id="iconeAlterarSenha">mdi-lock-reset</v-icon>
          <v-icon v-else>mdi-loading</v-icon>
          Alterar Senha
        </v-btn>
        <v-btn color="grey" id="botaoCancelarDialogo" @click="abrirDialogo = false">
          <v-icon id="iconeCancelarDialogo">mdi-cancel</v-icon>
          Cancelar
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- Snackbar para exibir mensagens -->
    <v-snackbar id="popupMensagem" v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color" top right>
      <div class="snackbar-content">
        <span style="margin-left: 30px;">{{ snackbar.message }}</span>
        <v-btn icon @click="fecharSnackbar" class="snackbar-close-btn">
          <v-icon style="margin-left: 20px;">mdi-close</v-icon>
        </v-btn>
      </div>
    </v-snackbar>

    <!-- Ícone de carregamento -->
    <v-overlay :value="loadingSairDaConta || loadingAlterarSenha">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { signOut, onAuthStateChanged, getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from "../router/router";

export default {
  data() {
    return {
      abrirDialogo: false,
      estaLogado: false,
      loadingSairDaConta: false, // Variável de estado para controlar o carregamento do botão "Sair da conta"
      loadingAlterarSenha: false, // Variável de estado para controlar o carregamento do botão "Alterar Senha"
      snackbar: {
        show: false,
        timeout: 4000,
        color: '',
        message: ''
      },

    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.estaLogado = !!user;
    });
  },

  methods: {
    async SairDaConta() {
      try {
        this.loadingSairDaConta = true; // Ativar ícone de carregamento do botão "Sair da conta"
        const auth = getAuth();
        await signOut(auth);
        this.exibirSnackbar("Logout realizado com sucesso!", "success");
        this.abrirDialogo = false;
        setTimeout(() => {
          router.push("/login");
          this.loadingSairDaConta = false; // Desativar ícone de carregamento do botão "Sair da conta" após redirecionamento
        }, 2000);
      } catch (error) {
        this.exibirSnackbar(`Erro ao fazer logout: ${error.message}`, "error");
        this.loadingSairDaConta = false; // Desativar ícone de carregamento do botão "Sair da conta" em caso de erro
      }
    },
    async AlterarSenha() {
      try {
        this.loadingAlterarSenha = true; // Ativar ícone de carregamento do botão "Alterar Senha"
        const auth = getAuth();
        const user = auth.currentUser;
        const email = user ? user.email : null;
        if (email) {
          await sendPasswordResetEmail(auth, email);
          this.exibirSnackbar(`Um email para redefinir sua senha foi enviado para ${email}`, "success");
          this.abrirDialogo = false;
        } else {
          this.exibirSnackbar("Usuário não encontrado ou não autenticado.", "error");
        }
      } catch (error) {
        this.exibirSnackbar(`Erro ao enviar email de redefinição de senha: ${error.message}`, "error");
      } finally {
        this.loadingAlterarSenha = false; // Desativar ícone de carregamento do botão "Alterar Senha" após ação concluída
      }
    },
    fecharSnackbar() {
      this.snackbar.show = false;
    },
    exibirSnackbar(message, color) {
      this.snackbar = {
        show: true,
        color: color,
        message: message
      };
    }
  }
};
</script>

<style scoped>
#alinharIcone {
  text-decoration: none;
  display: flex;
}

#popupMensagem {
  margin-top: 65px;
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
