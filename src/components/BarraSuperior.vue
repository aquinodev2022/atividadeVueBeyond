<template>
  <div>
    <v-app-bar color="blue darken-3">
      <router-link to="/" id="alinharIcone">
        <v-icon aria-label="Ícone de um calendário" id="iconeCalendario">mdi-calendar</v-icon>
        <h2>Calendário</h2>
      </router-link>
      <v-spacer></v-spacer>
      <v-icon v-if="isLoggedIn" @click="dialog = true" aria-label="Ícone que representa as configurações" id="iconeConfiguracoes">mdi-cog</v-icon>
    </v-app-bar>

    <v-dialog v-model="dialog" max-width="630px">
      <v-card>
        <v-card-title id="tituloConfiguracoes">Configurações do calendário</v-card-title>
        <v-card-text>
          <v-btn color="red" id="botaoLogout" @click="logout">
            <v-icon id="iconeLogout">mdi-logout-variant</v-icon>
            Sair da conta
          </v-btn>
          <v-btn color="blue darken-3" id="botaoAlterarSenha" @click="changePassword">
            <v-icon id="iconeAlterarSenha">mdi-lock-reset</v-icon>
            Alterar Senha
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" id="botaoFechar" @click="dialog = false">
            <v-icon>mdi-cancel</v-icon>
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
#iconeCalendario {
  font-size: 30px;
  color: white;
  cursor: pointer;
  margin-bottom: 1px;
}

#alinharIcone {
  text-decoration: none;
  display: flex;
}

h2 {
  color: white;
  cursor: pointer;
  margin-left: 10px;
}

#iconeConfiguracoes {
  color: white;
  font-size: 30px;
  cursor: pointer;
}

#tituloConfiguracoes {
  margin-left: 21.50%;
}

#botaoLogout {
  margin-top: 10px;
}

#iconeLogout {
  margin-right: 8px;
}

#botaoAlterarSenha {
  margin-top: 10px;
  margin-left: 13px;
}

#iconeAlterarSenha {
  margin-right: 8px;
}

#botaoFechar {
  position: absolute;
  bottom: 35.50px;
  margin-left: 407px;
  width: 184px;
}
</style>

<script>
import { signOut, onAuthStateChanged, getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from "@/router/router";

export default {
  data() {
    return {
      dialog: false,
      isLoggedIn: false
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  },
  methods: {
    async logout() {
      try {
        const auth = getAuth();
        await signOut(auth);
        alert("Logout realizado com sucesso!");
        router.push("/login");
        this.dialog = false; // Fechar o popup após o logout
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout:", error);
      }
    },
    async changePassword() {
      const auth = getAuth();
      const user = auth.currentUser;
      const email = user ? user.email : null;

      if (email) {
        try {
          await sendPasswordResetEmail(auth, email);
          alert(`Um email para redefinir sua senha foi enviado para ${email}`);
          this.dialog = false; // Fechar o popup após a solicitação de alteração de senha
        } catch (error) {
          console.error("Erro ao enviar email de redefinição de senha:", error);
          alert("Erro ao enviar email de redefinição de senha:", error);
        }
      } else {
        alert("Usuário não encontrado ou não autenticado.");
      }
    }
  }
};
</script>

