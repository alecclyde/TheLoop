import { TOGGLE_DARKMODE } from "../constants";
import { TOGGLE_NOTIFICATIONS } from "../constants";

const initialState = {
    darkMode: true,
    pushNotifications: true,
};

const settingsReducer = (state = initialState, action) => {
    switch(action.type) {
        case TOGGLE_DARKMODE:
            return {
                ...state,
                darkMode: !state.darkMode
            }
        case TOGGLE_NOTIFICATIONS:
            return {
                ...state,
                pushNotifications: !state.pushNotifications
            }
    default:
        return state;
    }
}
export default settingsReducer;
