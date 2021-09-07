import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NotificationPage from '../screens/notificationPage';



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
