import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
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
  unregisterEvent,
  getUserData,
  createPost,
  editPost,
  deletePost,
} from "../shared/firebaseMethods";
import { Formik } from "formik";
import { makeName } from "../shared/commonMethods";
import { useIsFocused } from "@react-navigation/core";
import { connect } from "react-redux";
import { registerEvent } from "../store/actions/eventActions";
import { bindActionCreators } from "redux";


// yuh yuh

//Called by favorite and personal when you click on a card to display the content
function CardDetails(props, { navigation, route }) {

  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventCreator, setEventCreator] = useState({
    id: props.route.params?.creatorID,
    name: "",
  });

  const [eventName, setEventName] = useState(props.route.params?.name);
  const [eventLoop, setEventLoop] = useState(props.route.params?.loop || "");
  const [eventDateTime, setEventDateTime] = useState(
    props.route.params?.startDateTime || ""
  );
  const [eventAddress, setEventAddress] = useState("");

  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState();
  const [isAttending, setIsAttending] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [postEditID, setPostEditID] = useState();

  var eventAtens = [];

  const AuthStateChangedListener = (user) => {
    if (user) {
      getUserData(user.uid).then((userData) => {
        setUserName(makeName(userData));
      });

      setUserID(user.uid);
      if (user.uid == props.route.params?.creatorID) setIsCreator(true);
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
            if (snap.exists) {
              // prevents errors if a user gets deleted
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
            }
          });
      }
    });
  };

  const reducer = (state, action) => {
    let newState = state;
    // console.log(action.type)

    switch (action.type) {
      case "add":
        return [action.payload, ...state]; // I chose to do payload, then everything else so that older posts are towards the bottom
      case "update":
        let oldPost = state.length; // adds the updated post to the end, just in case (although it'll still cause errors)
        state.forEach((post) => {
          // gets the index of the updated post so that it can be updated in-place
          if (post.id === action.payload.id) {
            oldPost = state.indexOf(post);
          }
        });

        newState = newState.filter((post) => post.id !== action.payload.id); // this feels sloppy, surely there's a better way
        newState.splice(oldPost, 0, action.payload); // like it works but there should be a way to use splice OR filter and not need both

        return newState;
      case "remove":
        return state.filter((post) => post.id !== action.payload.id);
      case "clear":
        return [];
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
        creationTimestamp: data.creationTimestamp,
        edited: data.edited,
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

  const enterEditMode = (post) => {
    setEditMode(true);
    setPostEditID(post.id);
  };

  const exitEditMode = () => {
    setEditMode(false);
    setPostEditID();
  };

  // const handleEditPost = (post) => {
  //   editPost(route.params?.id, post.id)
  //   exitEditMode();
  // };

  const handleDeletePost = (post) => {
    Alert.alert(
      "Really delete?",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePost(props.route.params?.id, post.id),
        },
      ]
    );
  };

  // This may be a better method for reading users from the database, if I can get it to work

  // firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "in", eventAttendees).get()

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
      .doc(props.route.params?.id)
      .onSnapshot(onResult, onError);

    return subscriber;
  }, []);

  // creates a listener for posts
  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params?.id)
      .collection("posts")
      .orderBy("creationTimestamp")
      .onSnapshot(onPostResult, onPostError);

    dispatch({ type: "clear" }); // this could maybe be removed later?

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
      {/* <ScrollView style={{ flex: 1, backgroundColor: "red" }}> */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          backgroundColor: "white",
        }}
      >
        <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
          <View style={globalStyles.rowContainer}>
            <Text style={globalStyles.titleText}>{eventName}</Text>
            <Icon
              onPress={() => props.navigation.dispatch(StackActions.pop(1))}
              name="arrow-left"
              size={25}
              style={{ position: "absolute", left: 1 }}
            />
          </View>
          <Divider orientation="horizontal" />
        </ScrollView>
      </View>

      {/* Post area */}
      <FlatList
        data={state}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={false}
        style={{ flex: 1 }}
        // the actual posts
        renderItem={({ item }) => (
          <Card>
            {/* poster name and post creation time */}
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold" }}>{item.posterName}</Text>
              <View style={{ flex: 1 }} />
              <Text style={{ color: "gray" }}>
                {moment
                  .unix(item.creationTimestamp.seconds)
                  .format("MMM Do, hh:mm A")}
              </Text>
            </View>

            {postEditID != item.id && (
              <View>
                {/* post message */}
                <Text>{item.message}</Text>

                {/* 'edited' tag */}
                {/* literally the only reason I put this <Text> in a view was because it */}
                {/* broke my code coloration in VSCode and it drove me crazy. -Robbie */}

                {item.edited && (
                  <View>
                    <Text style={{ color: "gray" }}>(edited)</Text>
                  </View>
                )}
              </View>
            )}

            {postEditID == item.id && (
              <View>
                <Formik
                  initialValues={{
                    postText: item.message,
                  }}
                  onSubmit={(values, actions) => {
                    if (values.postText === "") {
                      Alert.alert("Error", "Cannot create a post with no text");
                    } else {
                      editPost(
                        props.route.params?.id,
                        item.id,
                        values.postText.trim()
                      );
                      exitEditMode();
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
                        onChangeText={props.handleChange("postText")}
                        onBlur={() => {
                          props.handleBlur("postText");
                        }}
                        style={{ maxHeight: 250 }}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, paddingHorizontal: 5 }}>
                          <Button
                            title="Cancel"
                            onPress={() => exitEditMode()}
                          />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 5 }}>
                          <Button
                            title="Edit"
                            onPress={props.handleSubmit}
                          />
                        </View>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            )}

            {/* pencil and trashcan icons */}
            {/* If we're editing any post, hide all buttons (too confusing if editing multiple) */}
            {!editMode && (
              <View style={{ flexDirection: "row" }}>
                {item.posterID == userID && (
                  <Icon
                    name="pencil"
                    color="#517fa4"
                    size={20}
                    onPress={() => enterEditMode(item)}
                  />
                )}

                <View style={{ flex: 1 }} />
                {(item.posterID == userID || isCreator) && (
                  <Icon
                    name="trash"
                    color="#517fa4"
                    size={20}
                    onPress={() => handleDeletePost(item)}
                  />
                )}
              </View>
            )}
          </Card>
        )}
        ListHeaderComponent={
          <ScrollView
            // style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
          >
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
                      props.registerEvent(props.route.params?.id, userID);
                    } else {
                      unregisterEvent(props.route.params?.id, userID);
                    }
                  }}
                />
              )}
              <Divider orientation="horizontal" style={{ paddingTop: 15 }} />
            </View>
          </ScrollView>
        }
      />

      {!(Platform.OS == "android" && editMode) && (<KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "position" : "height"}
        keyboardVerticalOffset={100}
        enabled={!editMode}
        
      >
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
                  props.route.params?.id,
                  values.postText.trim()
                );
                actions.resetForm();
              }
            }}
          >
            {(props) => (
              <>
                <Input
                  placeholder={"Post in " + eventName}
                  disabled={!isAttending || editMode}
                  multiline={true}
                  value={props.values.postText}
                  onChangeText={props.handleChange("postText")}
                  onBlur={() => {
                    props.handleBlur("postText");
                  }}
                  style={{ maxHeight: 100 }}
                />
                <Button
                  title="Post"
                  disabled={!isAttending || editMode}
                  onPress={props.handleSubmit}
                />
              </>
            )}
          </Formik>
        </Card>
      </KeyboardAvoidingView>)}

      {/* </ScrollView> */}
    </View>
  );
}

const mapStateToProps = state => ({
  events: state.events
});

const mapDispatchToProps = (dispatch) => ({
  registerEvent: (event, user) => dispatch(registerEvent(event, user))
})

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
