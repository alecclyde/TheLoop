import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../screens/home'



//Screens in the Home tab

const Stack = createStackNavigator();

export default function HomeStack(){
  return(
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{ headerShown: false}}
    >
      <Stack.Screen 
        name='Home'
        component={Home}
      />
    </Stack.Navigator>
  )
}
