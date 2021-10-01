import { createStackNavigator } from '@react-navigation/stack';
import NotificationPage from '../screens/notificationPage';
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
        headerStyle: {
          backgroundColor: 'white',
        }
      }}
    >
      <Stack.Screen 
        name='NotificationPage'
        component={NotificationPage}
        options={({ navigation }) => {
          return {
            headerRight: () => <Header navigation={navigation} />
          }
        }}
      />
    </Stack.Navigator>
  )
}
