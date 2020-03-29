import request from "@/utils/request";

export function getBannerList(data = {}) {
  return request({
    url: "/promote/backstage/banner/getAllBanner",
    method: "post",
    data
  });
}
export function delBanner(data = []) {
  return request({
    url: "/promote/backstage/banner/delBanner",
    method: "post",
    data: {
      idList: data
    }
  });
}

export function uploadImage(data = {}) {
  return request({
    url: "/promote/tools/uploadImage",
    method: "post",
    data: {
      file: data
    },
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export function addBanner(url = "") {
  return request({
    url: "/promote/backstage/banner/addBanner",
    method: "post",
    data: {
      bannerUrl: url
    }
  });
}

// 添加banner 按页处理
export function addEveryDayBanner(data = {}) {
  return request({
    url: "/promote/backstage/everyDayBanner/addEveryDayBanner",
    method: "post",
    data
  });
}
// 删除banner 按页处理
export function delEveryDayBanner(data = []) {
  return request({
    url: "/promote/backstage/everyDayBanner/delEveryDayBanner",
    method: "post",
    data: {
      idList: data
    }
  });
}
// 获取全部banner 按页处理
export function getAllEveryDayBanner(data = {}) {
  return request({
    url: "/promote/backstage/everyDayBanner/getAllEveryDayBanner",
    method: "post",
    data
  });
}
// 修改banner 按页处理
export function updateEveryDayBanner(data = {}) {
  return request({
    url: "/promote/backstage/everyDayBanner/updateEveryDayBanner",
    method: "post",
    data
  });
}
