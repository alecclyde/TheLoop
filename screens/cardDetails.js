import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageEditor,
} from "react-native";
import { globalStyles } from "../styles/global";
// import Card from '../shared/card';
import { StackActions } from "@react-navigation/routers";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { Card, Button, Divider, Input } from "react-native-elements/";
import * as firebase from "firebase";
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  registerEvent,
  unregisterEvent,
  getUserData,
  createPost,
} from "../shared/firebaseMethods";
import { Formik } from "formik";
import { makeName } from "../shared/commonMethods";
import { useIsFocused } from "@react-navigation/core";

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
        setUserName(makeName(userData));
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
            const attendeeName = makeName(snap.data());
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

  const reducer = (state, action) => {
    let newState;

    switch (action.type) {
      case "add":
        return [...state, action.payload];
      case "update":
        return [
          ...state.filter((post) => id !== action.payload.id),
          action.payload,
        ]; // could be post.id
      case "remove":
        return state.filter((post) => id !== action.payload.id);
      case "clear":
        return []
    }
  };

  const [state, dispatch] = useReducer(reducer, []);


  const onError = (error) => {
    console.log(error);
  };

  const onPostResult = (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      var data = change.doc.data();
      var payload = {
        id: change.doc.id,
        message: data.message,
        posterID: data.posterID,
        posterName: data.posterName,
        creationTimestamp: data.creationTimestamp
      };
      if (change.type === "added") {
        dispatch({ type: "add", payload: payload });
      }
      if (change.type === "modified") {
        dispatch({ type: "update", payload: payload });
      }
      if (change.type === "removed") {
        dispatch({ type: "remove", payload: payload });
      }
    });
  };

  const onPostError = (error) => {
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

  // creates a listener for posts
  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("posts")
      .doc(route.params?.id)
      .collection("posts")
      .onSnapshot(onPostResult, onPostError);

      dispatch({type: "clear"}) // this could maybe be removed later?

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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        stickyHeaderIndices={[0]}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: "white",
          }}
        >
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
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text>Address: {eventAddress}</Text>
          <Text>Creator: {eventCreator.name}</Text>
          <Text>
            Date: {moment.unix(eventDateTime).format("MMMM Do, YYYY")}
          </Text>
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
      </ScrollView>

      {/* <ScrollView style={{ flex: 1, backgroundColor: "red" }}> */}

      {/* Post area */}
      <FlatList
        data={state}
        keyExtractor={(item) => item.id}
        style={{backgroundColor: "gray", flex: 1}}
        renderItem={({item}) => (
          <Card>
            <Text>
              {item.posterName}
            </Text>
            <Text>
              {item.message}
            </Text>
          </Card>

        )}
      />

      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
        {/* May want to fiddle with keyboardVerticalOffeset number a bit */}
        <Card>
          <Formik
            initialValues={{
              postText: "",
            }}
            onSubmit={(values, actions) => {
              if (values.postText === "") {
                Alert.alert("Error", "Cannot create a post with no text");
              } else {
                var success = createPost(
                  userID,
                  userName,
                  route.params?.id,
                  values.postText
                );
                console.log("TODO: add post to database");
                actions.resetForm();
              }
            }}
          >
            {(props) => (
              <>
                <Input
                  placeholder={"Post in " + eventName}
                  disabled={!isAttending}
                  multiline={true}
                  value={props.values.postText}
                  // value="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                  onChangeText={props.handleChange("postText")}
                  onBlur={() => {
                    props.handleBlur("postText");
                  }}
                  style={{ maxHeight: 100 }}
                />
                <Button
                  title="Post"
                  disabled={!isAttending}
                  onPress={props.handleSubmit}
                />
              </>
            )}
          </Formik>
        </Card>
      </KeyboardAvoidingView>
      {/* </ScrollView> */}
    </View>
  );
}
