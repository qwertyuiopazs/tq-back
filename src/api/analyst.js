import request from "@/utils/request";

export function getAnalystList(data = {}) {
  return request({
    url: "/promote/backstage/analyst/getAllAnalyst",
    method: "post",
    data
  });
}
export function addAnalyst(data = {}) {
  return request({
    url: "/promote/backstage/analyst/addAnalyst",
    method: "post",
    data
  });
}
export function delAnalyst(data = []) {
  return request({
    url: "/promote/backstage/analyst/delAnalyst",
    method: "post",
    data: {
      idList: data
    }
  });
}
export function getAnalystPage(data = {}) {
  return request({
    url: "/promote/backstage/analyst/getAnalystPage",
    method: "post",
    data
  });
}
export function updateAnalyst(data = {}) {
  return request({
    url: "/promote/backstage/analyst/updateAnalyst",
    method: "post",
    data
  });
}

// 分析内容
export function addAnalysisContent(data = {}) {
  return request({
    url: "/promote/backstage/analysisContent/addAnalysisContent",
    method: "post",
    data
  });
}
export function delAnalysisContent(data = []) {
  return request({
    url: "/promote/backstage/analysisContent/delAnalysisContent",
    method: "post",
    data: {
      idList: data
    }
  });
}
export function getAllAnalysisContent(data = {}) {
  return request({
    url: "/promote/backstage/analysisContent/getAllAnalysisContent",
    method: "post",
    data
  });
}
export function getAnalysisContentPage(data = {}) {
  return request({
    url: "/promote/backstage/analysisContent/getAnalysisContentPage",
    method: "post",
    data
  });
}
export function updateAnalysisContent(data = {}) {
  return request({
    url: "/promote/backstage/analysisContent/updateAnalysisContent",
    method: "post",
    data
  });
}

// 分析师对应战绩
export function addPromoteGameRecord(data = {}) {
  return request({
    url: "/promote/backstage/promoteGameRecord/addPromoteGameRecord",
    method: "post",
    data
  });
}

export function delPromoteGameRecord(idList = []) {
  return request({
    url: "/promote/backstage/promoteGameRecord/delPromoteGameRecord",
    method: "post",
    data: {
      idList
    }
  });
}

export function getPromoteGameRecord(data = {}) {
  return request({
    url: "/promote/backstage/promoteGameRecord/getPromoteGameRecord",
    method: "post",
    data
  });
}

export function updatePromoteGameRecord(data = {}) {
  return request({
    url: "/promote/backstage/promoteGameRecord/updatePromoteGameRecord",
    method: "post",
    data
  });
}
