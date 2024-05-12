<template>
    <v-bottom-navigation class="blue darken-3" dark fixed>
    <!-- Cria um botão de ícone para cada item no array icons que é iterado -->
    <!-- É só representando, nada funcional ainda -->
    <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
      <v-icon size="24px">{{ icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
data() {
    return {
      icons: ['mdi-home', 'mdi-account-school', 'mdi-book-open-blank-variant-outline', 'mdi-forum-outline']
    };
  }
}
</script>
