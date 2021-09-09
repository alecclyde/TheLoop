import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Profile from '../screens/profile';
import Settings from '../screens/settings';
import AboutUs from '../screens/aboutUs';
import SignUp from '../screens/signUp';



//Screens in the profile tab

const Stack = createStackNavigator();

export default function ProfileStack(){
  return(
    <Stack.Navigator
      initialRouteName='SignUp'
      screenOptions={{ headerShown: false}}
    >
      <Stack.Screen 
        name='Profile'
        component={Profile}
      />
       <Stack.Screen 
        name='Settings'
        component={Settings}
      />
       <Stack.Screen 
        name='AboutUs'
        component={AboutUs}
      />
       <Stack.Screen 
        name='SignUp'
        component={SignUp}
      />

    </Stack.Navigator>
  )
}
