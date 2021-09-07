import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import EventCreation from '../screens/eventCreation';
import EventCreationForm from '../screen/EventCreationForm';



//Screens in the Event Creation tab

const Stack = createStackNavigator();

export default function EventCreationStack(){
  return(
    <Stack.Navigator
      initialRouteName='BrainBreakFirstQuestion'
      screenOptions={{ headerShown: false}}
    >
      <Stack.Screen 
        name='EventCreation'
        component={EventCreation}
      />
      <Stack.Screen 
        name='EventCreationForm'
        component={EventCreationForm}
      />
    </Stack.Navigator>
  )
}
