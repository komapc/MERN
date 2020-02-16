import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// add a meal
export const addMeal = (userData, history) => dispatch => {
  axios
    .post("/api/meals/addMeal", userData)
    //.then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get
export const getMeals = mealData => dispatch => {
  axios
    .get("/api/meals/get", mealData)
    .then(res => {
     dispatch(res); 
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// add a meal
export const joinMeal = (attendData, history) => dispatch => {
  axios
    .post("/api/attends/", attendData)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// add a meal
export const getAttendsByMeal = (attendData, history) => dispatch => {
  axios
    .get("/api/attends/", attendData)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};



// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
