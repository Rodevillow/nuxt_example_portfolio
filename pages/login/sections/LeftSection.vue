<template>
  <NuxtLink slot="button" to="/registration" class="text-decoration-none">
    <AppButtonOutline>{{$t('App_LeftSection_Button')}}</AppButtonOutline>
  </NuxtLink>    
</template>

<script>
import AppButtonOutline from "@/components/AppButtonOutline";

export default {
  components: {
    AppButtonOutline,
  }
};
</script>

<style lang="scss" scoped>

</style>
