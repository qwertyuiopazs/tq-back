import request from "@/utils/request";

// 比赛日程
export function addGameSchedule(data) {
  return request({
    url: "/promote/backstage/gameSchedule/addGameSchedule",
    method: "post",
    data
  });
}

export function delGameSchedule(idList) {
  console.log(idList);
  return request({
    url: "/promote/backstage/gameSchedule/delGameSchedule",
    method: "post",
    data: { idList }
  });
}

export function getAllGameSchedule() {
  return request({
    url: "/promote/backstage/gameSchedule/getAllGameSchedule",
    method: "post"
  });
}

export function getGameSchedulePage(data) {
  return request({
    url: "/promote/backstage/gameSchedule/getGameSchedulePage",
    method: "post",
    data
  });
}

export function updateGameSchedule(data) {
  return request({
    url: "/promote/backstage/gameSchedule/updateGameSchedule",
    method: "post",
    data
  });
}

// 赛程类型
export function addLeagueType(data) {
  return request({
    url: "/promote/backstage/leagueType/addLeagueType",
    method: "post",
    data
  });
}
export function delLeagueType(idList) {
  return request({
    url: "/promote/backstage/leagueType/delLeagueType",
    method: "post",
    data: { idList }
  });
}
export function getAllLeagueType(data) {
  return request({
    url: "/promote/backstage/leagueType/getAllLeagueType",
    method: "post",
    data
  });
}
export function getLeagueTypePage(data) {
  return request({
    url: "/promote/backstage/leagueType/getLeagueTypePage",
    method: "post",
    data
  });
}
export function updateLeagueType(data) {
  return request({
    url: "/promote/backstage/leagueType/updateLeagueType",
    method: "post",
    data
  });
}
