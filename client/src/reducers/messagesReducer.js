import { SET_MESSAGES_COUNT } from "../actions/types";

const initialState = 0;

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGES_COUNT:
      console.log("messages reducer: SET_MESSAGES_COUNT, " + JSON.stringify(action.messagesCount));
      return action.messagesCount;
    default:
      return state;
  }
}
