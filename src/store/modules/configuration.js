import { getContactInformationList } from "@/api/configuration";

const state = {
  contactInformation: []
};

const mutations = {
  GET_CONTACT_INFORMATION: (state, list) => {
    state.contactInformation = list;
  }
};

const actions = {
  getContactInformationList({ commit }) {
    return new Promise((resolve, reject) => {
      getContactInformationList()
        .then(data => {
          const list = data.data ? data.data : [];
          commit("GET_CONTACT_INFORMATION", list);
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
