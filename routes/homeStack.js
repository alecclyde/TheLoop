import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home";
import CardDetails from "../screens/cardDetails";
import React from "react";
import Header from "../shared/header";
import { withTheme } from "react-native-elements";
import {SafeAreaView} from "react-native";
import { Platform } from 'react-native';
import {StyleSheet} from "react-native";
//Screens in the Home tab

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      // screenOptions={{ headerShown: false}}
      screenOptions={{
        cardStyle: {
          backgroundColor: "#fefefe",
        },
        paddingTop: 0,
        headerLeft: () => null,
        headerTitleAlign: "center",
        headerTopInsetEnabled: true,
        headerBackTitle: null,
        headerTintColor: "black",
        headerTitleStyle: {
          color: "white",
        },
        headerStyle: {
          backgroundColor: "#2C2C2C",
          // height: 100,
          height: Platform.select({
    android: 90
  }),
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />,
          };
        }}
      />
      
      <Stack.Screen

        name="CardDetails"
        component={CardDetails}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
    
  );
}