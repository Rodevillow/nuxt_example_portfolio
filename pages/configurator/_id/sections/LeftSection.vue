<template>
  <div>
    <div class="patientname d-flex align-items-center">
      <div class="patientname__title">
        {{ $t("ThePageConfigurator_LeftSection_Title") }}
      </div>
      <AppIconAngelRight />
      <div class="patientname__value">
        {{ cartItem.patientId }} {{ cartItem.name }}
      </div>
    </div>
    <b-overlay :show="overlayStatus" variant="white" opacity=".8">
      <AppTeeth class="teeth-configurator__teeth" />
      <template #overlay>
        <div class="teeth-configurator__overlay">
          {{ $t("StepTwo_Configurator_Overlay") }}
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import AppTeeth from "@/components/AppTeeth";
import AppIconAngelRight from "@/components/AppIconAngelRight";
import { STEP_TWO } from "@/store/configurator";

export default {
  components: {
    AppIconAngelRight,
    AppTeeth,
  },
  computed: {
    cartItem() {
      return this.$fraestechnik.cartItem.findItem();
    },
    workingModel() {
      return this.$fraestechnik.workingModel.findItem();
    },
    stepTwoIsActive() {
      return this.$store.state.configurator.step === STEP_TWO;
    },
    overlayStatus() {
      return (
        this.stepTwoIsActive && !this.workingModel.OK && !this.workingModel.UK
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.patientname {
  margin-bottom: 2rem;

  &__title {
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
  }
  &__value {
    color: #88b09f;
    font-size: 16px;
    font-weight: 400;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
  }
}
.teeth-configurator {
  &__overlay {
    width: 320px;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: bold;
    font-size: 22px;
    line-height: 29px;
    width: 245px;
    text-align: center;
  }
}
</style>
