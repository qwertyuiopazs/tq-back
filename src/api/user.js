import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/promote/user/login",
    method: "post",
    data
  });
}

export function getInfo(data) {
  return request({
    url: "/promote/backstage/userInfo/getUserInfo",
    method: "post",
    data
  });
}

export function logout() {
  return request({
    url: "/promote/user/logout",
    method: "post"
  });
}

// 用户列表
export function backstageCreateUser(data = {}) {
  return request({
    url: "/promote/backstage/userInfo/backstageCreateUser",
    method: "post",
    data
  });
}

export function deleteUser(idList = []) {
  return request({
    url: "/promote/backstage/userInfo/deleteUser",
    method: "post",
    data: {
      idList
    }
  });
}

export function getUserInfoList(data) {
  return request({
    url: "/promote/backstage/userInfo/getUserInfoList",
    method: "post",
    data
  });
}

export function getUserInfo(id) {
  return request({
    url: "/promote/backstage/userInfo/getUserInfo",
    method: "post",
    data: {
      id
    }
  });
}

export function updateStatus(data = {}) {
  return request({
    url: "/promote/backstage/userInfo/updateStatus",
    method: "post",
    data: {
      idList: data.idList,
      status: data.status
    }
  });
}

export function updateUserInfo(data = {}) {
  return request({
    url: "/promote/backstage/userInfo/updateUserInfo",
    method: "post",
    data
  });
}
