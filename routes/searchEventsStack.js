import { createStackNavigator } from "@react-navigation/stack";
import SearchPage from "../screens/searchPage";
import React from "react";
import Header from "../shared/header";
import mapView from "../screens/mapView";
import CardDetails from "../screens/cardDetails";

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
        headerStyle: {
          backgroundColor: "white",
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
        name="mapView"
        component={mapView}
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
