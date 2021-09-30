<template>
  <LayoutAuth>
      <LeftSection slot="button"/>
      <RightSection slot="content" />
  </LayoutAuth>
</template>

<script>
import LeftSection from "@/pages/login/sections/LeftSection";
import RightSection from "@/pages/login/sections/RightSection";
import LayoutAuth from '@/components/LayoutAuth'

export default {
  auth: false,
  layout:'empty',
  components: {
    LayoutAuth,
    LeftSection,
    RightSection
  }
};
</script>

<style lang="scss" scoped>

</style>
