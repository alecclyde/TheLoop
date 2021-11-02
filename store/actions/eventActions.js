import { ADD_EVENT } from '../constants';
import { GET_EVENTS } from '../constants';
import * as firebase from "firebase";

export function addEvent(newEvent) {
    return async function addEventThunk(dispatch, getState){
        const currentUser = firebase.auth().currentUser;

        const event = firebase.firestore().collection("events").add({
            name: newEvent.name,
            loop: newEvent.loop,
            // creator: currentUser.uid, // DEPRECATED, start transitioning into creatorID
            creatorID: currentUser.uid,
            address: newEvent.address,
            recurAutomatically: false,
            recurFrequency: 1,
            // datetime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // DEPRECATED, start transitioning to startDateTime
            startDateTime: firebase.firestore.Timestamp.fromMillis(data.startDateTime),
            endDateTime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // Will want to query for actual end dateTime later
            creationTimestamp: firebase.firestore.Timestamp.now(),
            attendees: [currentUser.uid],
            location: new firebase.firestore.GeoPoint(0, 0), // Temporary value, adjust when Alec/Caden finishes geolocation
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