import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SearchPage from '../screens/searchPage';



//Screens in the search tab

const Stack = createStackNavigator();

export default function SearchEventsStack(){
  return(
    <Stack.Navigator
      initialRouteName='SearchPage'
      screenOptions={{ headerShown: false}}
    >
      <Stack.Screen 
        name='SearchPage'
        component={SearchPage}
      />
    </Stack.Navigator>
  )
}
