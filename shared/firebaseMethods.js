import * as firebase from "firebase";
import * as firestore from "firebase/firestore";
import { Alert } from "react-native";
import { StackActions } from "@react-navigation/native";

export async function registration(
  email,
  password,
  lastName,
  firstName,
  navigation
) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    const db = firebase.firestore();
    db.collection("users").doc(currentUser.uid).set({
      email: currentUser.email,
      lastName: lastName,
      firstName: firstName,
      joinedLoops: [],
      distanceTolerance: 15,
      myEvents: [],
      creationTimestamp: firebase.firestore.Timestamp.now(),
    });
    //   navigation.dispatch(StackActions.pop(1));
    //   if(firebase.auth().currentUser !== null){
    navigation.navigate("userEventPreferences");
    //   }
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function signIn(email, password, navigation) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    if (firebase.auth().currentUser !== null) {
      navigation.navigate("RootStack");
    }
  } catch (err) {
    console.log(err);
    Alert.alert("There is something wrong!", "Email or Password are incorrect");
    console.log(err);
  }
}

export async function loggingOut(navigation) {
  try {
    await firebase.auth().signOut();
    navigation.navigate("LogIn");
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function setUserLoops(joinedLoops, navigation) {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    db.collection("users")
      .doc(currentUser.uid)
      .update({ joinedLoops: joinedLoops })

      .then(() => {
        navigation.navigate("RootStack");
        return true;
      });

    // probably should navigate to event page after this
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong!", err.message);
    return false;
  }
}

// Grabs a single user's data
export async function getUserData(userID) {
  try {
    const user = await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .get();
    return user.data();
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong!", err.message);
  }
}

// Creates a new event and adds the data to Firebase
// Returns true if event is successfully created, returns false otherwise
export async function createEvent(data) {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    db.collection("events")
      .add({
        name: data.name,
        loop: data.loop,
        // creator: currentUser.uid, // DEPRECATED, start transitioning into creatorID
        creatorID: currentUser.uid,
        address: data.address,
        recurAutomatically: false,
        recurFrequency: 1,
        // datetime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // DEPRECATED, start transitioning to startDateTime
        startDateTime: firebase.firestore.Timestamp.fromMillis(
          data.startDateTime
        ),
        endDateTime: firebase.firestore.Timestamp.fromMillis(
          data.startDateTime
        ), // Will want to query for actual end dateTime later
        creationTimestamp: firebase.firestore.Timestamp.now(),
        attendees: [currentUser.uid],
        newAttendeesNotifID: "0",
        newPostsNotifID: "0",
        location: new firebase.firestore.GeoPoint(0, 0), // Temporary value, adjust when Alec/Caden finishes geolocation
      })
      .then(() => {
        return true;
      });

    // probably should navigate to event page after this
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong!", err.message);
    return false;
  }
}

