import { SET_USER } from "../constants";
import { UPDATE_USER } from "../constants";
import { REMOVE_USER } from "../constants";
import { ADD_DISTANCE } from "../constants";
import { SET_LOCATION } from "../constants";
import { UPDATE_PFP_SOURCE } from "../constants";
import { SET_USER_LOOPS } from "../constants";
import * as firebase from "firebase";
import { Alert } from "react-native";

export function registration(email, password, lastName, firstName, navigation) {
  return async function registrationThunk(dispatch, getState) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = await firebase.auth().currentUser;
      const user = await {
        email: currentUser.email,
        lastName: lastName,
        firstName: firstName,
        joinedLoops: [],
        distanceTolerance: 1,
        myEvents: [],
        location: [],
        creationTimestamp: firebase.firestore.Timestamp.now(),
      };
      await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .set(user);
      dispatch({ type: SET_USER, payload: { ...user, uid: currentUser.uid } });
      navigation.navigate("UserEventPreferences");
      console.log("registration ogre");
    } catch (err) {
      Alert.alert("There is something wrong!", err.message);
    }
  };
}

export function signIn(email, password, navigation) {
  return async function signInThunk(dispatch, getState) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const currentUser = await firebase.auth().currentUser;

      const user = await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get();

      //console.log(user.data());
      dispatch({
        type: SET_USER,
        payload: { ...user.data(), uid: currentUser.uid },
      });
      navigation.navigate("RootStack");
    } catch (err) {
      console.log(err);
      Alert.alert(
        "There is something wrong!",
        "Email or Password are incorrect"
      );
    }
  };
}

export function signOut(navigation) {
  return async function signOutThunk(dispatch, getState) {
    try {
      await firebase.auth().signOut();
      navigation.navigate("LogIn");
      dispatch({ type: REMOVE_USER });
    } catch (err) {
      console.log(err);
      Alert.alert("SignOut error!", err.message);
    }
  };
}

export function setUserLoops(joinedLoops) {
  return async function signOutThunk(dispatch, getState) {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();

    const user = db
      .collection("users")
      .doc(currentUser.uid)
      .update({ joinedLoops: joinedLoops })
    //console.log(user);
    dispatch({ type: SET_USER_LOOPS , payload: joinedLoops});
    // probably should navigate to event page after this
  };
}

export function addDistance(values, navigation) {
  return async function addDistanceThunk(dispatch, getState) {
    await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .update({distanceTolerance: values})

    dispatch({ type: ADD_DISTANCE, payload: values });
    navigation.navigate("RootStack");
  };
}

export function setLocation(latitude, longitude) {
  return async function setLocationThunk(dispatch, getState){
    await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .update({location: new firebase.firestore.GeoPoint(latitude, longitude)})

    dispatch({ type: SET_LOCATION, payload: {latitude, longitude}})
  }
}

export function updatePfpSource(pfpSource) {
  return async function updatePfpSourceThunk(dispatch, getState) {

    dispatch({ type: UPDATE_PFP_SOURCE, payload: pfpSource})
  }
}