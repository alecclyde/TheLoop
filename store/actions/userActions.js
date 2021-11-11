import { SET_USER } from '../constants';

import * as firebase from "firebase";
import { Alert } from 'react-native';

export function registration({
    email,
    password,
    lastName,
    firstName,
    navigation
}){
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
            await firebase.auth().currentUser.collection("users").doc(currentUser.uid).set(user);
            dispatch({ type: SET_USER, payload: user});
            navigation.navigate("RootStack");
        } catch (err) {
            Alert.alert("There is something wrong!", err.message);
        }
    }
}

export function signIn(email, password, navigation){
    console.log(email, password, navigation);
    return async function signInThunk(dispatch, getState){
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = await firebase.auth().currentUser;
            if (user) {
              dispatch({ type: SET_USER, payload: user})
              navigation.navigate("RootStack");
            }
        } catch (err) {
            console.log(err);
            Alert.alert("There is something wrong!", "Email or Password are incorrect");
        }
    }
}


// export function setUser(user) {
//     return {
//         type: SET_USER,
//         payload: user
//     }
// }