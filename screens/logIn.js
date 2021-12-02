import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
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

  // function AuthStateChangedListener(user) {
  //   if (user) {
  //     getUserData(user.uid).then((user) => {
  //       navigation.navigate("RootStack", { userData: user });
  //     });
  //   }
  // }
  // useEffect(() => {
  //   const unsubscriber = firebase
  //     .auth()
  //     .onAuthStateChanged(AuthStateChangedListener);

  //   return () => {
  //     unsubscriber;
  //   };
  // });

  // if(userLoaded){
  return (
    <View>
      <View style={{ flex: 1 }} />
      <View>
      <ImageBackground
        source={{
          uri: "data:image/jpeg;base64,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",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
        >
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            signIn(values.email, values.password, navigation);
          }}
        >
          {(props) => (
            <>
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 100, marginBottom: 40 }}>
                <Image
                  source={require("../assets/The-Loop-8.png")}
                  style={{
                    width: 380,
                    height: 170,
                    marginRight: 10,
                    marginBottom: 15,
                    marginTop: 10,
                  }}
                />
              </View>
                {/* Email */}
                <Input
                  placeholder="Enter your email"
                  errorStyle={{ color: "white" }}
                  errorMessage={props.touched.email && props.errors.email}
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  onBlur={props.handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  color= "black"
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />
                {/* Password */}
                <Input
                  placeholder="Enter your password"
                  errorStyle={{ color: "white" }}
                  errorMessage={props.touched.password && props.errors.password}
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  onBlur={props.handleBlur("password")}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  color= "black"
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />
                {/* Sign-in Button */}
                <Button
                  onPress={props.handleSubmit}
                  title="Sign In"
                  buttonStyle={{ height: 50, margin: 8 }}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 10, // adds the rounded corners
                  }}
                />
              </>
              
          )}
        </Formik>
        <View style={{ alignItems: "center" }}>
          <Text h5 style={{ textAlign: "center", padding: 20, marginTop: 65, }}>
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
        <View style={{ alignItems: "center", marginBottom: 70 }}>
          <Button
            containerStyle={{
              borderRadius: 10, // adds the rounded corners
            }}
            title="Reset Password"
            onPress={() => navigation.navigate("ResetPassword")}
          ></Button>
        </View>
        </ImageBackground>
      </View>
      <View style={{ flex: 1 }} />
    </View>
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
