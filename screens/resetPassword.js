import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { sendPasswordResetEmail, getUserData } from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import { Button } from 'react-native-elements';
import { Image } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { Text } from 'react-native-elements';
import AppLoading from 'expo-app-loading';

import * as firebase from "firebase";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

const PasswordResetSchema = yup.object({
  email: yup.string().email().required("Please enter your email"),
  // password: yup.string().required("Please enter your password"),
});

export default function ResetPassword({ navigation }) {
  // const [welcomeText, setWelcomeText] = useState("");
  // const [user, setUser] = useState("");
  // const [userLoaded, setUserLoaded] = useState(false);
  // const getUser = async () => getUserData(firebase.auth().currentUser.uid).then((user) => setUser(user))
  // console.log(user);

  function AuthStateChangedListener(user) {
    if (user) {
      getUserData(user.uid).then((user) => {
        navigation.navigate("RootStack", {userData: user})
      }
      );
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
            initialValues={{ email: "" }}
            validationSchema={PasswordResetSchema}
            onSubmit={(values) => {
              sendPasswordResetEmail(values.email, navigation);
            }}
          >
            {(props) => (
              <>
              <View style= {{flexDirection: "row", justifyContent: "center"}}>
              
            <Image
                source={require("../assets/Logo_Cropped.png")}
                style={{
                width: 90,
                height: 90,
                marginRight: 10,
                marginBottom: 60,
                marginTop: 12}}
              />
            </View>
                <ScrollView onBlur={Keyboard.dismiss}>
                <Text style={globalStyles.titleText}>Forgot your password?</Text>
                <Text style={globalStyles.footerText}>Enter your email address below. We'll send an email with instructions on how to reset your password.</Text>
                  {/* Email */}
                  <Input
                    placeholder="Enter your email"
                    errorStyle={{ color: 'red' }}
                    errorMessage={props.touched.email && props.errors.email}
                    value={props.values.email}
                    onChangeText={props.handleChange("email")}
                    onBlur={props.handleBlur("email")}
                    autoCapitalize="none"
                    keyboardType="email-address"

                  />

                  {/* Sign-in Button */}
                  <Button
                    onPress={props.handleSubmit}
                    title = "Reset Password"
                    buttonStyle = {{height: 50}}
                    containerStyle = {{ 
                      marginBottom: 5,
                      borderRadius: 10, // adds the rounded corners
                      }}
                  />

                  {/* <Text>{welcomeText}</Text> */}
                </ScrollView>
              </>
            )}
          </Formik>
          <View style= {{flexDirection: "row", justifyContent: "center"}}>
            <Text h5 style={{textAlign: 'center', padding: 20,}} >Already have an account?</Text>
            </View>
            <View style= {{flexDirection: "row", justifyContent: "center"}}>
            <Button 
                containerStyle = {{ 
                      borderRadius: 10, // adds the rounded corners
                      }}
            title = "Sign In"
            onPress={() => navigation.pop()}>
            </Button>
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
