import { login, logout, getInfo, getUserInfoList } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    userList: {}
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  GET_USER_LIST: (state, list) => {
    state.userList = list;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { accountNumber, password } = userInfo;

    return new Promise((resolve, reject) => {
      login({ accountNumber: accountNumber.trim(), password: password })
        .then(response => {
          const token = response.msg ? response.msg : "";
          commit("SET_TOKEN", token);
          setToken(token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const id = Number(state.token) ? Number(state.token) : "";
      const param = { id };
      getInfo(param)
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const { accountNumber, avatarPath } = data;

          commit("SET_NAME", accountNumber);
          commit("SET_AVATAR", avatarPath);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },

  // 用户信息
  getUserInfoList({ commit }, param) {
    return new Promise((resolve, reject) => {
      getUserInfoList(param)
        .then(data => {
          const list = data.data ? data.data : {};
          commit("GET_USER_LIST", list);
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
