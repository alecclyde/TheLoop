import { createStackNavigator } from '@react-navigation/stack';
import NotificationPage from '../screens/notificationPage';
import React from 'react';


//Screens in the notifications tab

const Stack = createStackNavigator();

export default function NotificationStack(){
  return(
    <Stack.Navigator
      initialRouteName='NotificationPage'
      screenOptions={{ headerShown: false}}
    >
      <Stack.Screen 
        name='NotificationPage'
        component={NotificationPage}
      />
    </Stack.Navigator>
  )
}
