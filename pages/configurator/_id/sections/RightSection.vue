<template>
  <div class="teeth-configurator-right">
    <transition name="page">
      <div v-if="stepOneIsActive" class="teeth-configurator-right--step-one">
        <AppH1 class="teeth-configurator-right__title">{{
          $t("ThePageConfigurator_RightSection_StepOne_Title")
        }}</AppH1>
        <StepOne class="teeth-configurator-right__panel" />
      </div>
    </transition>
    <transition name="page">
      <div v-if="stepTwoIsActive" class="teeth-configurator-right--step-two">
        <AppH1 class="teeth-configurator-right__title">{{
          $t("ThePageConfigurator_RightSection_StepTwo_Title")
        }}</AppH1>
        <StepTwo class="teeth-configurator-right__panel" />
      </div>
    </transition>
  </div>
</template>

<script>
import SeparateWrapperMain from "@/components/SeparateWrapperMain";
import StepOne from "@/components/StepOne";
import StepOneTabs from "@/components/StepOneTabs";
import StepTwo from "@/components/StepTwo";
import { STEP_ONE, STEP_TWO } from "@/store/configurator/index.js";
import AppH1 from "@/components/AppH1";

export default {
  components: {
    SeparateWrapperMain,
    StepOne,
    StepOneTabs,
    StepTwo,
    AppH1,
  },
  computed: {
    stepOneIsActive() {
      return this.$store.state.configurator.step === STEP_ONE;
    },
    stepTwoIsActive() {
      return this.$store.state.configurator.step === STEP_TWO;
    },
  },
};
</script>

<style lang="scss" scoped>
.teeth-configurator-right {
  position: relative;

  &__title {
    margin-bottom: 2rem;
    width: 100%;
    text-align: left;
  }

  &__panel {
    height: inherit;
  }

  // &--step-one {}

  &--step-two {
    width: 100%;
  }
}
</style>
