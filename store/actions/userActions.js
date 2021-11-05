import { SET_USER } from '../constants';

export function registration(
    email,
    password,
    lastName,
    firstName,
    navigation
){
    return async function registrationThunk(dispatch, getState) {
        try{
            const user = {
                email: currentUser.email,
                lastName: lastName,
                firstName: firstName,
                joinedLoops: [],
                distanceTolerance: 15,
                myEvents: [],
                creationTimestamp: firebase.firestore.Timestamp.now(),
            }
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            await firebase.auth().currentUser.collection("users").doc(currentUser.uid).set(user);
            navigation.navigate("RootStack");
        } catch (err) {
            Alert.alert("There is something wrong!", err.message);
        }
        dispatch({ type: SET_USER, payload: user});
    }
}

export function signIn(email, password, navigation){
    return async function signInThunk(dispatch, getState){
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = await firebase.auth().currentUser;
            if (getState) {
              navigation.navigate("RootStack");
            }
        } catch (err) {
            console.log(err);
            Alert.alert("There is something wrong!", "Email or Password are incorrect");
        }
        dispatch({ type: SET_USER, payload: user})
    }
}


// export function setUser(user) {
//     return {
//         type: SET_USER,
//         payload: user
//     }
// }