//this file is used only for AddMeal, but should be used everywhere.
import axios from "axios";
import config from "../config";

// get user followers
export const getUserFollowers = userId => {
  return axios.get(`${config.SERVER_HOST}/api/follow/${userId}`)
};

// get user followees
export const getUserFollowees = userId => {
  return axios.get(`${config.SERVER_HOST}/api/follow/followies/${userId}`)
};


// get user followees
export const getFollowStatus = userId => {
  return axios.get(`${config.SERVER_HOST}/api/follow/${userId}`)
};


//set follow/unfollow status
export const setFollow = (myUserId, body) => {
  return axios.post(`${config.SERVER_HOST}/api/follow/${myUserId}`, body)
};


//get info about a user
export const getUserInfo = (userId) => {
  return axios.get(`${config.SERVER_HOST}/api/users/${userId}`)
};

//get info about a user
export const getUserImages = (userId) => {
  return axios.get(`${config.SERVER_HOST}/api/images/gallery/${userId}`)
};
