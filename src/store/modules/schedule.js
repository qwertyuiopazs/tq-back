import { getGameSchedulePage, getLeagueTypePage } from "@/api/schedule";

const state = {
  scheduleInfo: {},
  scheduleTypeInfo: {}
};

const mutations = {
  SCHEDULE_INFO: (state, lsit) => {
    state.scheduleInfo = lsit;
  },
  SCHEDULETYPE_INFO: (state, lsit) => {
    state.scheduleTypeInfo = lsit;
  }
};

const actions = {
  getGameSchedulePage({ commit }, param) {
    return new Promise((resolve, reject) => {
      getGameSchedulePage(param)
        .then(data => {
          const list = data.data ? data.data : [];
          commit("SCHEDULE_INFO", list);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getLeagueTypePage({ commit }, param) {
    return new Promise((resolve, reject) => {
      getLeagueTypePage(param)
        .then(data => {
          const list = data.data ? data.data : [];
          commit("SCHEDULETYPE_INFO", list);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
