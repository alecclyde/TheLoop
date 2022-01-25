import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SignUp from "../screens/signUp";
import LogIn from "../screens/logIn";
import RootStack from "./tabNavigator";
import ResetPassword from "../screens/resetPassword";
import Header from "../shared/header";
import userEventPreferences from "../screens/userEventPreferences";
import locationPreferencesPage from "../screens/locationPreferencesPage";

//Screens in the profile tab

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="userEventPreferences"
        component={userEventPreferences}
      />
      <Stack.Screen
        name="locationPreferencesPage"
        component={locationPreferencesPage}
      />
      <Stack.Screen name="RootStack" component={RootStack} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
