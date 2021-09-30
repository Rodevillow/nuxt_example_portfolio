<template>
  <div class="teeth">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 420 680"
    >
      <defs>
        <clipPath id="b"><rect width="524" height="857" /></clipPath>
      </defs>
      <g id="a" clip-path="url(#b)">
        <g transform="translate(751.729 -1850.349)">
          <!-- // --- BG TOP -->
          <AppTeethBGTop />
          <!-- // --- END BG TOP -->

          <!-- // --- BG BOTTOM -->
          <AppTeethBGBottom />
          <!-- // --- END BG BOTTOM -->

          <!-- // --- TOP TEETH -->
          <component
            v-for="tooth in getTeethBySide('top')"
            v-bind:is="tooth.component"
            :toothData="tooth"
            :key="tooth.number"
          ></component>
          <!-- // --- END TOP TEETH -->

          <!-- // --- BOTTOM TEETH -->
          <component
            v-for="tooth in getTeethBySide('bottom')"
            v-bind:is="tooth.component"
            :toothData="tooth"
            :key="tooth.number"
          ></component>
          <!-- // --- END BOTTOM TEETH -->

          <!-- // --- CIRCLES TEETH -->
          <AppTeethCircles />
          <!-- // --- END CIRCLES TEETH -->

          <!-- // --- CROSSES TEETH -->
          <AppTeethCrosses />
          <!-- // --- END CROSSES TEETH -->
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { teeth as teethConfig } from "@/teeth.cfg";

import AppTeethCrosses from "@/components/AppTeethCrosses";
import AppTeethCircles from "@/components/AppTeethCircles";
import AppTeethBGTop from "@/components/AppTeethBGTop";
import AppTeethBGBottom from "@/components/AppTeethBGBottom";

export default {
  components: {
    AppTeethCrosses,
    AppTeethCircles,
    AppTeethBGTop,
    AppTeethBGBottom
  },
  computed: {
    ...mapGetters({
      getSwitchModeTop: "configurator/getSwitchModeTop",
      getSwitchModeBottom: "configurator/getSwitchModeBottom",
      findToothItems: "fraestechnik/tooth/findItems"
    }),
    getTeethData() {
      const teeth = this.findToothItems();
      let accumulatedTeeth = [];
      teeth.forEach(tooth => {
        // Find tooth cfg item by toothNumber
        const toothCfgItem = teethConfig.find(
          x => x.number === tooth.toothNumber
        );

        if (!toothCfgItem) return;

        // Merge config data to each tooth
        const newTooth = Object.assign({}, tooth, {
          index: toothCfgItem.index,
          component: toothCfgItem.component,
          side: toothCfgItem.side,
          circles: toothCfgItem.circles
        });

        accumulatedTeeth = [...accumulatedTeeth, newTooth];
      });

      return accumulatedTeeth;
    },
    getTeethBySide() {
      const context = this;
      return (side = null) => {
        if (!side) {
          return context.getTeethData;
        }
        return context.getTeethData.filter(x => x.side === side);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.teeth {
  width: 100%;

  &::v-deep .teeth-side {
    transition:all .3s ease-out;

    &:hover {
      transition:all .3s ease-out;
      fill: $teethSideHoverBg;
    }

    &.active {
      transition:all .3s ease-out;
      fill: $teethSideActiveBg;
    }
  }
  &::v-deep .tooth {
    .tooth__bg {
      transition:all .3s ease-out;
      fill: $toothBg;

      &.active-plastic {
        fill: $toothBgActivePlastic;

        &-bridge {
          fill: $toothBgActivePlastic;
        }
      }

      &.active-ceramic {
        fill: $toothBgActiveCeramic;

        &-bridge {
          fill: $toothBgActiveCeramic;
        }
      }

      &.active-metal {
        fill: $toothBgActiveMetal;

        &-bridge {
          fill: $toothBgActiveMetal;
        }
      }
    }

    .tooth__line {
      fill: $toothLine;

      &.active-plastic {
        fill: $toothLineActivePlastic;

        &-bridge {
          fill: $toothLineActivePlasticBridge;
        }
      }

      &.active-ceramic {
        fill: $toothLineActiveCeramic;

        &-bridge {
          fill: $toothLineActivePlastiCeramic;
        }
      }

      &.active-metal {
        fill: $toothLineActiveMetal;

        &-bridge {
          fill: $toothLineActivePlastiMetal;
        }
      }
    }

    &:hover {
      .tooth__bg {
        transition:all .3s ease-out;
        opacity: 0.6;
      }

      .tooth__line {
        transition:all .3s ease-out;
        opacity: 0.6;
      }
    }
  }
}
</style>
