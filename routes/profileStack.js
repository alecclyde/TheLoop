import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Profile from '../screens/profile';
import Settings from '../screens/settings';
import AboutUs from '../screens/aboutUs';
import Header from '../shared/header';
import CardDetails from "../screens/cardDetails";
import SignUp from '../screens/signUp';
import LogIn from '../screens/logIn';
import { Button } from 'react-native-elements';
import  Icon  from 'react-native-vector-icons/FontAwesome';


//Screens in the profile tab

const Stack = createStackNavigator();

export default function ProfileStack({navigation}){
  return(
    <Stack.Navigator
      initialRouteName='Profile'
      screenOptions={{
        cardStyle: {
          backgroundColor: '#fefefe'
        },
      }}
      >
      <Stack.Screen 
        name='Profile'
        component={Profile}
        options={({ navigation }) => {
          return {
            headerLeft: ()=> (
              
          <Button
        buttonStyle={{backgroundColor: 'transparent'}}
        icon={
          <Icon
            name="gear"
            size={30}
            color="white"
          />
        }
        onPress={() => navigation.navigate("Settings")}>


        </Button>
        ), 
        headerTitleAlign: 'center',
        headerBackTitle: null,
        headerTintColor: 'black',
        headerTitleStyle: {
          color: "white",
        },
        headerStyle: {
          backgroundColor: '#2C2C2C',
        }
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
      <Stack.Screen
        name="CardDetails"
        component={CardDetails}
        options={{ headerShown: false}}
      />

    </Stack.Navigator>
  )
}
