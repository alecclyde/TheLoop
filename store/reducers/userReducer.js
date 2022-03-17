import { SET_USER } from "../constants";
import { REMOVE_USER } from "../constants";
import { SET_LOCATION } from "../constants";
import { ADD_DISTANCE } from "../constants";

const initialState = {  
  email: null,
  loggedIn: false,
  firstName: null,
  lastName: null,
  distanceTolerance: null,
  location: {},
  myEvents: [],
  joinedLoops: [],
  profilePicSource: "https://p.kindpng.com/picc/s/678-6789790_user-domain-general-user-avatar-profile-svg-hd.png"
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case REMOVE_USER:
      return initialState;
    case SET_LOCATION:
      return {
      ...state,
      location: {longitude: action.payload.longitude, latitude: action.payload.latitude}
      }
    case ADD_DISTANCE:
      return {
        ...state,
        distanceTolerance: action.payload
      };
    default:
      return state;
  }
};
export default userReducer;

