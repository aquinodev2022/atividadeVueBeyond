<template>
<v-app-bar color="blue darken-3">
    <router-link to="/" id="alinharIcone">
      <v-icon aria-label="Ícone de um calendário" id="iconeCalendario">mdi-calendar</v-icon>
      <h2>Calendário</h2>
    </router-link>
    <v-spacer></v-spacer>
    <!-- É só representando, nada funcional ainda -->
    <v-icon aria-label="Ícone que representa as configurações" id="iconeConfiguracoes">mdi-cog</v-icon>
  </v-app-bar>
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
</style>