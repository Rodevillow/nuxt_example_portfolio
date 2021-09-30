<template>
  <div class="header">
    <header class="header__navbar">
      <div
        class="container h-100 d-flex justify-content-between align-items-center"
      >
        <div class="header-left mr-5">
          <NuxtLink to="/">
            <AppIconLogo class="header-left__icon"/>
          </NuxtLink>
        </div>
        <div class="header__right">
          <TheHeaderRightMenu class="header__menu-desctop" />
          <AppIconBurger
            class="header__menu-burger"
            @click.native="mobileMenuHandler"
          />
        </div>
      </div>
      <transition name="page">
        <div
          class="header__menu-mobile position-absolute w-100"
          v-if="mobileMenuIsOpen"
        >
          <TheHeaderRightMenu class="header__menu-mobile__wrapper" />
        </div>
      </transition>
    </header>
  </div>
</template>

<script>
import AppIconLogo from "@/components/AppIconLogo";
import AppIconQuestion from "@/components/AppIconQuestion";
import AppIconInfo from "@/components/AppIconInfo";

import AppIconBurger from "@/components/AppIconBurger";
import TheHeaderRightMenu from "@/components/TheHeaderRightMenu";

export default {
  data() {
    return {
      mobileMenuIsOpen: false
    };
  },
  components: {
    AppIconLogo,
    AppIconQuestion,
    AppIconInfo,

    AppIconBurger,
    TheHeaderRightMenu
  },
  methods: {
    mobileMenuHandler() {
      this.mobileMenuIsOpen = !this.mobileMenuIsOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position:relative;
  height: 92px;
  &__navbar {
    transition:all .3s ease-out;
    border-bottom: 1px solid $separatorLine;
    background-color: $white;
    padding:1rem;
    position: fixed;
    width: 100%;
    z-index: 99;
    box-shadow: $box-shadow
  }

  .header-left{
    &__icon {
      max-width: 209px;
    }
  }
  &__left {
    margin-right: 30px;
  }

  &__menu {
    transition:all .3s ease-out;
    &-desctop {
      display: none;
    }
    &-mobile {
      right: 0;
      max-width: 100%;
      background-color: $white;
      box-shadow: $box-shadow-menu;
      z-index: 2;
      min-height: 180px;
      padding: 2rem;
      &__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
    }
    &-burger {
      display: block;
    }
  }

  @include media-breakpoint-up(lg) {
    &__menu {
      &-desctop {
        display: flex;
      }

      &-mobile {
        display: none;
      }

      &-burger {
        display: none;
      }
    }
  }
}
</style>
