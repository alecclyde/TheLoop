import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { loggingOut, getUserData } from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import * as firebase from "firebase";

export default function Profile({ navigation, route }) {

  const email = route.params?.userData.email ?? 'email';
  const firstName = route.params?.userData.firstName ?? 'firstName';
  const lastName = route.params?.userData.lastName ?? 'lastName';
  // const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");

  // Listener to update user data
  // function AuthStateChangedListener(user) {
  //   if (user) {
  //     getUserData(user.uid).then((user) =>
  //       displayUserData(user)
  //     );
  //   } else {
  //     setEmail("");
  //     setFirstName("");
  //     setLastName("");
  //   }
  // }

  // function displayUserData(user) {
  //   setEmail(user.email);
  //   setFirstName(user.firstName);
  //   setLastName(user.lastName);
  // }

  // useEffect(() => {
  //   const unsubscriber = firebase
  //     .auth()
  //     .onAuthStateChanged(AuthStateChangedListener);

  //   return () => {
  //     unsubscriber;
  //   };
  // }, []);

  return (
    <View style={{flex: 1 }}>
      <View>
        <Text style={globalStyles.titleText}>Profile</Text>
        <Text>Email: {email}</Text>
        <Text>First Name: {firstName}</Text>
        <Text>Last Name: {lastName}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <View>
        <TouchableOpacity style={styles.button} onPress={() => loggingOut(navigation)}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
      borderRadius: 0,
      paddingVertical: 14,
      paddingHorizontal: 10,
      marginTop: 10,
      backgroundColor: "#6bc7b8",
      height: 100,
      justifyContent: "center",
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      textTransform: "capitalize",
      fontSize: 22,
      textAlign: "center",
    },
  });