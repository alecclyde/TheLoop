import React from "react";
import {
  View,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { registration } from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import { NavigationContainer } from "@react-navigation/native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { Text } from "react-native-elements";

//https://github.com/jquense/yup/issues/97#issuecomment-306547261
//checks to see if both passwords are the same
function equalTo(ref, msg) {
  return this.test({
    name: "equalTo",
    exclusive: false,
    message: msg || "Both passwords must be the same",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}

yup.addMethod(yup.string, "equalTo", equalTo);

const SignUpSchema = yup.object({
  firstName: yup.string().required("First name is a required field"),
  lastName: yup.string().required("Last name is a required field"),
  email: yup.string().email().required("Email is a required field"),
  password: yup
    .string()
    .required("Password is a required field")
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, and one number"
    ),
  password2: yup.string().equalTo(yup.ref("password")),
});

export default function SignUp({ navigation }) {
  return (
    <View>
      <View>
      <ImageBackground
        source={{
          uri: "data:image/jpeg;base64,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",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
        >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
          }}
          validationSchema={SignUpSchema}
          //What happens when you submit the form
          onSubmit={(values) => {
            registration(
              values.email,
              values.password,
              values.lastName,
              values.firstName,
              navigation
            );
          }}
        >
          {(props) => (
            <>
              <Text h5 style={{ textAlign: "center", 
              padding: 20, 
              marginTop: 120, 
              fontSize: 25,
              color: "black",
              }}>
                Become a Member of The Loop!
              </Text>
              <ScrollView onBlur={Keyboard.dismiss}>
                <Input
                  placeholder="First name*"
                  errorStyle={{ color: "white" }}
                  errorMessage={
                    props.touched.firstName && props.errors.firstName
                  }
                  value={props.values.firstName}
                  onChangeText={props.handleChange("firstName")}
                  onBlur={props.handleBlur("firstName")}
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />
                <Input
                  placeholder="Last name*"
                  errorStyle={{ color: "white" }}
                  errorMessage={props.touched.lastName && props.errors.lastName}
                  value={props.values.lastName}
                  onChangeText={props.handleChange("lastName")}
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />
                <Input
                  leftIcon={<Icon name="user" size={24} color="black" />}
                  errorStyle={{ color: "white" }}
                  errorMessage={props.touched.email && props.errors.email}
                  placeholder=" Enter your email*"
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={props.handleBlur("email")}
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />
                <Input
                  placeholder=" Enter your password*"
                  secureTextEntry={true}
                  errorStyle={{ color: "white" }}
                  errorMessage={props.touched.password && props.errors.password}
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  secureTextEntry={true}
                  onBlur={props.handleBlur("password")}
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />
                <Input
                  leftIcon={<Icon name="lock" size={24} color="black" />}
                  errorStyle={{ color: "white" }}
                  errorMessage={
                    props.touched.password2 && props.errors.password2
                  }
                  placeholder=" Retype your password to confirm*"
                  value={props.values.password2}
                  onChangeText={props.handleChange("password2")}
                  secureTextEntry={true}
                  onBlur={props.handleBlur("password2")}
                  placeholderTextColor='black'
                  selectionColor='black'
                  underlineColorAndroid='black'
                />

                <Button
                  onPress={props.handleSubmit}
                  title="Sign Up"
                  buttonStyle={{ height: 50, margin: 10 }}
                  containerStyle={{
                    marginBottom: 5,
                    borderRadius: 10, // adds the rounded corners
                  }}
                />
              </ScrollView>
            </>
          )}
        </Formik>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text h4 style={{ textAlign: "center" }}>
            or
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 150 }}>
          <Button
            icon={<Icon name="sign-in" size={15} color="white"/>}
            containerStyle={{
              borderRadius: 10, // adds the rounded corners
            }}
            title="  Sign In"
            onPress={() => navigation.navigate("LogIn")}
          ></Button>
        </View>
        </ImageBackground>
      </View>
    </View>
  );
}



// const styles = StyleSheet.create({
//   button: {
//     borderRadius: 0,
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     marginTop: 10,
//     backgroundColor: "#6bc7b8",
//     height: 50,
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//     textTransform: "capitalize",
//     fontSize: 22,
//     textAlign: "center",
//   },
// });
