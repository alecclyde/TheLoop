import { createStackNavigator } from "@react-navigation/stack";
import SearchPage from "../screens/searchPage";
import CardDetails from "../screens/cardDetails";
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
        name="Search Page"
        component={SearchPage}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />,
            headerLeft: () => null,
          };
        }}
      />
      <Stack.Screen
        name="MapView"
        component={MapView}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />,
            headerBackTitleStyle: {
              color: "white",
            },
            headerTintColor: {color: "white"}
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
