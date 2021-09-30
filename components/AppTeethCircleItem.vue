<template>
  <g
    @click="handleCircleClick"
    :id="'Ellipse_' + circleData.id"
    :data-name="'Ellipse ' + circleData.id"
    :transform="`translate(${circleData.translate})`"
    fill="#ff861d"
    stroke="red"
    stroke-width="2"
  >
    <circle
      cx="7"
      cy="7"
      r="7"
      class="circle__bg"
      :class="{ active: isActive }"
      stroke="none"
    />
    <circle
      cx="7"
      cy="7"
      r="6"
      class="circle__line"
      :class="{ active: isDisplay }"
      fill="none"
      stroke="2px"
    />
  </g>
</template>

<script>
import { mapGetters } from "vuex";
import { STEP_TWO } from "~/store/configurator";
import { ObjectID } from "bson";
import toothUtilities from "@/mixins/tooth.utilities.js";

import { ToothBridgeMaterial, ToothProducer } from "@/enums/metadata.enums";

export default {
  mixins: [toothUtilities],
  props: {
    circleData: {
      type: Object,
      require: true,
    },
  },
  computed: {
    ...mapGetters({
      findToothItem: "fraestechnik/tooth/findItem",
      findToothItems: "fraestechnik/tooth/findItems",
      findBridgeItem: "fraestechnik/bridge/findItem",
      findBridgeItems: "fraestechnik/bridge/findItems",
      getActiveTabMaterial: "configurator/getActiveTabMaterial",
      getIsBlocked: "configurator/getIsBlocked",
      getStep: "configurator/getStep",
    }),
    cartItemId() {
      return this.$route.params.id;
    },
    isDisplay() {
      const teeth = this.findToothItems();
      const toothIds = this.circleData?.teethIds;
      const toothLeftId = toothIds ? toothIds[0] : null;
      const toothRigthId = toothIds ? toothIds[1] : null;

      return (
        teeth.find((x) => x._id === toothLeftId)?.singleTeeth ||
        teeth.find((x) => x._id === toothRigthId)?.singleTeeth ||
        teeth.find((x) => x._id === toothLeftId)?.bridge ||
        teeth.find((x) => x._id === toothRigthId)?.bridge
      );
    },
    isActive() {
      const teeth = this.findToothItems();

      const toothIds = this.circleData?.teethIds;
      const toothLeftId = toothIds ? toothIds[0] : null;
      const toothRigthId = toothIds ? toothIds[1] : null;
      const toothLeft = teeth.find((x) => x._id === toothLeftId);
      const toothRight = teeth.find((x) => x._id === toothRigthId);

      return (
        toothLeft?.bridge &&
        toothRight?.bridge &&
        toothLeft?.bridge === toothRight?.bridge
      );
    },
    apiIsBusy() {
      return (
        this.$store.state.fraestechnik.tooth.loading ||
        this.$store.state.fraestechnik.bridge.loading ||
        this.$store.state.fraestechnik.workingModel.loading
      );
    },
  },
  methods: {
    getDefaultBridgeMeta() {
      const currentMaterial = this.getActiveTabMaterial;

      if (currentMaterial === ToothBridgeMaterial.CERAMIC) {
        return {
          material: ToothBridgeMaterial.CERAMIC,
          producer: ToothProducer.IPS,
        };
      } else if (currentMaterial === ToothBridgeMaterial.PLASTIC) {
        return {
          material: ToothBridgeMaterial.PLASTIC,
          producer: ToothProducer.DENTSPLY,
        };
      } else if (currentMaterial === ToothBridgeMaterial.METAL) {
        return {
          material: ToothBridgeMaterial.METAL,
          producer: ToothProducer.DENSEO,
        };
      }

      return patchObject;
    },
    async handleCircleClick() {
      if (this.getStep === STEP_TWO || this.getIsBlocked) return;
      if (this.apiIsBusy) return;

      const leftTooth = this.findToothItem(this.circleData.teethIds[0]);
      const rightTooth = this.findToothItem(this.circleData.teethIds[1]);
      const leftToothBridge = this.findBridgeItem(leftTooth.bridge);
      const rightToothBridge = this.findBridgeItem(rightTooth.bridge);

      if (this.bothTeethHaveNoBridge(leftTooth, rightTooth)) {
        await this.createTwoTeethBridge(leftTooth, rightTooth);
      } else if (this.bothTeethHaveAbridge(leftTooth, rightTooth)) {
        if (this.bothTeethHaveSameBridge(leftTooth, rightTooth)) {
          if (this.bothTeethAreMarginal(leftTooth)) {
            await this.removeBridge(leftTooth, rightTooth);
          } else if (
            this.bothTeethAreNotMarginal(
              leftTooth,
              rightTooth,
              leftToothBridge,
              rightToothBridge
            )
          ) {
            await this.splitBridge(leftTooth, rightTooth);
          } else if (this.leftToothIsMarginal(leftTooth, leftToothBridge)) {
            await this.spliceLeftTooth(leftTooth, leftToothBridge);
          } else if (this.rightToothIsMarginal(rightTooth, rightToothBridge)) {
            await this.spliceRightTooth(rightTooth, rightToothBridge);
          }
        } else if (this.boothTeethHaveNotSameBridge(leftTooth, rightTooth)) {
          await this.mergeBridges(leftTooth, rightTooth);
        }
      } else if (this.oneToothHasAbridge(leftTooth, rightTooth)) {
        await this.attachToothToBridge(leftTooth, rightTooth);
      }
    },
    bothTeethHaveNoBridge(leftTooth, rightTooth) {
      return !leftTooth.bridge && !rightTooth.bridge;
    },
    bothTeethHaveAbridge(leftTooth, rightTooth) {
      return leftTooth.bridge && rightTooth.bridge;
    },
    bothTeethHaveSameBridge(leftTooth, rightTooth) {
      return leftTooth.bridge === rightTooth.bridge;
    },
    boothTeethHaveNotSameBridge(leftTooth, rightTooth) {
      return leftTooth.bridge !== rightTooth.bridge;
    },
    bothTeethAreMarginal(leftTooth) {
      const bridge = this.$fraestechnik.bridge.findItem(leftTooth.bridge);
      const bridgeTeeth = this.getSortedBridgeTeeth(bridge);
      return bridgeTeeth.length === 2;
    },
    bothTeethAreNotMarginal(
      leftTooth,
      rightTooth,
      leftToothBridge,
      rightToothBridge
    ) {
      return (
        leftTooth._id !== this.getFirstBridgeTooth(leftToothBridge)._id &&
        rightTooth._id !== this.getLastBridgeTooth(rightToothBridge)._id
      );
    },
    leftToothIsMarginal(leftTooth, leftToothBridge) {
      return leftTooth._id === this.getFirstBridgeTooth(leftToothBridge)._id;
    },
    rightToothIsMarginal(rightTooth, rightToothBridge) {
      return rightTooth._id === this.getLastBridgeTooth(rightToothBridge)._id;
    },
    oneToothHasAbridge(leftTooth, rightTooth) {
      return leftTooth.bridge || rightTooth.bridge;
    },
    async splitBridge(leftTooth, rightTooth) {
      const newBridgeID = new ObjectID().toString();

      const newBridgePromise = this.$fraestechnik.bridge.createItem({
        _id: newBridgeID,
        material: this.getActiveTabMaterial,
        ...this.getDefaultBridgeMeta(),
      });

      let teethLeftSide = this.getLeftBridgeTeeth(leftTooth);

      const updatedTeethPromise = this.$fraestechnik.tooth.updateItems(
        teethLeftSide.map((tooth) => {
          return Object.assign({}, tooth, {
            bridge: newBridgeID,
            material: this.getActiveTabMaterial,
            ...this.getDefaultBridgeMeta(),
          });
        })
      );

      await Promise.all([newBridgePromise, updatedTeethPromise]);

      const rightBridgeFetchPromise = this.$fraestechnik.bridge.fetchItem(
        rightTooth.bridge
      );
      const newBridgeFetchPromise =
        this.$fraestechnik.bridge.fetchItem(newBridgeID);
      await Promise.all([rightBridgeFetchPromise, newBridgeFetchPromise]);
    },
    async removeBridge(leftTooth, rightTooth) {
      await this.$fraestechnik.bridge.removeItem(leftTooth.bridge);
    },
    async spliceLeftTooth(leftTooth) {
      await this.$fraestechnik.tooth.updateItem(leftTooth._id, {
        bridge: null,
        singleTeeth: true,
      });
      await this.$fraestechnik.bridge.fetchItem(leftTooth.bridge);
    },
    async spliceRightTooth(rightTooth) {
      await this.$fraestechnik.tooth.updateItem(rightTooth._id, {
        bridge: null,
        singleTeeth: true,
      });
      await this.$fraestechnik.bridge.fetchItem(rightTooth.bridge);
    },
    async mergeBridges(leftTooth, rightTooth) {
      const leftBridge = this.$fraestechnik.bridge.findItem(leftTooth.bridge);
      const rightBridge = this.$fraestechnik.bridge.findItem(rightTooth.bridge);
      const sortedTeeth = this.getSortedBridgeTeeth(leftBridge);

      const updatedTeethPromise = this.$fraestechnik.tooth.updateItems(
        sortedTeeth.map((tooth) => {
          return Object.assign({}, tooth, {
            bridge: rightBridge._id,
          });
        })
      );

      const removeBridgePromise = this.$fraestechnik.bridge.removeItem(
        leftBridge._id
      );
      await Promise.all([updatedTeethPromise, removeBridgePromise]);
      await this.$fraestechnik.bridge.fetchItem(rightBridge._id);
    },
    async attachToothToBridge(leftTooth, rightTooth) {
      const bridgeId = leftTooth.bridge ? leftTooth.bridge : rightTooth.bridge;
      const objectWithUpdates = {
        bridge: bridgeId,
        singleTeeth: false,
        ...this.getDefaultBridgeMeta(),
      };

      const updateTeeth = [
        { ...objectWithUpdates, _id: leftTooth._id },
        { ...objectWithUpdates, _id: rightTooth._id },
      ];

      const updatedTeethPromise =
        this.$fraestechnik.tooth.updateItems(updateTeeth);
      const updatedBridgePromise = this.$fraestechnik.bridge.updateItem(
        bridgeId,
        {
          material: this.getActiveTabMaterial,
          ...this.getDefaultBridgeMeta(),
        }
      );

      await Promise.all([updatedTeethPromise, updatedBridgePromise]);
      await this.$fraestechnik.bridge.fetchItem(bridgeId);
    },
    async createTwoTeethBridge(leftTooth, rightTooth) {
      const bridgeID = new ObjectID().toString();
      const objectWithUpdates = {
        bridge: bridgeID,
        singleTeeth: false,
        ...this.getDefaultBridgeMeta(),
      };
      const updateTeeth = [
        { ...objectWithUpdates, _id: leftTooth._id },
        { ...objectWithUpdates, _id: rightTooth._id },
      ];
      const updatedTeethPromise =
        this.$fraestechnik.tooth.updateItems(updateTeeth);
      const createdBridgePromise = this.$fraestechnik.bridge.createItem({
        _id: bridgeID,
        material: this.getActiveTabMaterial,
        ...this.getDefaultBridgeMeta(),
      });
      await Promise.all([updatedTeethPromise, createdBridgePromise]);
      await this.$fraestechnik.bridge.fetchItem(bridgeID);
    },
    getLeftBridgeTeeth(tooth) {
      const bridge = this.$fraestechnik.bridge.findItem(tooth.bridge);
      const sortedTeeth = this.getSortedBridgeTeeth(bridge);
      const toothIndex = sortedTeeth.findIndex(
        (x) => x.toothNumber === tooth.toothNumber
      );
      let leftSideBridgeTeeth = [];
      sortedTeeth.forEach((x, i) => {
        if (i <= toothIndex) {
          leftSideBridgeTeeth = [...leftSideBridgeTeeth, x];
        }
      });
      return leftSideBridgeTeeth;
    },
  },
};
</script>

<style lang="scss" scoped>
.circle {
  &__bg {
    fill: transparent;

    &.active {
      transition: all 0.3s ease-out;
      fill: $teethCircleBg;
    }
  }

  &__line {
    stroke: transparent;
    stroke-width: 2px;

    &.active {
      transition: all 0.3s ease-out;
      stroke: $teethCircleLine;
    }
  }
}
</style>
