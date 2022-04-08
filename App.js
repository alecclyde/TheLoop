import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
  PLACES_ID,
} from "@env";
import * as firebase from "firebase";
import RootStack from "./routes/tabNavigator";
import LoginStack from "./routes/loginStack";
import AppLoading from 'expo-app-loading';
import * as Location from "expo-location";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./store/configureStore";

import { LogBox } from "react-native";
//https://github.com/firebase/firebase-js-sdk/issues/97
//https://github.com/facebook/react-native/issues/12981
LogBox.ignoreLogs(["Setting a timer"]);
//github.com/firebase/firebase-js-sdk/issues/1847#:~:text=When%20using%20Firebase%20on%20React,authentication%20session%20across%20app%20restarts.&text=59%20AsyncStorage%20is%20deprecated%20from,%2Dnative%2Dasync%2Dstorage%20.
LogBox.ignoreLogs(["AsyncStorage"]);

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  placesId: API_KEY,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}


export default function App() {
  const [isSignedIn, setIsSignedIn] = useState();
  const [isLoading, setLoading] = useState(true);

  firebase.auth().onAuthStateChanged(function(user) {
    //setLoading(true);
    if (user) {
      setIsSignedIn(true);
      setLoading(false);
    } else {
      setIsSignedIn(false);
      setLoading(false);
    }
  });

  if(isLoading){
    return(<AppLoading />);
  }

  return(
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate persistor={persistor}>
          { isSignedIn ? (<RootStack />) : (<LoginStack />) }
        </PersistGate>
      </NavigationContainer>
    </Provider>
  )
}
