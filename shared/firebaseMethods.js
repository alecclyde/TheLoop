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
    navigation.navigate("RootStack");
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
export async function createEvent(
  data
) {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    db.collection("events").add({
      name: data.name,
      loop: data.loop,
      // creator: currentUser.uid, // DEPRECATED, start transitioning into creatorID
      creatorID: currentUser.uid,
      address: data.address,
      recurAutomatically: false,
      recurFrequency: 1,
      // datetime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // DEPRECATED, start transitioning to startDateTime
      startDateTime: firebase.firestore.Timestamp.fromMillis(data.startDateTime),
      endDateTime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // Will want to query for actual end dateTime later
      creationTimestamp: firebase.firestore.Timestamp.now(),
      attendees: [currentUser.uid],
      location: new firebase.firestore.GeoPoint(0, 0), // Temporary value, adjust when Alec/Caden finishes geolocation
    }).then(() => {
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

export async function registerEvent(event, user) {
  try {
    await firebase.firestore().collection("events").doc(event).update({
      attendees: firebase.firestore.FieldValue.arrayUnion(user)
    })
    
    // replace this one with a hook (if I find out what Trevor meant)
    await firebase.firestore().collection("users").doc(user).update({
      myEvents: firebase.firestore.FieldValue.arrayUnion(event)
    })

  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

export async function unregisterEvent(event, user) {
  try {
    await firebase.firestore().collection("events").doc(event).update({
      attendees: firebase.firestore.FieldValue.arrayRemove(user)
    })
    // replace this one with a hook (if I find out what Trevor meant)
    await firebase.firestore().collection("users").doc(user).update({
      myEvents: firebase.firestore.FieldValue.arrayRemove(event)
    })

  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

export async function createPost(userID, userName, eventID, postText) {
  try {
    await firebase.firestore().collection("posts").doc(eventID).collection("posts").add({
      message: postText,
      posterID: userID,
      posterName: userName,
      creationTimestamp: firebase.firestore.Timestamp.now(),
      updatedTimestamp: firebase.firestore.Timestamp.now(),
      edited: false



    })
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}