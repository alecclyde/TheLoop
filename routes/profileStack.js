import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Profile from '../screens/profile';
import Settings from '../screens/settings';
import AboutUs from '../screens/aboutUs';
import Header from '../shared/header';
import SignUp from '../screens/signUp';
import LogIn from '../screens/logIn';



//Screens in the profile tab

const Stack = createStackNavigator();

export default function ProfileStack(){
  return(
    <Stack.Navigator
      initialRouteName='Profile'
      screenOptions={{
        cardStyle: {
          backgroundColor: '#fefefe'
        },
        headerLeft: ()=> null, 
        headerTitleAlign: 'center',
        headerBackTitle: null,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: 'white',
        }
      }}
    >
      <Stack.Screen 
        name='Profile'
        component={Profile}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />
          }
        }}
      />
       <Stack.Screen 
        name='Settings'
        component={Settings}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />
          }
        }}
      />
       <Stack.Screen 
        name='AboutUs'
        component={AboutUs}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />
          }
        }}
      />

    </Stack.Navigator>
  )
}
