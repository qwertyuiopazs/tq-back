import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user";
import banner from "./modules/banner";
import analyst from "./modules/analyst";
import schedule from "./modules/schedule";
import configuration from "./modules/configuration";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    banner,
    analyst,
    schedule,
    configuration
  },
  getters
});

export default store;
