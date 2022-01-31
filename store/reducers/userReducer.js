import { SET_USER } from "../constants";
import { REMOVE_USER } from "../constants";

const initialState = {  
  loggedIn: false,
  email: null,
  lastName: null,
  firstName: null,
  joinedLoops: [],
  distanceTolerance: 15,
  myEvents: [],
  creationTimestamp: null,
  uid: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case REMOVE_USER:
      return initialState;
    default:
      return state;
  }
};
export default userReducer;

