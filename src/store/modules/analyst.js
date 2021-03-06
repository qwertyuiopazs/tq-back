import {
  getAnalystList,
  getAnalystPage,
  getAnalysisContentPage,
  getPromoteGameRecord
} from "@/api/analyst";

const state = {
  analystList: {},
  analysisContentInfo: {},
  exploitsListInfo: {}
};

const mutations = {
  ANALYST_LIST: (state, list) => {
    state.analystList = list;
  },
  ANALYSISCONTENT_LIST: (state, list) => {
    state.analysisContentInfo = list;
  },
  EXPLOITS_LIST: (state, list) => {
    state.exploitsListInfo = list;
  }
};

const actions = {
  getAnalystList({ commit }) {
    return new Promise((resolve, reject) => {
      getAnalystList()
        .then(data => {
          const list = data.data ? data.data : [];
          commit("ANALYST_LIST", list);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getAnalystPage({ commit }, param) {
    return new Promise((resolve, reject) => {
      getAnalystPage(param)
        .then(data => {
          const list = data.data ? data.data : {};
          commit("ANALYST_LIST", list);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getAnalysisContentPage({ commit }, param) {
    return new Promise((resolve, reject) => {
      getAnalysisContentPage(param)
        .then(data => {
          const list = data.data ? data.data : {};
          commit("ANALYSISCONTENT_LIST", list);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 分析师战绩
  getPromoteGameRecord({ commit }, param) {
    return new Promise((resolve, reject) => {
      getPromoteGameRecord(param)
        .then(data => {
          const list = data.data ? data.data : {};
          commit("EXPLOITS_LIST", list);
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
