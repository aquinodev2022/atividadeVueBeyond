<template>
  <v-footer dark padless class="footer">
    <v-card class="flex">
      <v-card-title class="blue darken-3 d-flex justify-center">
        <strong class="mr-8">Beyond Co.</strong>

        <template v-for="icon in icons">
          <a :href="getLink(icon)" :key="icon" class="mx-4" target="_blank">
            <v-btn dark icon>
              <v-icon size="24px">{{ icon }}</v-icon>
            </v-btn>
          </a>
        </template>
      </v-card-title>

      <v-card-text class="py-2 blue darken-3 text-center">
        {{ new Date().getFullYear() }} — <strong>Calendário Beyond</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      'mdi-github',
      'mdi-email-outline',
      'mdi-linkedin',
      'mdi-instagram',
    ],
    links: {
      'mdi-github': 'https://github.com/aquinodev2022',
      'mdi-email-outline': 'mailto:offlinematheus@gmail.com',
      'mdi-linkedin': 'https://www.linkedin.com/in/matheus-aquino-dos-santos-dev/',
      'mdi-instagram': 'https://www.instagram.com/matheus_aquino2k24/',
    },
  }),
  methods: {
    getLink(icon) {
      return this.links[icon] || '#'; // Retorna o link correspondente ou '#' se não houver link definido
    }
  }
}
</script>

<style>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
