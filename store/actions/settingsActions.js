import { TOGGLE_DARKMODE } from "../constants";
import { TOGGLE_NOTIFICATIONS } from "../constants";


import * as firebase from "firebase";
import { Alert } from 'react-native';


export function toggleDarkmode(){
    return async function toggleDarkmodeThunk(dispatch, getState){
        dispatch({ type: TOGGLE_DARKMODE, payload: null})
    }
}

export function toggleNotifications(){
    return async function toggleNotificationsThunk(dispatch, getState){
        dispatch({ type: TOGGLE_NOTIFICATIONS, payload: null})
    }
}