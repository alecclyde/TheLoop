import { ADD_EVENT } from '../constants';
import { GET_EVENTS } from '../constants';
import * as firebase from "firebase";

export function addEvent(newEvent) {
    return async function addEventThunk(dispatch, getState){
        const currentUser = firebase.auth().currentUser;
        const id = await generateUniqueFirestoreId();

        const event = firebase.firestore().collection("events").add({
            id: id,
            name: newEvent.eventName,
            loop: newEvent.eventLoop,
            address: newEvent.eventAddress,
            creator: currentUser.uid,
            datetime: firebase.firestore.Timestamp.fromMillis(newEvent.eventDateTime),
            attendees: [currentUser.uid],
        });
        dispatch({ type: ADD_EVENT, payload: event})
    }
}

export async function getEvents() {
    return async function getEventsThink(dispatch, getState){
        const events = await //get events from database
        dispatch({ type: GET_EVENTS, payload: events});
    }
}