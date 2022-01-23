import { ADD_EVENT } from "../constants";
import { GET_EVENTS } from "../constants";
import { REGISTER_EVENT } from "../constants";
import { UNREGISTER_EVENT } from "../constants";

import * as firebase from "firebase";
import { makeName } from "../../shared/commonMethods";

export function addEvent(newEvent) {
  // console.log("calling addEvent");
  return async function addEventThunk(dispatch, getState) {

    let event = {};
    const doc = firebase.firestore().collection("events").doc();

    // get the event creator's user data to get their name
    // (I imagine this can be easily replaced with some redux magic)
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        // console.log('returning the addEvent action');
        event = {
          name: newEvent.name,
          loop: newEvent.loop,
          // creator: currentUser.uid, // DEPRECATED, start transitioning into creatorID
          creator: {
            id: doc.id,
            name: makeName(doc.data()),
          },
          address: newEvent.address,
          recurAutomatically: false,
          recurFrequency: 1,
          // datetime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // DEPRECATED, start transitioning to startDateTime
          startDateTime: firebase.firestore.Timestamp.fromMillis(
            newEvent.startDateTime
          ),
          endDateTime: firebase.firestore.Timestamp.fromMillis(
            newEvent.startDateTime
          ), // Will want to query for actual end dateTime later
          creationTimestamp: firebase.firestore.Timestamp.now(),
          attendees: [
            {
              id: doc.id,
              name: makeName(doc.data()),
            },
          ],
          newAttendeesNotifID: "0",
          newPostsNotifID: "0",
          location: new firebase.firestore.GeoPoint(0, 0), // Temporary value, adjust when Alec/Caden finishes geolocation
        };
      });

    await firebase.firestore().collection("events").doc(doc.id).set(event);

    // lastly, add this event to the creator's list of events
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        myEvents: firebase.firestore.FieldValue.arrayUnion(doc.id)
      });
    dispatch({ type: ADD_EVENT, payload: event });
  };
}

export function getEvents() {
  return async function getEventsThunk(dispatch, getState) {
    const events = await //get events from database
    dispatch({ type: GET_EVENTS, payload: events });
  };
}

export function registerEvent(event, user) {
  return async function registerEventThunk(dispatch, getState) {
    // try {
    await firebase
      .firestore()
      .collection("events")
      .doc(event)
      .update({
        attendees: firebase.firestore.FieldValue.arrayUnion(user),
      });

    // replace this one with a hook (if I find out what Trevor meant)
    await firebase
      .firestore()
      .collection("users")
      .doc(user)
      .update({
        myEvents: firebase.firestore.FieldValue.arrayUnion(event),
      });
    updatedEvent = getState.events.find((x) => x.id === event);
    updatedEvent.attendees.push(user);
    dispatch({ type: REGISTER_EVENT, payload: updatedEvent });
    // } catch (err) {
    //   console.log(err);
    //   Alert.alert("something went wrong!", err.message);
    // }
  };
}
