import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { signIn, getUserData } from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";

import * as firebase from "firebase";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

const LoginSchema = yup.object({
  email: yup.string().email().required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});

export default function Login({ navigation }) {
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
    if(firebase.auth().currentUser !== null){
      navigation.navigate("RootStack");
    }
  }),[]
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1 }} />
      <View>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            signIn(values.email, values.password, navigation);
          }}
        >
          {(props) => (
            <>
              <Text style={globalStyles.titleText}>Welcome to The Loop!</Text>
              <ScrollView onBlur={Keyboard.dismiss}>
                {/* Email */}
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter your email"
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={props.handleBlur("email")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.email && props.errors.email}
                </Text>

                {/* Password */}
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter your password"
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  secureTextEntry={true}
                  onBlur={props.handleBlur("password")}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.password && props.errors.password}
                </Text>

                {/* Sign-in Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={props.handleSubmit}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <Text>{welcomeText}</Text>
              </ScrollView>
            </>
          )}
        </Formik>
        
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{color: 'blue'}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      {/* <View>
        <TouchableOpacity style={styles.button} onPress={loggingOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

// Thanks Caden for giving me a framework for the login screen!

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
