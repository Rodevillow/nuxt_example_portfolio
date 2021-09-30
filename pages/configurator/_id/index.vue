<template>
  <LayoutConfigurator v-if="!$fetchState.pending">
    <LeftSection slot="left" class="w-100" />
    <RightSection slot="right" class="w-100" />
  </LayoutConfigurator>
</template>

<script>
import LayoutConfigurator from "@/components/LayoutConfigurator"
import LeftSection from "@/pages/configurator/_id/sections/LeftSection";
import RightSection from "@/pages/configurator/_id/sections/RightSection";
import {
  CONFIGURATOR_NAMESPACE_PREFIX,
  DO_SET_IS_BLOCKED
} from "@/store/configurator";

export default {
  middleware: "auth",
  layout:'default',
  components: {
    RightSection,
    LeftSection,
    LayoutConfigurator
  },
  computed:{
    cartItemId(){
      return this.$route.params.id
    }
  },
  async fetch(){
    this.$fraestechnik.cartItem.selectItem(this.cartItemId)
    await this.$fraestechnik.cartItem.fetchItem(this.cartItemId)
  },
  mounted() {
    this.$store.dispatch(
      CONFIGURATOR_NAMESPACE_PREFIX + DO_SET_IS_BLOCKED,
      false
    );
  }  
};
</script>
