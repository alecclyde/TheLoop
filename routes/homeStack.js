import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home";
import CardDetails from "../screens/cardDetails";
import React from "react";
import Header from "../shared/header";

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
        headerLeft: () => null,
        headerTitleAlign: "center",

        headerBackTitle: null,
        headerTintColor: "black",
        headerStyle: {
          backgroundColor: "#2C2C2C",
          height: 100,
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
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />,
          };
        }}
      />
    </Stack.Navigator>
  );
}
