import { createStackNavigator } from '@react-navigation/stack';
import NotificationPage from '../screens/notificationPage';
import CardDetails from "../screens/cardDetails";
import React from 'react';
import Header from '../shared/header';


//Screens in the notifications tab

const Stack = createStackNavigator();

export default function NotificationStack(){
  return(
    <Stack.Navigator
      initialRouteName='NotificationPage'
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
          backgroundColor: '#3B4046',
        }
      }}
    >
      <Stack.Screen 
        name='Notifications'
        component={NotificationPage}
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
