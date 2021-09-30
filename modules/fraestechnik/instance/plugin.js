//1. Here we're importing the source code of our plugin
import Fraestechnik from "<%= options.fraestechnikPath %>";

//2. We're initiating Vuex to create a store IF(!) no store is setup in `@/store`
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store();

export default async (context, inject) => {
  context["store"] = context.store || store;
  inject("fraestechnik", new Fraestechnik(context));
};
