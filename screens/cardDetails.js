import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
// import Card from '../shared/card';
import { MaterialIcons} from '@expo/vector-icons';
import { StackActions } from '@react-navigation/routers';
import moment from 'moment';
import { Card } from 'react-native-elements/';
import * as firebase from "firebase";
import { TouchableOpacity } from 'react-native-gesture-handler';

//Called by favorite and personal when you click on a card to display the content
export default function CardDetails({ navigation, route }) {

  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventCreator, setEventCreator] = useState({id: route.params?.creator, name: ""});

  const [eventName, setEventName] = useState(route.params?.name);
  const [eventLoop, setEventLoop] = useState(route.params?.loop);
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventAddress, setEventAddress] = useState("");

  const onResult = (QuerySnapshot) => {
    const eventData = QuerySnapshot.data();

    setEventName(eventData.name)
    setEventLoop(eventData.loop)
    setEventDateTime(eventData.datetime.seconds)
    setEventAddress(eventData.address)
    setEventCreator({id: eventData.creator, name: eventCreator.name})

    updateAttendeeList(eventData.attendees)

  }

  const updateAttendeeList = (attendees) => {

    setEventAttendees(eventAttendees.filter((attendee) => attendees.includes(attendee.id)))

    attendees.forEach((attendee) => {
      if (!eventAttendees.some((elem) => elem.id == attendee)) {

        firebase.firestore().collection("users").doc(attendee).get()
        .then((snap) => {

          console.log("new read")
          
          const attendeeName = snap.data().firstName + ' ' + snap.data().lastName;
          console.log(attendeeName)
          setEventAttendees((eventAttendees) => [...eventAttendees, {id: snap.id, name: attendeeName}])

          // if current ID is the creator, set creator accordingly
          if (snap.id == eventCreator.id) {
            setEventCreator({id: eventCreator.id, name: attendeeName})
          }

        })
      } 
    })
  }

  const onError = (error) => {
    console.log(error);
  }

  /*
  useEffect(() => {

    setAttendees([])
    const users = [];

    firebase.firestore().collection("events").doc(route.params?.id).get()
    .then((snap) => {
      const eventData = snap.data()
      setEventName(eventData.name);
      setEventLoop(eventData.loop);
      setEventAddress(eventData.address);
      setEventDateTime(eventData.datetime.seconds);

      const eventAttendees = eventData.attendees;

      // This is absolutely a better method, but I can't get the documentId field to work. Putting a pin in this now

      // firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "in", eventAttendees).get()
      // .then((snap) => {
      //   if (snap.exists) {
      //     console.log("Poggers")
      //   } else {
      //     console.log("Not Poggers")
      //     console.log()
      //   }
      // })

      // This method avoids nested for loops, but has more database reads. Might be a better tradeoff?
      eventAttendees.forEach((attendee) => {
        firebase.firestore().collection("users").doc(attendee).get()
        .then((snap) => {
          if (snap.exists) {
            const attendeeName = snap.data().firstName + ' ' + snap.data().lastName;
            setAttendees((attendees) => [...attendees, {id: snap.id, name: attendeeName}])

            if (snap.id == eventData.creator) {
              setCreator(attendeeName)
            }
          }
        })
      })
    })

  }, []);
  */

  useEffect(() => {
    const subscriber = firebase.firestore().collection("events").doc(route.params?.id).onSnapshot(onResult, onError);

    return subscriber
  }, [])

  return (
    <View style={globalStyles.container}>
      <Card>
      
        <View style={globalStyles.rowContainer}>
          {/* <Text style={globalStyles.titleText}>
            { route.params?.name }
          </Text> */}
            <Card.Title style={globalStyles.titleText}>{ eventName }</Card.Title>
            <MaterialIcons onPress={() => navigation.dispatch(StackActions.pop(1))} name='delete' size={25} style={{position: 'absolute', left: 1}}/>
          </View>
          <Card.Divider/>
        <Text>Address: { eventAddress }</Text>
        <Text>Creator: { eventCreator.name }</Text>
        <Text>Date: { moment.unix(eventDateTime).format("MMMM Do, YYYY") }</Text>
        <Text>Time: { moment.unix(eventDateTime).format("hh:mm A") }</Text>
        <Text>Loop: { eventLoop }</Text>
        <Card.Divider/>
        <Card.Title style={globalStyles.titleText}>Attendees</Card.Title>
        { eventAttendees.map((attendee) =>
        <Text key={attendee.id}>{ attendee.name }</Text>

        )}

      </Card>
    </View>
  );
}