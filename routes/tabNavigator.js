import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as firebase from 'firebase';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';



// stacks
import HomeStack from './homeStack';
import EventCreationStack from './eventCreationStack';
import NotificationsStack from './notificationsStack';
import ProfileStack from './profileStack';
import SearchEventsStack from './searchEventsStack';

const Tab = createBottomTabNavigator();
export default function RootStack() {
    return (
      <Tab.Navigator
        initialRouteName="Profile"
        screenOptions={{ headerShown: false,tabBarActiveBackgroundColor:'#FF8C00'}}
        options={{}}
        labeled={false}
        showLabel={false}
      >
        <Tab.Screen
          name='HomeStack'
          component={HomeStack}
          options={{backgroundColor: 'orange',title: '',  tabBarIcon: ({ color, size }) => (
            <Icon
            raised
            size= {30}
            color= "black"
            name="home"  />)
        }}
          
        />
        <Tab.Screen
          name='ProfileStack'
          component={ProfileStack}
          options={{title: '', tabBarIcon: ({ color, size }) => (
            <Icon
            raised
            size= {30}
            color= "black"
            name="user"  />)}}
        />
        <Tab.Screen
          name='EventCreationStack'
          component={EventCreationStack}
          options={{title: '',  tabBarIcon: ({ color, size }) => (
            <Icon
            raised
            size= {30}
            color= "black"
            name="plus"  />)}}
        />
        <Tab.Screen
          name='SearchEvents'
          component={SearchEventsStack}
          options={{title: '',  tabBarIcon: ({ color, size }) => (
            <Icon
            raised
            size= {30}
            color= "black"
            name="search"  />)}}
        />
        <Tab.Screen
          name='Notifications'
          component={NotificationsStack}
          options={{title: '',  tabBarIcon: ({ color, size }) => (
            <Icon
            raised
            size= {30}
            color= "black"
            name="bell-o"  />)}}
        />
      </Tab.Navigator>
    );
}
