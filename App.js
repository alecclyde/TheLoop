import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID,
  STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID} from '@env';
import * as firebase from 'firebase';
import { signIn } from './shared/firebaseMethods';
import SignUp from './screens/signUp';

import { LogBox } from 'react-native';
//https://github.com/firebase/firebase-js-sdk/issues/97
//https://github.com/facebook/react-native/issues/12981
LogBox.ignoreLogs(['Setting a timer'])

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

export default function App() {
  return (
    <SignUp/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