// Grabs a single event's data
export async function getEventData(eventID) {
  try {
    // Get some event data
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

// export async function generateUniqueFirestoreId() {
//   // Alphanumeric characters
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let autoId = "";
//   for (let i = 0; i < 20; i++) {
//     autoId += chars.charAt(Math.floor(Math.random() * chars.length));
//   }

//   return autoId;
// }

export async function sendPasswordResetEmail(email, navigation) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (err) {
    if (err.code != "auth/user-not-found") {
      console.log(err.code);
      Alert.alert("something went wrong!", err.message);
    }
  }

  Alert.alert(
    "Email sent!",
    "Check your email for instructions on how to reset your password."
  );
  navigation.pop();
}

/**
 * Registers a user for an event
 * @param eventData - The data for the event
 * @param userID - the data of the user being registered
 */
export async function registerEvent(eventData, userData) {
  try {
    // if newAttendeesNotifID is 0, then there isn't a notification waiting
    if (eventData.newAttendeesNotifID == "0") {
      // make a new notification
      await createNotification(eventData.creatorID, "new-joins", {
        eventName: eventData.eventName,
        userData: userData,
      }).then((doc) => {
        firebase
          .firestore()
          .collection("events")
          .doc(eventData.eventID)
          .update({
            attendees: firebase.firestore.FieldValue.arrayUnion(userData.userID),
            newAttendeesNotifID: doc.id,
          });
      });
    } else {
      // otherwise, update the notification object
      updateAddAttendeeNotification(eventData.newAttendeesNotifID, eventData.creatorID, userData)

      await firebase
        .firestore()
        .collection("events")
        .doc(eventData.eventID)
        .update({
          attendees: firebase.firestore.FieldValue.arrayUnion(userData.userID),
        });
    }

    // replace this one with a hook (if I find out what Trevor meant)
    await firebase
      .firestore()
      .collection("users")
      .doc(userData.userID)
      .update({
        myEvents: firebase.firestore.FieldValue.arrayUnion(eventData.eventID),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Unregisters a user for an event
 * @param eventData - The data for the event
 * @param userData - the data for the user being unregistered
 */
export async function unregisterEvent(eventData, userData) {
  try {

    await updateRemoveAttendeeNotification(eventData.newAttendeesNotifID, eventData.creatorID, userData)

    await firebase
      .firestore()
      .collection("events")
      .doc(eventData.eventID)
      .update({
        attendees: firebase.firestore.FieldValue.arrayRemove(userData.userID),
      });

    // replace this one with a hook (if I find out what Trevor meant)
    await firebase
      .firestore()
      .collection("users")
      .doc(userData.userID)
      .update({
        myEvents: firebase.firestore.FieldValue.arrayRemove(eventData.eventID),
      });

  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

export async function createPost(userID, userName, eventID, postText) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .doc(eventID)
      .collection("posts")
      .add({
        message: postText,
        posterID: userID,
        posterName: userName,
        creationTimestamp: firebase.firestore.Timestamp.now(),
        updatedTimestamp: firebase.firestore.Timestamp.now(),
        edited: false,
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

export async function editPost(eventID, postID, newMessage) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .doc(eventID)
      .collection("posts")
      .doc(postID)
      .update({
        message: newMessage,
        updatedTimestamp: firebase.firestore.Timestamp.now(),
        edited: true,
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

export async function deletePost(eventID, postID) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .doc(eventID)
      .collection("posts")
      .doc(postID)
      .delete();
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Creates a notification for a user
 * @param userID - The userID receiving the notification
 * @param notifType - The type of notification being added
 * @param notifData - The data required for creating the notification
 * @returns the documentID of the notificaton
 */
export async function createNotification(userID, notifType, notifData) {
  try {
    const doc = firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .collection("notifications")
      .doc();

    switch (notifType) {
      case "announcement":
        // create an announcement notification with notifData.eventName and notifData.creatorName
        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          creatorName: notifData.creatorName,
          seen: false,
        });
        return doc;

      case "reply":
        // man oh man I hope I can get replies working eventually
        break;

      case "event-change":
        // create an event-change notification with notifData.eventName and notifData.creatorName
        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          creatorName: notifData.creatorName,
          seen: false,
        });
        return doc;

      case "event-kick":
        // create the message for the event kick with notifData.event
        break;

      case "new-posts":
        // showstopper
        /**
         * requires a special query
         *
         * first checks the "newPostsID" value (either 0 or a document ID)
         * if 0, create a new documentID for the "new posts" notification
         *   - set the "newPostsID" value in the event to this Document ID
         *     (any future attendee notifs will be updated here)
         *   - add the document to the event creator's notifications along
         *     with an array of new attendees (probably just names)
         * if it's a documentID, add the new attendee in the notification document
         *
         * Possible case: someone leaves an event before the owner checks the notification
         */
        //
        break;

      case "new-joins":
        // showstopper
        // requires a special query that adds a userID as a new attendee
        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          newAttendees: [notifData.newUserID],
          seen: false,
        });

        return doc;

      case "user-report":
        // tbh I don't know how to do this one yet
        break;
    }
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Adds an attendee to the "new attendees" notification for the creator
 * @param notificationID - the documentID of the notification to be updated
 * @param creatorID - the userID whom the notification belongs to
 * @param newAttendeeData - the new user attending the event
 */
export async function updateAddAttendeeNotification(
  notificationID,
  creatorID,
  newAttendeeData
) {
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(creatorID)
      .collection("notifications")
      .doc(notificationID)
      .update({
        newAttendees: firebase.firestore.FieldValue.arrayUnion(newAttendeeData),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Removes an attendee to the "new attendees" notification for the creator
 * @param notificationID - the documentID of the notification to be updated
 * @param creatorID - the userID whom the notification belongs to
 * @param newAttendeeData - the new user unregistering from the event
 */
 export async function updateRemoveAttendeeNotification(
  notificationID,
  creatorID,
  newAttendeeData
) {
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(creatorID)
      .collection("notifications")
      .doc(notificationID)
      .update({
        newAttendees: firebase.firestore.FieldValue.arrayRemove(newAttendeeData),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Grabs the users notifications
 * @param userID - the userID to get notifications for
 */
export async function grabNotifications(userID) {
  try {
    const notifs = [];

    await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .collection("notifications")
      .orderBy("creationTimestamp", "desc")
      .limit(10)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() });
        });
      });

    // console.log(notifs)
    return notifs;

    // do stuff
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Copy this template for making new firebase functions
 * @param args - arguments
 */
export async function template(args) {
  try {
    // do stuff
     
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}