import React from "react";
import {
  View,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import { NavigationContainer } from "@react-navigation/native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { Text } from "react-native-elements";
import { registration } from "../store/actions/userActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

function SignUp(props, { navigation }) {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View>
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
            props.registration(
              values.email,
              values.password,
              values.lastName,
              values.firstName,
              props.navigation
            );
          }}
        >
          {(props) => (
            <>
              <Text h5 style={{ textAlign: "center", padding: 20 }}>
                Become a Member of The Loop!
              </Text>
              <ScrollView onBlur={Keyboard.dismiss}>
                <Input
                  placeholder="First name*"
                  errorStyle={{ color: "red" }}
                  errorMessage={
                    props.touched.firstName && props.errors.firstName
                  }
                  value={props.values.firstName}
                  onChangeText={props.handleChange("firstName")}
                  onBlur={props.handleBlur("firstName")}
                />
                <Input
                  placeholder="Last name*"
                  errorStyle={{ color: "red" }}
                  errorMessage={props.touched.lastName && props.errors.lastName}
                  value={props.values.lastName}
                  onChangeText={props.handleChange("lastName")}
                />
                <Input
                  leftIcon={<Icon name="user" size={24} color="black" />}
                  errorStyle={{ color: "red" }}
                  errorMessage={props.touched.email && props.errors.email}
                  placeholder=" Enter your email*"
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={props.handleBlur("email")}
                />
                <Input
                  placeholder=" Enter your password*"
                  secureTextEntry={true}
                  errorStyle={{ color: "red" }}
                  errorMessage={props.touched.password && props.errors.password}
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  secureTextEntry={true}
                  onBlur={props.handleBlur("password")}
                />
                <Input
                  leftIcon={<Icon name="lock" size={24} color="black" />}
                  errorStyle={{ color: "red" }}
                  errorMessage={
                    props.touched.password2 && props.errors.password2
                  }
                  placeholder=" Retype your password to confirm*"
                  value={props.values.password2}
                  onChangeText={props.handleChange("password2")}
                  secureTextEntry={true}
                  onBlur={props.handleBlur("password2")}
                />

                <Button
                  onPress={props.handleSubmit}
                  title="Sign Up"
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

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text h4 style={{ textAlign: "center" }}>
            or
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            icon={<Icon name="sign-in" size={15} color="white" />}
            containerStyle={{
              borderRadius: 10, // adds the rounded corners
            }}
            title="  Sign In"
            onPress={() => props.navigation.navigate("LogIn")}
          ></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#6bc7b8",
    height: 50,
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

const mapStateToProps = state => ({
  users: state.user
});

const mapDispatchToProps = (dispatch) => ({
  registration: (email, password, lastName, firstName, navigation) => dispatch(registration(email, password, lastName, firstName, navigation))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);