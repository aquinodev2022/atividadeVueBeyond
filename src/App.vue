<template>
  <v-app>
    <v-main>
      <BarraSuperior></BarraSuperior>
      <RodapePadrao></RodapePadrao>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import BarraSuperior from './components/BarraSuperior.vue';
import RodapePadrao from './components/RodapePadrao.vue';

export default {
  name: 'App',

  components: {
    BarraSuperior,
    RodapePadrao
  },
}
</script>


<style>

body {
  overflow: hidden;
}

</style>