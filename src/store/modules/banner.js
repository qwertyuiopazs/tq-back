import {
  getBannerList,
  delBanner,
  addBanner,
  getAllEveryDayBanner
} from "@/api/banner";

const state = {
  bannerList: [],
  everyPageBanner: []
};

const mutations = {
  BANNER_LIST: (state, lsit) => {
    state.bannerList = lsit;
  },
  EVERY_PAGE_BANNER: (state, lsit) => {
    state.everyPageBanner = lsit;
  }
};

const actions = {
  getBannerList({ commit }) {
    return new Promise((resolve, reject) => {
      getBannerList()
        .then(data => {
          const list = data.data ? data.data : [];
          commit("BANNER_LIST", list);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  delBanner(state, list) {
    return new Promise((resolve, reject) => {
      delBanner(list)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  addBanner(state, url = "") {
    return new Promise((resolve, reject) => {
      addBanner(url)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 获取分页情况的全部banner
  getAllEveryDayBanner({ commit }) {
    return new Promise((resolve, reject) => {
      getAllEveryDayBanner()
        .then(data => {
          const list = data.data ? data.data : [];
          commit("EVERY_PAGE_BANNER", list);
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
