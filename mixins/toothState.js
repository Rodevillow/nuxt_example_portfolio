import { mapGetters } from "vuex";
import {
  SIDE_TOP,
  SIDE_BOTTOM,
  STEP_TWO,
  METARIAL_CERAMIC,
  METARIAL_PLASTIC,
  METARIAL_METAL,
} from "@/store/configurator";

import { ToothBridgeMaterial, ToothProducer } from "@/enums/metadata.enums";

import toothUtilities from "@/mixins/tooth.utilities.js";

export const toothStateMixin = {
  mixins: [toothUtilities],
  props: {
    toothData: {
      type: Object,
      require: false,
    },
  },
  computed: {
    ...mapGetters({
      getStep: "configurator/getStep",
      getActiveTabMaterial: "configurator/getActiveTabMaterial",
      getIsBlocked: "configurator/getIsBlocked",
      findWorkingModelItem: "fraestechnik/workingModel/findItem",
      findBridgeItem: "fraestechnik/bridge/findItem",
    }),
    claspCrownIsActive() {
      return (
        this.toothData.claspCrown &&
        (this.toothData.bridge || this.toothData.singleTeeth)
      );
    },
    toothIsActive() {
      return this.toothData?.singleTeeth;
    },
    toothIsActiveBridge() {
      return this.toothData?.bridge;
    },
    isCeramic() {
      if (this.toothData?.bridge) {
        return this.chackIsBridgeMaterialCompare(METARIAL_CERAMIC);
      }
      return this.toothData?.material === METARIAL_CERAMIC;
    },
    isPlastic() {
      if (this.toothData?.bridge) {
        return this.chackIsBridgeMaterialCompare(METARIAL_PLASTIC);
      }
      return this.toothData?.material === METARIAL_PLASTIC;
    },
    isMetal() {
      if (this.toothData?.bridge) {
        return this.chackIsBridgeMaterialCompare(METARIAL_METAL);
      }
      return this.toothData?.material === METARIAL_METAL;
    },
    switchModeTop() {
      return this.findWorkingModelItem()
        ? this.findWorkingModelItem().OK
        : false;
    },
    switchModeBottom() {
      return this.findWorkingModelItem()
        ? this.findWorkingModelItem().UK
        : false;
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
    chackIsBridgeMaterialCompare(material) {
      const bridge = this.findBridgeItem(this.toothData.bridge);
      return bridge?.material === material;
    },
    async handleClick() {
      if (this.getIsBlocked) return;
      if (this.apiIsBusy) return;
      await this.handleClickWithMode();
      await this.handleClickWithoutMode();
    },
    async handleClickWithoutMode() {
      if (this.getStep === STEP_TWO) return;
      if (this.toothData.bridge && !this.isMarginalTooth(this.toothData))
        return;
      if (this.toothData.bridge && this.isMarginalTooth(this.toothData)) {
        const bridge = this.$fraestechnik.bridge.findItem(
          this.toothData.bridge
        );
        const updatedFirstToothPromise = this.$fraestechnik.tooth.updateItem(
          this.toothData._id,
          {
            singleTeeth: false,
            bridge: null,
          }
        );
        const bridgeTeeth = this.getSortedBridgeTeeth(bridge);

        if (bridgeTeeth.length < 2) {
          const firstBridgeTooth = this.getFirstBridgeTooth(bridge);
          const lastBridgeTooth = this.getLastBridgeTooth(bridge);
          const otherBridgeTooth = [firstBridgeTooth, lastBridgeTooth].find(
            (x) => x._id !== this.toothData._id
          );
          const updatedSecondToothPromise = this.$fraestechnik.tooth.updateItem(
            otherBridgeTooth._id,
            { singleTeeth: true, bridge: null }
          );
          const removedBridgePromise = this.$fraestechnik.bridge.removeItem(
            bridge._id
          );

          await Promise.all([
            updatedFirstToothPromise,
            updatedSecondToothPromise,
            removedBridgePromise,
          ]);
        } else {
          await Promise.all([updatedFirstToothPromise]);
          await this.$fraestechnik.bridge.fetchItem(bridge._id);
        }
      } else if (!this.toothData.bridge) {
        if (this.toothData.singleTeeth) {
          await this.$fraestechnik.tooth.updateItem(this.toothData._id, {
            singleTeeth: false,
          });
          return;
        }
        if (!this.toothData.singeTeeth) {
          await this.$fraestechnik.tooth.updateItem(this.toothData._id, {
            material: this.getActiveTabMaterial,
            singleTeeth: true,
            ...this.getDefaultToothMeta(),
          });
        }
      }
    },
    getDefaultToothMeta() {
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
    },
    async handleClickWithMode() {
      if (
        this.getStep === STEP_TWO &&
        (this.toothData.singleTeeth || this.toothData.bridge) &&
        ((this.switchModeTop && this.toothData.side === SIDE_TOP) ||
          (this.switchModeBottom && this.toothData.side === SIDE_BOTTOM))
      ) {
        await this.$fraestechnik.tooth.updateItem(this.toothData._id, {
          workingModel: this.toothData.workingModel
            ? null
            : this.findWorkingModelItem()._id,
        });
        const workingModel = this.$fraestechnik.workingModel.findItem();
        await this.$fraestechnik.workingModel.fetchItem(workingModel._id);
      }
    },
  },
};

export default toothStateMixin;
