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

export default function Profile({ navigation }) {

  const email = firebase.auth().currentUser.email;
  const firstName = firebase.auth().currentUser.firstName;
  const lastName = firebase.auth().currentUser.lastName;

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