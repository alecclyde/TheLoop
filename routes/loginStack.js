import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SignUp from "../screens/signUp";
import LogIn from "../screens/logIn";
import RootStack from "./tabNavigator";
import ResetPassword from "../screens/resetPassword";
import Header from "../shared/header";
import UserEventPreferences from "../screens/userEventPreferences";
import LocationPreferencesPage from "../screens/locationPreferencesPage";

//Screens in the profile tab

const Stack = createStackNavigator();

export default function LoginStack() {
  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="UserEventPreferences"
        component={UserEventPreferences}
      />
      <Stack.Screen
        name="LocationPreferencesPage"
        component={LocationPreferencesPage}
      />
      <Stack.Screen name="RootStack" component={RootStack} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
