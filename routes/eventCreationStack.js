import { createStackNavigator } from '@react-navigation/stack';
import EventCreation from '../screens/eventCreation';
import EventCreationForm from '../screens/eventCreationForm';
import React from 'react';
import Header from '../shared/header';


//Screens in the Event Creation tab

const Stack = createStackNavigator();

export default function EventCreationStack(){
  return(
    <Stack.Navigator
      initialRouteName='EventCreation'
      screenOptions={{
        cardStyle: {
          backgroundColor: '#fefefe'
        },
        headerLeft: ()=> null, 
        headerTitleAlign: 'center',
        headerBackTitle: null,
        headerTintColor: 'black',
        headerTitleStyle: {
          color: "white",
        },
        headerStyle: {
          backgroundColor: '#2C2C2C',
        }
      }}
    >
      <Stack.Screen 
        name='Create a new Event!'
        component={EventCreation}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />
          }
        }}
      />
      <Stack.Screen 
        name='EventCreationForm'
        component={EventCreationForm}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />
          }
        }}
      />
    </Stack.Navigator>
  )
}
