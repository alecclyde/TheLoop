import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as firebase from 'firebase';
import React from 'react';

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
        initialRouteName="Home"
        screenOptions={{ headerShown: false}}
      >
        <Tab.Screen
          name='Home'
          component={HomeStack}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileStack}
        />
        <Tab.Screen
          name='EventCreation'
          component={EventCreationStack}
          options={{title: 'Create Event'}}
        />
        <Tab.Screen
          name='SearchEvents'
          component={SearchEventsStack}
          options={{title: 'Search Events'}}
        />
        <Tab.Screen
          name='Notifications'
          component={NotificationsStack}
          options={{title: 'Notifications'}}
        />
      </Tab.Navigator>
    );
}
