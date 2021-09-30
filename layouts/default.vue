<template>
  <section class="layout-theme" v-if="!$fetchState.pending">
    <Header />
    <Nuxt/>
  </section>
</template>

<script>
import Header from "@/components/TheHeader";
import { mapGetters } from "vuex";

export default {
  middleware: ['loggedIn'],
  components: {
    Header
  },
  async fetch() {
    await this.$fraestechnik.user.fetchItem();
  }
};
</script>

<style lang="scss" scope>
  .layout-theme {
    overflow-x: hidden;
  }
</style>
