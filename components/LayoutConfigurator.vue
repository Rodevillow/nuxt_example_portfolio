<template>
  <section class="layout-configurator">
    <div class="page">
      <div class="container">
        <div class="row">
          <div class="col-lg-5">
            <div class="layout-configurator__block layout-configurator__block--left">
              <slot name="left" />
            </div>
          </div>
          <div class="col-lg-7">
            <div class="layout-configurator__background"></div>
            <div class="layout-configurator__block layout-configurator__block--right">
              <slot name="right" />
            </div>            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from "@/components/TheHeader";
import AppLeftBlockInfo from "@/components/AppLeftBlockInfo";
import AppIconBigTooth from "@/components/AppIconBigTooth";
import { mapGetters } from "vuex";

export default {
  components: {
    Header,
    AppLeftBlockInfo,
    AppIconBigTooth
  },
};
</script>

<style lang="scss" scope>

  .layout-configurator {
    overflow-x: hidden;
    position:relative;
    &__block{
      height: 100%;
      padding:2rem 0;
    }
    &__background{
      background-color: $primary-light;
      z-index: -1;
      position: absolute;
      top:0;
      left:0;
      width:200vw;
      height: 100%;
      transform:translateX(-50%);
    }
  }

  @include media-breakpoint-up(lg){
    .layout-configurator{
      &__background{
        width:100vw;
        transform:translateX(0%);        
      }
      &__block{
        &--right{
          padding-left:3rem;
          width:100%;
          min-height: calc(100vh - 92px);
        }
        // &--left{
        //   height: calc(100vh - 92px);
        // }
      }      
    }
  }

</style>
