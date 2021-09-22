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
import { Button } from 'react-native-elements';
import { Image } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { Text } from 'react-native-elements';

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
  },[]);
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
                {/* Email */}
                <Input
                  placeholder="Enter your email"
                  errorStyle={{ color: 'red' }}
                  errorMessage={props.touched.email && props.errors.email}
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  onBlur={props.handleBlur("email")}
                  autoCapitalize="none"
                />
                {/* Password */}
                <Input
                  placeholder="Enter your password"
                  errorStyle={{ color: 'red' }}
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
                  title = "Sign In"
                  buttonStyle = {{height: 50}}
                  containerStyle = {{ 
                    marginBottom: 5,
                    borderRadius: 10, // adds the rounded corners
                    }}
                />

                <Text>{welcomeText}</Text>
              </ScrollView>
            </>
          )}
        </Formik>

        <View style= {{flexDirection: "row", justifyContent: "center"}}>
          <Text h5 style={{textAlign: 'center', padding: 20,}} >Don't have an account?</Text>
          </View>
          <View style= {{flexDirection: "row", justifyContent: "center"}}>
          <Button 
              containerStyle = {{ 
                    borderRadius: 10, // adds the rounded corners
                    }}
          title = "Sign Up"
          onPress={() => navigation.navigate("SignUp")}>
          </Button>
        </View>
      </View>
      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

// Thanks Caden for giving me a framework for the login screen!