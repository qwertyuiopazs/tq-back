import request from "@/utils/request";

export function getContactInformationList(data = {}) {
  return request({
    url: "/promote/backstage/contactInformation/getContactInformationList",
    method: "post",
    data
  });
}
export function addContactInformation(data = {}) {
  return request({
    url: "/promote/backstage/contactInformation/addContactInformation",
    method: "post",
    data
  });
}
export function delContactInformation(data = []) {
  return request({
    url: "/promote/backstage/contactInformation/delContactInformation",
    method: "post",
    data: {
      idList: data
    }
  });
}
export function updateContactInformation(data = {}) {
  return request({
    url: "/promote/backstage/contactInformation/updateContactInformation",
    method: "post",
    data
  });
}
