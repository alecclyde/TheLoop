import { ADD_EVENT } from '../constants';
import { GET_EVENTS } from '../constants';
import { REGISTER_EVENT } from '../constants';
import { UNREGISTER_EVENT } from '../constants';

import * as firebase from "firebase";

export function addEvent(newEvent) {
    // console.log("calling addEvent");
    return async function addEventThunk(dispatch, getState){
        const currentUser = firebase.auth().currentUser;
        // console.log('returning the addEvent action');
        const event = {
            'name': newEvent.name,
            'loop': newEvent.loop,
            // creator: currentUser.uid, // DEPRECATED, start transitioning into creatorID
            'creatorID': currentUser.uid,
            'address': newEvent.address,
            'recurAutomatically': false,
            'recurFrequency': 1,
            // datetime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // DEPRECATED, start transitioning to startDateTime
            'startDateTime': firebase.firestore.Timestamp.fromMillis(newEvent.startDateTime),
            'endDateTime': firebase.firestore.Timestamp.fromMillis(newEvent.startDateTime), // Will want to query for actual end dateTime later
            'creationTimestamp': firebase.firestore.Timestamp.now(),
            'attendees': [currentUser.uid],
            'location': new firebase.firestore.GeoPoint(0, 0), // Temporary value, adjust when Alec/Caden finishes geolocation
        }
        await firebase.firestore().collection("events").add(event);
        dispatch({ type: ADD_EVENT, payload: event});            
    }
}

export async function getEvents() {
    return async function getEventsThunk(dispatch, getState){
        const events = await //get events from database
        dispatch({ type: GET_EVENTS, payload: events});
    }
}

export async function registerEvent(event, user){
    return async function registerEventThunk(dispatch, getState){
        try {
            await firebase.firestore().collection("events").doc(event).update({
              attendees: firebase.firestore.FieldValue.arrayUnion(user)
            })
            
            // replace this one with a hook (if I find out what Trevor meant)
            await firebase.firestore().collection("users").doc(user).update({
              myEvents: firebase.firestore.FieldValue.arrayUnion(event)
            })

            console.log(getState);
        
          } catch (err) {
            console.log(err);
            Alert.alert("something went wrong!", err.message);
          }
        dispatch({ type: REGISTER_EVENT, payload: {event, user}})
    }
}