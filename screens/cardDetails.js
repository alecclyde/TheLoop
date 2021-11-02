import React, { useState, useEffect } from "react";
import { View, Text, Alert, Keyboard, ScrollView } from "react-native";
import { globalStyles } from "../styles/global";
// import Card from '../shared/card';
import { StackActions } from "@react-navigation/routers";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { Card, Button, Divider, Input } from "react-native-elements/";
import * as firebase from "firebase";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  registerEvent,
  unregisterEvent,
  getUserData,
} from "../shared/firebaseMethods";

//Called by favorite and personal when you click on a card to display the content
export default function CardDetails({ navigation, route }) {
  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventCreator, setEventCreator] = useState({
    id: route.params?.creatorID,
    name: "",
  });

  const [eventName, setEventName] = useState(route.params?.name);
  const [eventLoop, setEventLoop] = useState(route.params?.loop || "");
  const [eventDateTime, setEventDateTime] = useState(
    route.params?.startDateTime || ""
  );
  const [eventAddress, setEventAddress] = useState("");

  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState();
  const [isAttending, setIsAttending] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  var eventAtens = [];

  const AuthStateChangedListener = (user) => {
    if (user) {
      getUserData(user.uid).then((userData) => {
        setUserName(userData.firstName + " " + userData.lastName);
      });

      setUserID(user.uid);
      if (user.uid == route.params?.creatorID) setIsCreator(true);
    }
  };

  const onResult = (QuerySnapshot) => {
    const eventData = QuerySnapshot.data();

    setEventName(eventData.name);
    setEventLoop(eventData.loop);
    setEventDateTime(eventData.startDateTime.seconds);
    setEventAddress(eventData.address);
    // setEventCreator({id: eventData.creator, name: eventCreator.name})

    updateAttendeeList(eventData.attendees);
  };

  const updateAttendeeList = (attendees) => {
    eventAtens = eventAtens.filter((attendee) =>
      attendees.includes(attendee.id)
    );

    setEventAttendees(eventAtens);

    attendees.forEach((attendee) => {
      // if the array of existing attendees doesn't include this possible new one
      if (!eventAtens.some((elem) => elem.id == attendee)) {
        firebase
          .firestore()
          .collection("users")
          .doc(attendee)
          .get()
          .then((snap) => {
            const attendeeName =
              snap.data().firstName + " " + snap.data().lastName;
            // console.log("new read: " + attendeeName)

            setEventAttendees((eventAttendees) => [
              ...eventAttendees,
              { id: snap.id, name: attendeeName },
            ]);
            eventAtens.push({ id: snap.id, name: attendeeName });

            // if current ID is the creator, set creator accordingly
            if (snap.id == eventCreator.id) {
              setEventCreator({ id: eventCreator.id, name: attendeeName });
            }
          });
      }
    });
  };

  const onError = (error) => {
    console.log(error);
  };

  // This may be a better method for reading users from the database, if I can get it to work

  // firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "in", eventAttendees).get()
  // .then((snap) => {
  //   if (snap.exists) {
  //     console.log("Poggers")
  //   } else {
  //     console.log("Not Poggers")
  //     console.log()
  //   }
  // })

  // gets the logged in user until (hopefully) we get some redux action
  useEffect(() => {
    const subscriber = firebase
      .auth()
      .onAuthStateChanged(AuthStateChangedListener);

    return subscriber;
  });

  // creates the listener to allow realtime data
  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("events")
      .doc(route.params?.id)
      .onSnapshot(onResult, onError);

    return subscriber;
  }, []);

  // determines whether or not the logged in user is attending the selected event
  useEffect(() => {
    if (eventAttendees.some((elem) => elem.id == userID)) {
      setIsAttending(true);
    } else {
      setIsAttending(false);
    }
  }, [eventAttendees, userID]);

  return (
    <View style={{flex: 1}}>
      <View style={{padding: 20}}>
        <View style={globalStyles.rowContainer}>
          <Text style={globalStyles.titleText}>{eventName}</Text>
          <Icon
            onPress={() => navigation.dispatch(StackActions.pop(1))}
            name="arrow-left"
            size={25}
            style={{ position: "absolute", left: 1 }}
          />
        </View>
        <Divider orientation="horizontal" />
        <Text>Address: {eventAddress}</Text>
        <Text>Creator: {eventCreator.name}</Text>
        <Text>Date: {moment.unix(eventDateTime).format("MMMM Do, YYYY")}</Text>
        <Text>Time: {moment.unix(eventDateTime).format("hh:mm A")}</Text>
        <Text>Loop: {eventLoop}</Text>

        <Divider orientation="horizontal" />

        <Text style={globalStyles.titleText}>Attendees</Text>
        {eventAttendees.map((attendee) => (
          <Text key={attendee.id}>{attendee.name}</Text>
        ))}
        {!isCreator && (
          <Button
            title={!isAttending ? "Register" : "Unregister"}
            onPress={() => {
              if (!isAttending) {
                registerEvent(route.params?.id, userID);
              } else {
                unregisterEvent(route.params?.id, userID);
              }
            }}
          />
        )}
        <Divider orientation="horizontal" style={{ paddingTop: 15 }} />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "red" }}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={{ backgroundColor: isAttending ? "white" : "gray" }}>
          <Input
            placeholder={"Post in " + eventName}
            disabled={!isAttending}
            multiline={true}
            onBlur={Keyboard.dismiss()}
          />

          <Button title="Post" disabled={!isAttending} />
        </Card>
      </ScrollView>
    </View>
  );
}
