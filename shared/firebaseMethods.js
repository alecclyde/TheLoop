import * as firebase from "firebase";
import * as firestore from "firebase/firestore"
import {Alert} from "react-native";
import { StackActions } from '@react-navigation/native';

export async function registration(email, password, lastName, firstName, navigation) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
  
      const db = firebase.firestore();
      db.collection("users")
        .doc(currentUser.uid)
        .set({
          email: currentUser.email,
          lastName: lastName,
          firstName: firstName,
        });
    //   navigation.dispatch(StackActions.pop(1));
    //   if(firebase.auth().currentUser !== null){
        navigation.navigate('Profile');
    //   }
    } catch (err) {
      Alert.alert("There is something wrong!", err.message);
    }
  }


export async function signIn(email, password, navigation) {
  try {
   await firebase.auth().signInWithEmailAndPassword(email, password);
      if(firebase.auth().currentUser !== null){
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
    navigation.navigate('LogIn');
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

// Grabs a single user's data
export async function getUserData(userID) {
  try {
    const user = await firebase.firestore().collection('users').doc(userID).get();
    return user.data();

  } catch (err) {
    console.log(err);
    Alert.alert('Something went wrong!', err.message);
  }
}

// Creates a new event and adds the data to Firebase
// Returns true if event is successfully created, returns false otherwise
export async function createEvent(eventName, eventLoop, eventDateTime, eventAddress, navigation) {

  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();
    const id = await generateUniqueFirestoreId();

    db.collection("events").add({
      id: id,
      name: eventName,
      loop: eventLoop,
      address: eventAddress,
      creator: currentUser.uid,
      datetime: firebase.firestore.Timestamp.fromMillis(eventDateTime),
      attendees: [currentUser.uid]
    });
    return true;

    // probably should navigate to event page after this


  } catch (err) {
    console.log(err);
    Alert.alert('Something went wrong!', err.message);
    return false;
  }
}

// Grabs a single event's data
export async function getEventData(eventID) {
  try {
    // Get some event data

  } catch (err) {
    console.log(err);
    Alert.alert('something went wrong!', err.message);
  }
}

export async function generateUniqueFirestoreId(){
  // Alphanumeric characters
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return autoId;
}