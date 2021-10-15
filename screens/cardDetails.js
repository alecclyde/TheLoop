import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
// import Card from '../shared/card';
import { StackActions } from '@react-navigation/routers';
import Icon from "react-native-vector-icons/FontAwesome";
import moment from 'moment';
import { Card } from 'react-native-elements/';
import * as firebase from "firebase";
import { TouchableOpacity } from 'react-native-gesture-handler';


//Called by favorite and personal when you click on a card to display the content
export default function CardDetails({ navigation, route }) {

  const [attendees, setAttendees] = useState([]);
  const [creator, setCreator] = useState("");

  const listAttendees = attendees.map((attendees) => {
    <Text>{ attendees }</Text>
  })

  // const displayAttendee = (attendee) => {
  //   var attendeeName = 

  // }

  const showAttendees = () => {
    attendees.forEach((item) => {
      console.log(item)
    })
    console.log(attendees.length)
  }


  useEffect(() => {
    // console.log("useEffect Firing!")

    setAttendees([])
    const users = [];
    firebase.firestore().collection("users").get()
    .then((snap) => {
      snap.docs.forEach((doc) => {
        // console.log(doc.id);
        // console.log(doc.data());

        // [Robbie] There may be a much more efficient way to filter attendees
        route.params?.attendees.forEach((attendee) => {
          if (attendee == doc.id) {
            var attendeeName = doc.data().firstName + ' ' + doc.data().lastName;
            setAttendees((attendees) => [...attendees, attendeeName])

            if (doc.id == route.params?.creator) {
              setCreator(attendeeName)
            }
          }

        })
      });

      // users.forEach((item) => {
      //   console.log(item)
      // })

    });
  }, []);



  return (
    <View style={globalStyles.container}>
      <Card>
      
        <View style={globalStyles.rowContainer}>
          {/* <Text style={globalStyles.titleText}>
            { route.params?.name }
          </Text> */}
            <Card.Title style={globalStyles.titleText}>{ route.params?.name }</Card.Title>
            <Icon onPress={() => navigation.dispatch(StackActions.pop(1))} name='arrow-left' size={25} style={{position: 'absolute', left: 1}}/>
          </View>
          <Card.Divider/>
        <Text>Address: { route.params?.address }</Text>
        <Text>Creator: { creator }</Text>
        <Text>Date: { moment.unix(route.params?.datetime.seconds).format("MMMM Do, YYYY") }</Text>
        <Text>Time: { moment.unix(route.params?.datetime.seconds).format("hh:mm A") }</Text>
        <Text>Loop: { route.params?.loop }</Text>
        <Card.Divider/>
        <Card.Title style={globalStyles.titleText}>Attendees</Card.Title>
        { attendees.map((attendee) =>
        <Text key={attendee}>{ attendee }</Text>

        )}


          {/* REMOVE THIS!!! */}
          
        {/* <TouchableOpacity
        onPress={showAttendees}
        >
        <Text>PRESS ME</Text>

        </TouchableOpacity> */}





      </Card>
    </View>
  );
}