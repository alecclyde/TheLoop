import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  Image,
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
  registerEvent,
  getUserData,
  createPost,
  editPost,
  deletePost,
  createNotification,
  createReply,
  deleteReply,
  getMultiplePfps,
  safeDeleteEvent,
} from "../shared/firebaseMethods";
import { Formik } from "formik";
import { makeName, makeTimeDifferenceString } from "../shared/commonMethods";
import { useIsFocused } from "@react-navigation/core";
import { connect } from "react-redux";
// import { registerEvent } from "../store/actions/eventActions";
import { bindActionCreators } from "redux";
import { Dimensions } from "react-native";
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";

const windowWidth = Dimensions.get("window").width;
const windowHight = Dimensions.get("window").height;

// yuh yuh

//Called by favorite and personal when you click on a card to display the content
function CardDetails(props, { navigation, route }) {
  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventCreator, setEventCreator] = useState(
    props.route.params?.creator || { userID: "", userName: "" }
  );

  const [eventID, setEventID] = useState(props.route.params?.id);
  const [eventName, setEventName] = useState(props.route.params?.name || "");
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
  const [postReplyID, setPostReplyID] = useState();
  const [profilePics, setProfilePics] = useState({});

  const [newPostsNotifID, setNewPostsNotifID] = useState();
  const [newAttendeesNotifID, setNewAttendeesNotifID] = useState();

  var loaded = false

  const AuthStateChangedListener = (user) => {
    if (user) {
      getUserData(user.uid).then((userData) => {
        setUserName(makeName(userData));
      });

      setUserID(user.uid);
      if (user.uid == eventCreator.userID) setIsCreator(true);
    }
  };

  const onResult = (QuerySnapshot) => {
    const eventData = QuerySnapshot.data();

    if (eventData != undefined) {
      setEventName(eventData.name);
      setEventLoop(eventData.loop);
      setEventDateTime(eventData.startDateTime);
      setEventAddress(eventData.address);

      setEventCreator(eventData.creator);
      setNewPostsNotifID(
        eventData.newPostsNotifID != undefined ? eventData.newPostsNotifID : "0"
      );
      setNewAttendeesNotifID(
        eventData.newAttendeesNotifID != undefined
          ? eventData.newAttendeesNotifID
          : "0"
      );

      setEventAttendees(eventData.attendees);
      loaded = true

    } else {
      // event cannot be found or doesn't exist
      if (!loaded) {
        Alert.alert(
          "Event Not Found",
          "That event could not be loaded. It may have been deleted."
        );
      }
      
      props.navigation.dispatch(StackActions.pop(1));
    }
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

  var eventLoopIconName = (eventLoop) => {
    switch (eventLoop) {
      case "Sports":
        return "futbol-o";
      case "Music":
        return "music";
      case "Volunteer":
        return "plus";
      case "Game":
        return "gamepad";
      case "Social":
        return "users";
      case "Arts":
        return "paint-brush";
      case "Outdoors":
        return "pagelines";
      case "Academic":
        return "book";
      case "Media":
        return "camera";
    }
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
        replies: data.replies,
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

  const enterReplyMode = (post) => {
    setEditMode(true);
    setPostReplyID(post.id);
  };

  const exitReplyMode = () => {
    setEditMode(false);
    setPostReplyID();
  };

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
          onPress: () =>
            deletePost(
              {
                eventID: props.route.params?.id,
                creatorID: eventCreator.userID,
                newPostsNotifID: newPostsNotifID,
              },
              {
                postID: post.id,
                posterID: post.posterID,
                posterName: post.posterName,
              }
            ),
        },
      ]
    );
  };

  const handleDeleteReply = (postID, reply) => {
    Alert.alert(
      "Really delete?",
      "Are you sure you want to delete this reply?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteReply(eventID, postID, reply),
        },
      ]
    );
  };

  /**
   * Creates a notification for all users except the creator
   * @param notifType - The type of notification
   */
  const handleNotifyAllUsers = (notifType) => {
    var notifData = {
      creatorName: eventCreator.userName,
      creatorID: eventCreator.userID,
      eventName: eventName,
      eventID: eventID,
    };

    eventAttendees.forEach((attendee) => {
      if (attendee.userID != eventCreator.userID) {
        createNotification(attendee.userID, notifType, notifData);
      }
    });
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
    if (eventAttendees.some((elem) => elem.userID == userID)) {
      setIsAttending(true);
    } else {
      setIsAttending(false);
    }
  }, [eventAttendees, userID]);

  // grabs the user profile pics
  useEffect(() => {
    let newIDs = [];

    eventAttendees.forEach((attendee) => {
      if (!profilePics[attendee.userID]) {
        // if the user pfp is not pulled yet
        newIDs.push(attendee.userID);
      }
    });

    getMultiplePfps(newIDs).then((newPfps) => {
      setProfilePics({ ...profilePics, ...newPfps });
    });
  }, [eventAttendees]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ backgroundColor: "#2B7D9C", flex: 1 }}>
        {/* // Title Area */}
        {/* <ScrollView style={{ flex: 1, backgroundColor: "red" }}> */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: "#2B7D9C",
            borderBottomColor: "black",
            borderBottomWidth: 5,
            marginBottom: 15,
          }}
        >
          <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
            <View>
              <Text style={styles.Title}>{eventName} </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.subt, { flex: 1 }]}>
                  {" "}
                  By: {eventCreator.userName}{" "}
                </Text>
                {eventCreator.userID == userID && (
                  <Icon
                    name="trash"
                    color="white"
                    size={30}
                    style={{ position: "absolute", right: 0 }}
                    onPress={() => {
                      Alert.alert(
                        "Really Delete?",
                        "Are you sure you want to delete your event? This cannot be undone.",
                        [
                          {
                            text: "No",
                          },
                          {
                            text: "Yes",
                            onPress: () => {
                              safeDeleteEvent(eventID, eventAttendees, {
                                address: eventAddress,
                                creator: eventCreator,
                                id: eventID,
                                loop: eventLoop,
                                name: eventName,
                                startDateTime: eventDateTime
                              })
                              // props.navigation.dispatch(StackActions.pop(1));
                            },
                          },
                        ]
                      );
                    }}
                  />
                )}
              </View>

              {/* <Text style={{ position: "absolute", right: 0.1 }}> */}
              <Icon
                name={eventLoopIconName(eventLoop)}
                style={{ position: "absolute", right: 0.1 }}
                size={windowWidth * 0.05}
              />
              {/* {eventLoop} */}
              {/* </Text> */}
              <Icon
                onPress={() => props.navigation.dispatch(StackActions.pop(1))}
                name="arrow-left"
                size={25}
                style={{ position: "absolute", left: 1 }}
              />
            </View>
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
            <Card containerStyle={styles.cardDesign}>
              <View style={styles.cardDesign}>
                {/* poster name and post creation time */}
                <View style={{ flexDirection: "row" }}>
                  {profilePics[item.posterID] && (
                    <Image
                      source={{
                        uri: profilePics[item.posterID],
                      }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  )}

                  <View style={{ flexDirection: "Column", paddingLeft: 5 }}>
                    <Text style={{ fontWeight: "bold", color: "white" }}>
                      {item.posterName}
                    </Text>
                    <Text style={{ color: "lightgray" }}>
                      {moment
                        .unix(item.creationTimestamp.seconds)
                        .format("MMM Do, hh:mm A")}
                    </Text>
                  </View>
                </View>

                {postEditID != item.id && (
                  <View>
                    {/* post message */}
                    <Text style={{ color: "white" }}>{item.message}</Text>

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
                          Alert.alert(
                            "Error",
                            "Cannot create a post with no text"
                          );
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
                            style={{ maxHeight: 250, color: "white" }}
                          />
                          <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, paddingHorizontal: 5 }}>
                              <Button
                                buttonStyle={styles.buttonDesign}
                                title="Cancel"
                                onPress={() => exitEditMode()}
                              />
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 5 }}>
                              <Button
                                buttonStyle={styles.buttonDesign}
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
                    {
                      <Icon
                        name="comment"
                        color="#2B7D9C"
                        size={22}
                        onPress={() => enterReplyMode(item)}
                      />
                    }

                    <View style={{ flex: 1 }} />
                    {item.posterID == userID && (
                      <Icon
                        name="pencil"
                        color="#2B7D9C"
                        size={22}
                        style={{ paddingHorizontal: 5 }}
                        onPress={() => enterEditMode(item)}
                      />
                    )}
                    {(item.posterID == userID || isCreator) && (
                      <Icon
                        name="trash"
                        color="#2B7D9C"
                        size={22}
                        onPress={() => handleDeletePost(item)}
                      />
                    )}
                  </View>
                )}

                {/* form that appears when replying to a post */}
                {postReplyID == item.id && (
                  <View>
                    <Formik
                      initialValues={{
                        replyText: "",
                      }}
                      onSubmit={(values, actions) => {
                        if (values.postText === "") {
                          Alert.alert(
                            "Error",
                            "Cannot create a reply with no text"
                          );
                        } else {
                          createReply(
                            {
                              postID: item.id,
                              posterID: item.posterID,
                              eventID: eventID,
                              eventName: eventName,
                            },
                            {
                              userID: userID,
                              userName: userName,
                            },
                            values.replyText.trim()
                          );

                          actions.resetForm();
                          exitReplyMode();
                        }
                      }}
                    >
                      {(props) => (
                        <>
                          <Input
                            placeholder={"Reply to " + item.posterName}
                            // disabled={!isAttending || editMode}
                            multiline={true}
                            value={props.values.replyText}
                            onChangeText={props.handleChange("replyText")}
                            onBlur={() => {
                              props.handleBlur("replyText");
                            }}
                            style={{ maxHeight: 100, color: "white" }}
                          />
                          <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, paddingHorizontal: 5 }}>
                              <Button
                                buttonStyle={styles.buttonDesign}
                                title="Cancel"
                                onPress={() => exitReplyMode()}
                              />
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 5 }}>
                              <Button
                                buttonStyle={styles.buttonDesign}
                                title="Reply"
                                onPress={props.handleSubmit}
                              />
                            </View>
                          </View>
                        </>
                      )}
                    </Formik>
                  </View>
                )}

                {/* replies start here */}
                <View style={{ paddingLeft: 20 }}>
                  {item.replies.map((reply) => (
                    <View key={reply.id}>
                      <Divider
                        orientation="horizontal"
                        style={{ paddingVertical: 5 }}
                      />

                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold", color: "white" }}>
                          {reply.replierName}
                        </Text>

                        <View style={{ flex: 1 }} />

                        <Text style={{ color: "gray" }}>
                          {makeTimeDifferenceString(
                            reply.creationTimestamp.seconds
                          )}{" "}
                          ago
                        </Text>

                        {(reply.replierID == userID || isCreator) && (
                          <Icon
                            name="trash"
                            color="#517fa4"
                            size={22}
                            style={{ paddingLeft: 5, alignContent: "center" }}
                            onPress={() => handleDeleteReply(item.id, reply)}
                          />
                        )}
                      </View>
                      <Text style={{ color: "white" }}>{reply.message}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          )}
          ListHeaderComponent={
            <ScrollView
              // style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.titlesub}> Where? </Text>
                <Text style={styles.sub}> {eventAddress} </Text>
                <Text style={styles.titlesub}> When? </Text>
                <Text style={styles.sub}>
                  {moment.unix(eventDateTime.seconds).format("MMMM Do, YYYY")}{" "}
                  at {moment.unix(eventDateTime.seconds).format("h:mm A")}
                </Text>

                <Text style={styles.titlesub}>Attendees</Text>
                {eventAttendees.map((attendee) => (
                  <Text key={attendee.userID} style={styles.subp}>
                    {/* SPRINT7: remove conditional, uncomment {attendee.name} */}
                    {attendee.userName == undefined
                      ? "This list is using an old format. Let Robbie know! "
                      : attendee.userName}
                    {/* {attendee.name} */}
                  </Text>
                ))}

                <Divider orientation="horizontal" />

                {!isCreator && (
                  <Button
                    titleStyle={{ color: "white" }}
                    buttonStyle={{
                      borderWidth: 1,
                      borderColor: "black",
                      titleColor: "black",
                      backgroundColor: "#3B4046",
                    }}
                    title={!isAttending ? "Register" : "Unregister"}
                    onPress={() => {
                      if (!isAttending) {
                        registerEvent(
                          {
                            eventID: props.route.params?.id,
                            eventCreator: eventCreator,
                            eventName: eventName,
                            eventAddress: eventAddress,
                            eventLoop: eventLoop,
                            eventStartDateTime: eventDateTime,
                            newAttendeesNotifID: newAttendeesNotifID,
                          },
                          { userID, userName }
                        );
                      } else {
                        unregisterEvent(
                          {
                            eventID: props.route.params?.id,
                            eventCreator: eventCreator,
                            eventName: eventName,
                            eventAddress: eventAddress,
                            eventLoop: eventLoop,
                            eventStartDateTime: eventDateTime,
                            newAttendeesNotifID: newAttendeesNotifID,
                          },
                          { userID, userName }
                        );
                      }
                    }}
                  />
                )}
              </View>
            </ScrollView>
          }
        />

        {!(Platform.OS == "android" && editMode) && (
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "position" : "height"}
            keyboardVerticalOffset={100}
            enabled={!editMode}
          >
            {/* May want to fiddle with keyboardVerticalOffeset number a bit */}
            <Card
              containerStyle={{
                ...styles.cardDesign,
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              <Formik
                initialValues={{
                  postText: "",
                }}
                onSubmit={(values, actions) => {
                  if (values.postText === "") {
                    Alert.alert("Error", "Cannot create a post with no text");
                  } else {
                    createPost(
                      {
                        eventID: props.route.params?.id,
                        creatorID: eventCreator.userID,
                        eventName: eventName,
                        newPostsNotifID: newPostsNotifID,
                      },
                      {
                        userID: userID,
                        userName: userName,
                      },
                      values.postText.trim()
                    );

                    if (isCreator) {
                      Alert.alert(
                        "Send notification?",
                        "Do you want to notify your attendees about your post?",
                        [
                          {
                            text: "No",
                          },
                          {
                            text: "Yes",
                            onPress: () => {
                              handleNotifyAllUsers("announcement");
                            },
                          },
                        ]
                      );
                    }
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
                      style={{ maxHeight: 100, color: "white" }}
                    />
                    <Button
                      titleStyle={{ color: "white" }}
                      buttonStyle={{
                        borderWidth: 1,
                        borderColor: "black",
                        titleColor: "black",
                        backgroundColor: "#2B7D9C",
                      }}
                      title="Post"
                      disabled={!isAttending || editMode}
                      onPress={props.handleSubmit}
                    />
                  </>
                )}
              </Formik>
            </Card>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({
  events: state.events,
});

const mapDispatchToProps = (dispatch) => ({
  //registerEvent: (event, user) => dispatch(registerEvent(event, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);

const styles = StyleSheet.create({
  Title: {
    marginBottom: 5,
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  titlesub: {
    fontSize: 25,
    paddingBottom: 2,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  sub: {
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  subt: {
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  subp: {
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 5,
    color: "white",
  },
  cardDesign: {
    backgroundColor: "#3B4046",
    borderColor: "black",
  },
  buttonDesign: {
    backgroundColor: "#2B7D9C",
    borderColor: "black",
  },
});
