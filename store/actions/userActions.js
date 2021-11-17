import { SET_USER } from '../constants';

import * as firebase from "firebase";
import { Alert } from 'react-native';

export function registration(
    email,
    password,
    lastName,
    firstName,
    navigation
){
    return async function registrationThunk(dispatch, getState) {
        try{
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            const currentUser = await firebase.auth().currentUser;
            const user = await {
                email: currentUser.email,
                lastName: lastName,
                firstName: firstName,
                joinedLoops: [],
                distanceTolerance: 15,
                myEvents: [],
                creationTimestamp: firebase.firestore.Timestamp.now(),
            }
            await firebase.firestore().collection("users").doc(currentUser.uid).set(user);
            dispatch({ type: SET_USER, payload: user});
            navigation.navigate("RootStack");
        } catch (err) {
            Alert.alert("There is something wrong!", err.message);
        }
    }
}

export function signIn(email, password, navigation){
    return async function signInThunk(dispatch, getState){
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            const currentUser = await firebase.auth().currentUser;
            
            const user = await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();

            //console.log(user.data());
            dispatch({ type: SET_USER, payload: user.data()})
              navigation.navigate("RootStack");
        } catch (err) {
            console.log(err);
            Alert.alert("There is something wrong!", "Email or Password are incorrect");
        }
    }
}

export function signOut(navigation){
    return async function signOutThunk(dispatch, getState){
        await firebase.auth().signOut();
        navigation.navigate("LogIn");
        dispatch({ type: REMOVE_USER, payload: null})
    }
}


// export function setUser(user) {
//     return {
//         type: SET_USER,
//         payload: user
//     }
// }