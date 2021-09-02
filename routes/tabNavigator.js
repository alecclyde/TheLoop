import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import * as firebase from 'firebase';


// stacks
import HomeStack from './homeStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Drawer = createDrawerNavigator();
export default function RootStack() {
  //There has to be a better way to do this but I couldn't find it
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props}/>}
        screenOptions={{ headerShown: false, drawerPosition: 'right' }}
      >
        <Drawer.Screen
          name='Authentication'
          component={AuthenticationStack}
        />
        <Drawer.Screen
          name='Home'
          component={HomeStack}
          options={{title: 'Home'}}
        />
        <Drawer.Screen
          name='BrainBreaks'
          component={BrainBreakStack}
          options={{title: 'Brain Breaks'}}
        />
        <Drawer.Screen
          name='Favorites'
          component={FavoriteStack}
          options={{title: 'Favorites'}}
        />
        <Drawer.Screen
          name='Personal'
          component={PersonalStack}
          options={{title: 'My Brain Breaks'}}
        />
        <Drawer.Screen
          name='Book'
          component={BookStack}
          options={{title: 'About The Book'}}
        />
        <Drawer.Screen
          name='About'
          component={AboutStack}
          options={{title: 'About NeuroLogic®'}}
        />
      </Drawer.Navigator>
    );
}
