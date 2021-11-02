import React from "react";
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
} from "@env";
import * as firebase from "firebase";
import LoginStack from "./routes/loginStack";
import * as Location from "expo-location";
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import configureStore from './store/configureStore';

import { LogBox } from "react-native";
//https://github.com/firebase/firebase-js-sdk/issues/97
//https://github.com/facebook/react-native/issues/12981
LogBox.ignoreLogs(["Setting a timer"]);

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const store = configureStore();

export default function App() {
  return (
    <Provider store = { store }>
      <NavigationContainer>
        <LoginStack />
      </NavigationContainer>
    </Provider>
  );
}
