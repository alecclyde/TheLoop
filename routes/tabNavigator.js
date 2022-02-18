import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {SafeAreaView} from "react-native";
import * as firebase from "firebase";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
// stacks
import HomeStack from "./homeStack";
import EventCreationStack from "./eventCreationStack";
import NotificationsStack from "./notificationsStack";
import ProfileStack from "./profileStack";
import SearchEventsStack from "./searchEventsStack";

const Tab = createBottomTabNavigator();
export default function RootStack() {
  return (
    
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: "#2B7D9C",
        tabBarInactiveBackgroundColor: "#3B4046",
        tabBarStyle: {flex: .11, paddingBottom:0, borderTopWidth: 0},
      }}
      
      labeled={false}
      showLabel={false}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Icon raised size={30} color="white" name="home" />
          ),
          tabBarIconStyle: {marginTop: 10}
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Icon raised size={30} color="white" name="user" />
          ),
          tabBarIconStyle: {marginTop: 10}

        }}
      />
      <Tab.Screen
        name="EventCreationStack"
        component={EventCreationStack}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Icon raised size={30} color="white" name="plus" />
          ),
          tabBarIconStyle: {marginTop: 13}
        }}
      />
      <Tab.Screen
        name="SearchEvents"
        component={SearchEventsStack}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Icon raised size={30} color="white" name="search" />
          ),
          tabBarIconStyle: {marginTop: 10}
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationsStack}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Icon raised size={30} color="white" name="bell-o" />
          ),
          tabBarIconStyle: {marginTop: 10}
        }}
      />
    </Tab.Navigator>

  );
}
