import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { signIn, getUserData } from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import { Button } from "react-native-elements";
import { Image } from "react-native-elements";
import { Input } from "react-native-elements";
import { Text } from "react-native-elements";
import AppLoading from "expo-app-loading";

import * as firebase from "firebase";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

const LoginSchema = yup.object({
  email: yup.string().email().required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});

export default function Login({ navigation }) {
  // const [user, setUser] = useState("");
  // const [userLoaded, setUserLoaded] = useState(false);
  // const getUser = async () => getUserData(firebase.auth().currentUser.uid).then((user) => setUser(user))
  // console.log(user);

  function AuthStateChangedListener(user) {
    if (user) {
      getUserData(user.uid).then((user) => {
        navigation.navigate("RootStack", { userData: user });
      });
    }
  }
  useEffect(() => {
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(AuthStateChangedListener);

    return () => {
      unsubscriber;
    };
  });

  // if(userLoaded){
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
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Image
                  source={require("../assets/The-Loop-4.png")}
                  style={{
                    width: 150,
                    height: 150,
                    marginRight: 10,
                    marginBottom: 15,
                    marginTop: 12,
                  }}
                />
              </View>
              <ScrollView onBlur={Keyboard.dismiss}>
                {/* Email */}
                <Input
                  placeholder="Enter your email"
                  errorStyle={{ color: "red" }}
                  errorMessage={props.touched.email && props.errors.email}
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  onBlur={props.handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {/* Password */}
                <Input
                  placeholder="Enter your password"
                  errorStyle={{ color: "red" }}
                  errorMessage={props.touched.password && props.errors.password}
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  onBlur={props.handleBlur("password")}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
                {/* Sign-in Button */}
                <Button
                  onPress={props.handleSubmit}
                  title="Sign In"
                  buttonStyle={{ height: 50 }}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 10, // adds the rounded corners
                  }}
                />

              </ScrollView>
            </>
          )}
        </Formik>
        <View style={{ alignItems: "center" }}>
          <Text h5 style={{ textAlign: "center", padding: 20 }}>
            Don't have an account?
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Button
            containerStyle={{
              borderRadius: 10, // adds the rounded corners
            }}
            title="Sign Up"
            onPress={() => navigation.navigate("SignUp")}
          ></Button>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text h5 style={{ textAlign: "center", padding: 20 }}>
            Forgot your password?
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Button
            containerStyle={{
              borderRadius: 10, // adds the rounded corners
            }}
            title="Reset Password"
            onPress={() => navigation.navigate("ResetPassword")}
          ></Button>
        </View>
      </View>
      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
  // }else{
  //   return(
  //     <AppLoading
  //     startAsync={getUser}
  //     onFinish={() => setUserLoaded(true)}
  //     onError={console.warn}
  //   />
  //   )
  // }
}

// Thanks Caden for giving me a framework for the login screen!
