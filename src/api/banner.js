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
