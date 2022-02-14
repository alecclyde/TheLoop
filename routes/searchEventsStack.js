import { createStackNavigator } from "@react-navigation/stack";
import SearchPage from "../screens/searchPage";
import MapView from "../screens/mapView";
import React from "react";
import Header from "../shared/header";

//Screens in the search tab

const Stack = createStackNavigator();

export default function SearchEventsStack() {
  return (
    <Stack.Navigator
      initialRouteName="SearchPage"
      screenOptions={{
        cardStyle: {
          backgroundColor: "#fefefe",
        },
        headerLeft: () => null,
        headerTitleAlign: "center",
        headerBackTitle: null,
        headerTintColor: "black",
        headerTitleStyle: {
          color: "white",
        },
        headerStyle: {
          backgroundColor: "#2C2C2C",
        },
      }}
    >
      <Stack.Screen
        name="Map"
        component={SearchPage}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />,
          };
        }}
      />
      <Stack.Screen
        name="MapView"
        component={MapView}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />,
          };
        }}
      />
    </Stack.Navigator>
  );
}
