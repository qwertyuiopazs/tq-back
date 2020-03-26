import { getBannerList, delBanner, addBanner } from "@/api/banner";

const state = {
  bannerList: []
};

const mutations = {
  BANNER_LIST: (state, lsit) => {
    state.bannerList = lsit;
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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
