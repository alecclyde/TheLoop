import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as firebase from "firebase";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// stacks
import HomeStack from "./homeStack";
import EventCreationStack from "./eventCreationStack";
import NotificationsStack from "./notificationsStack";
import ProfileStack from "./profileStack";
import SearchEventsStack from "./searchEventsStack";

const Tab = createBottomTabNavigator();
export default function RootStack() {
  return (
    <SafeAreaProvider>
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        
        headerShown: false,
        tabBarActiveBackgroundColor: "#ffa835",
        tabBarInactiveBackgroundColor: "#2C2C2C",
        tabBarStyle: { height: 110},
      }}
      options={{}}
      labeled={false}
      showLabel={false}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          backgroundColor: "orange",
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Icon raised size={30} color="white" name="home" />
          ),
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
        }}
      />
      
    </Tab.Navigator>
    </SafeAreaProvider>
  );
}
