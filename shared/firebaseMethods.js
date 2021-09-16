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
        navigation.navigate('Profile', {user: getUserData(currentUser.uid)});
    //   }
    } catch (err) {
      Alert.alert("There is something wrong!", err.message);
    }
  }


export async function signIn(email, password, navigation) {
  try {
   await firebase.auth().signInWithEmailAndPassword(email, password);
      if(firebase.auth().currentUser !== null){
        userData = getUserData(firebase.auth().currentUser.uid)
        console.log(userData);
        navigation.navigate("RootStack", {userData: userData});
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
    const user = await firebase.firestore().collection('users').doc(userID).get().then((result) => console.log(result));
    return user.data();

  } catch (err) {
    console.log(err);
    Alert.alert('Something went wrong!', err.message);
  }
}