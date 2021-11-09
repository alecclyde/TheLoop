import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { loggingOut, getUserData } from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import { Text } from 'react-native-elements';
import { Header} from 'react-native-elements';
import { Button } from 'react-native-elements';
import { ListItem, Avatar } from 'react-native-elements';
import {TouchableScale} from 'react-native-touchable-scale';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as firebase from "firebase";

export default function Profile({ navigation, route }) {

  // const email = route.params?.userData.email ?? 'email';
  // const firstName = route.params?.userData.firstName ?? 'firstName';
  // const lastName = route.params?.userData.lastName ?? 'lastName';
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Listener to update user data
  function AuthStateChangedListener(user) {
    if (user) {
      const userData = getUserData(user.uid).then((user) =>
        displayUserData(user)
      );
    } else {
      setEmail("");
      setFirstName("");
      setLastName("");
    }
  }

  function displayUserData(user) {
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
  }

  useEffect(() => {
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(AuthStateChangedListener);

    return () => {
      unsubscriber;
    };
  }, []);

  const list = [
    {
      name: 'Event 1',
      subtitle: 'Short Descrp'
    },
    {
      name: 'Event 2',
      subtitle: 'Short Descrp'
    },
    {
      name: 'Event3',
      subtitle: 'or location',
    }
  ]

  

  return (
    <SafeAreaView style={globalStyles.container}>

    <View style={{flex: 1 }}>

      <View style={{borderBottomColor: 'black', borderBottomWidth: 3,}}>
      <Text h2 style={{textAlign: 'center',}} >Welcome Back {'\n'} {firstName}!</Text>
      </View>


      <View style= {{backgroundColor: 'black'}}>
      <Text h3 style={{textAlign: 'center', color: 'orange'}} >Your Events</Text>
      </View>
      
      
      <View>
      <ScrollView style={styles.scrollView}>
        {
          list.map((l, i) => (
      <ListItem
        key={i} bottomDivide
        bottomDivider={true}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95} //
        linearGradientProps={{
          colors: ['#FF9800', '#F44336'],
          start: { x: 1, y: 0 },
          end: { x: 0.2, y: 0 },
        }}
        ViewComponent={LinearGradient} 
      >
        <ListItem.Content>
          <ListItem.Title style={{ color: 'white', fontWeight: 'bold' }}>
            {l.name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: 'white' }}>
            {l.subtitle}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron color="white" />
      </ListItem>
          ))
            }
          </ScrollView>   
      </View>



      <View style={{ flex: 1}} />

      <View style={{ flexDirection: "row", justifyContent: "center"}}>
        <Button
          title= "Sign Out"
          onPress={() => loggingOut(navigation)}>
          
        </Button>
      </View>
      <View style={{ flex: .3}} >

      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  });
