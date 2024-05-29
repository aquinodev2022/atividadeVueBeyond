<template>
  <v-footer dark padless class="rodape">
    <v-card class="flex">
      <v-card-title class="blue darken-3 d-flex justify-center">
        <strong class="mr-8">Beyond Co.</strong>

        <!-- Ícones do rodapé -->
        <template v-for="icone in icones">
          <a :href="pegarLink(icone)" :key="icone" class="mx-4" target="_blank">
            <v-btn dark icon>
              <v-icon size="24px">{{ icone }}</v-icon>
            </v-btn>
          </a>
        </template>
      </v-card-title>

      <!-- Ano atual — Calendário Beyond -->
      <v-card-text class="py-2 blue darken-3 text-center">
        {{ new Date().getFullYear() }} — <strong>Calendário Beyond</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icones: [
      'mdi-github',
      'mdi-whatsapp',
      'mdi-linkedin',
      'mdi-instagram',
    ],
    links: {
      'mdi-github': 'https://github.com/aquinodev2022',
      'mdi-whatsapp': 'https://api.whatsapp.com/send/?phone=5581997855713&text&type=phone_number&app_absent=0',
      'mdi-linkedin': 'https://www.linkedin.com/in/matheus-aquino-dos-santos-dev/',
      'mdi-instagram': 'https://www.instagram.com/matheus_aquino2k24/',
    },
  }),
  methods: {
    pegarLink(icone) {
      return this.links[icone] || '#'; // Retorna o link correspondente
    }
  }
}
</script>

<style scoped>
.rodape {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
