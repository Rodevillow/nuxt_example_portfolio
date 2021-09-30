import { ToothBridgeMaterial } from "~/enums/metadata.enums";

// PREFIX
export const CONFIGURATOR_NAMESPACE_PREFIX = "configurator/";

// START ENUMS
// --- step enum
export const STEP_ONE = 0;
export const STEP_TWO = 1;
// --- step enum
// --- side enum
export const SIDE_TOP = "top";
export const SIDE_BOTTOM = "bottom";
// --- side enum
// --- meterials
export const METARIAL_CERAMIC = ToothBridgeMaterial.CERAMIC;
export const METARIAL_PLASTIC = ToothBridgeMaterial.PLASTIC;
export const METARIAL_METAL = ToothBridgeMaterial.METAL;
// --- meterials
// END ENUMS

// MUTATIONS TYPES
export const SET_STEP = "setStepMutation";
export const SET_SWITCH_MODE = "setSwitchModeMutation";
export const SET_IS_BLOCKED = "setIsBlockedMutation";
export const SET_TAB_IS_ACTIVE_BY_INDEX = "setTabIsActiveByIndexMutation";

// ACTIONS TYPES
export const DO_SET_STEP = "doSetStepAction";
export const DO_SET_SWITCH_MODE = "doSetSwitchModeAction";
export const DO_SET_IS_BLOCKED = "doSetIsBlockedAction";
export const DO_SET_TAB_IS_ACTIVE_BY_INDEX = "doSetTabIsActiveByIndexAction";

export const state = () => ({
  step: STEP_ONE,
  isBlocked: false,
  tabs: [
    {
      title: "Keramik",
      material: METARIAL_CERAMIC,
      isActive: true
    },
    {
      title: "Kunststoff",
      material: METARIAL_PLASTIC,
      isActive: false
    },
    {
      title: "Metal",
      material: METARIAL_METAL,
      isActive: false
    }
  ]
});

export const mutations = {
  [SET_STEP](state, step) {
    state.step = step;
  },
  [SET_IS_BLOCKED](state, isBlocked) {
    state.isBlocked = isBlocked;
  },
  [SET_TAB_IS_ACTIVE_BY_INDEX](state, index) {
    let tabs = [...state.tabs];
    tabs.map((tab, key) => (tab.isActive = index === key));
  }
};

export const actions = {
  [DO_SET_STEP]({ commit }, step) {
    commit(SET_STEP, step);
  },
  [DO_SET_IS_BLOCKED]({ commit }, isBlocked) {
    commit(SET_IS_BLOCKED, isBlocked);
  },
  [DO_SET_TAB_IS_ACTIVE_BY_INDEX]({ commit }, index = 0) {
    commit(SET_TAB_IS_ACTIVE_BY_INDEX, index);
  }
};

export const getters = {
  getStep: state => {
    return state.step;
  },
  getIsBlocked: state => {
    return state.isBlocked;
  },
  getTabs: state => {
    return state.tabs;
  },
  getActiveTabMaterial: state => {
    for (let i = 0; i < state.tabs.length; i++) {
      if (state.tabs[i].isActive) {
        return state.tabs[i].material;
      }
    }
    return null;
  }
};
