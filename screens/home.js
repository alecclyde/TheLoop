import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  getUserData,
  getEventData,
  editPost,
  fixDeletedEvent,
} from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import { Text } from "react-native-elements";
import { Header } from "react-native-elements";
import { Button } from "react-native-elements";
import { ListItem, Avatar } from "react-native-elements";
import { TouchableScale } from "react-native-touchable-scale";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Divider } from "react-native-elements";
import * as firebase from "firebase";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { signOut } from "../store/actions/userActions";
import { color } from "react-native-elements/dist/helpers";
import { eventLoopThumbnail, eventLoopIconName } from "../shared/commonMethods";

function Home(props, { navigation, route }) {
  // const email = route.params?.userData.email ?? 'email';
  // const firstName = route.params?.userData.firstName ?? 'firstName';
  // const lastName = route.params?.userData.lastName ?? 'lastName';
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userID, setUserID] = useState("");

  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loopEvents, setLoopEvents] = useState([]);
  const [eventIDs, setEventIDs] = useState([]);
  const [loops, setLoops] = useState([]);

  const [loading, setLoading] = useState(true);

  const [limitUpcoming, setLimitUpcoming] = useState(3);
  const [limitPrevious, setLimitPrevious] = useState(3);
  const [limitHosting, setLimitHosting] = useState(3);

  const isFocused = useIsFocused();

  const eventListType = {
    upcoming: {
      emoji: "😎",
      text: "Join an Event on the Search Page!",
      limit: () => {
        return limitUpcoming;
      },
      updateLimit: () => {
        setLimitUpcoming(limitUpcoming + 3);
      },
    },
    previous: {
      emoji: "🥳",
      text: "Attend Some Events and Create Memories!",
      limit: () => {
        return limitPrevious;
      },
      updateLimit: () => {
        setLimitPrevious(limitPrevious + 3);
      },
    },
    hosting: {
      emoji: "😤",
      text: "Use the Event Creation Page to Plan an Event!",
      limit: () => {
        return limitHosting;
      },
      updateLimit: () => {
        setLimitHosting(limitHosting + 3);
      },
    },
  };

  /**
   * A list of sylized event cards. Should take a data prop that contains
   * a pre-filtered, pre-sorted array of data. Also the type of event, which
   * should correspond to one of the three "call to action" types.
   * data: the filtered, sorted array of data
   * type: extra data for fill out the list (from eventListType)
   */

  // maybe one day...
  const EventList = (listProps) => {
    return (
      <View style={{ flex: 1 }}>
        {listProps.data.length == 0 ? ( // if there are currently no events for this category
          loading ? (
            // if there are no events in the filter and the events are still loading, put an activity indicator
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            // if there are no events in the filter and the events have loaded, show text that says "no events"
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 45 }}>{listProps.type.emoji}</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontFamily: "Helvetica",
                  fontWeight: "bold",
                }}
              >
                {listProps.type.text}
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {listProps.data.slice(0, listProps.type.limit()).map((event) => (
              <TouchableOpacity
                style={[styles.clickable, { flex: 1, paddingVertical: 0 }]}
                key={event.id}
                onPress={() =>
                  props.navigation.navigate("CardDetails", {
                    id: event.id,
                    name: event.name,
                    loop: event.loop,
                    creator: event.creator,
                    startDateTime: event.startDateTime,
                    address: event.address,
                  })
                }
                onLongPress={() => {
                  console.log(event.id);
                }}
              >
                <ImageBackground
                  source={{
                    uri: eventLoopThumbnail(event.loop),
                  }}
                  style={{ height: "100%", width: "auto", minWidth: 200 }}
                  imageStyle={{ borderRadius: 10 }}
                  resizeMode="cover"
                  overflow="hidden"
                >
                  <LinearGradient
                    colors={["transparent", "#3B4046"]}
                    style={{ flex: 1, borderRadius: 10 }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        padding: 10,
                      }}
                    >
                      <Text style={styles.listingItem}>
                        {event.name.substring(0, 25)}
                        {event.name.length > 25 && "..."}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            name={eventLoopIconName(event.loop)}
                            size={16}
                            color="white"
                          />
                          <Icon name="map-marker" size={16} color="white" />
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            paddingLeft: 3,
                          }}
                        >
                          <Text style={styles.descriptionItem}>
                            {event.loop}
                          </Text>
                          <Text style={styles.descriptionItem}>
                            {event.address.substring(0, 30)}
                            {event.address.length > 30 && "..."}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
            {listProps.data.length > listProps.type.limit() && (
              <TouchableOpacity
                style={[styles.clickable, { flex: 1 }]}
                onPress={() => {
                  listProps.type.updateLimit();
                }}
              >
                <ListItem
                  pad={16}
                  bottomDivide={true}
                  Component={TouchableScale}
                  button
                  friction={90}
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  linearGradientProps={{
                    colors: ["#3B4046", "#3B4046"],
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                  }}
                  ViewComponent={LinearGradient}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.listingItem}>
                      {listProps.data.length - listProps.type.limit()} more
                      event
                      {/* puts the 's' at the end if the number of remaining events is not 1 */}
                      {listProps.data.length - listProps.type.limit() == 1
                        ? ""
                        : "s"}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.descriptionItem}>
                      Tap to view
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron color="gray" />
                </ListItem>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  // Listener to update user data
  function AuthStateChangedListener(user) {
    setEvents([]);
    if (user) {
      setUserID(user.uid);
    }
  }

  useEffect(() => {
    // console.log("page loaded")
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(AuthStateChangedListener);
    return () => {
      unsubscriber;
    };
  }, []);

  useEffect(() => {
    if (userID && isFocused) {
      setLoading(true);
      getUserData(userID).then((user) => {
        // setEmail(user.email);
        // setFirstName(user.firstName);
        // setLastName(user.lastName);
        setLimitUpcoming(3);
        setLimitPrevious(3);
        setLimitHosting(3);

        setEvents(user.myEvents);

        setLoading(false);
        // console.log("events loaded!")
        // setEventIDs(user.myEvents);
      });
    }
  }, [userID, isFocused]);

  //sets the loops the user is in to an array
  useEffect(() => {
    if (isFocused) {
      const identifier = Object.keys(props.user.joinedLoops);
      const active = identifier.filter(function (id) {
        return props.user.joinedLoops[id];
      });
      setLoops(active);
    }
    //console.log(props.user.joinedLoops);
  }, [isFocused]);

  // useEffect(() => {
  //   if (isFocused) {
  //     setAllEvents([]);
  //     firebase
  //       .firestore()
  //       .collection("events")
  //       .get()
  //       .then((snap) => {
  //         snap.docs.forEach((doc) => {
  //           if (doc.exists) {
  //             setAllEvents((events) => [
  //               ...events,
  //               {
  //                 id: doc.id,
  //                 loop: doc.data().loop,
  //                 name: doc.data().name,
  //                 creator: doc.data().creator,
  //                 address: doc.data().address,
  //                 location: doc.data().location,
  //               },
  //             ]);
  //           }
  //         });
  //       });
  //   }
  // }, [isFocused]);

  useEffect(() => {
    if (isFocused && loops.length != 0) {
      setLoopEvents([]);
      firebase
        .firestore()
        .collection("events")
        .where("loop", "in", loops)
        .get()
        .then((snap) => {
          let eventList = [];
          snap.docs.forEach((doc) => {
            if (doc.exists) {
              eventList.push({
                id: doc.id,
                loop: doc.data().loop,
                name: doc.data().name,
                creator: doc.data().creator,
                address: doc.data().address,
                location: doc.data().location,
              });
            }
          });
          setLoopEvents([...eventList]);
        });
    }
  }, [isFocused, loops]);

  return (
    <SafeAreaView
      style={{ ...globalStyles.container, backgroundColor: "#2B7D9C" }}
    >
      <Text h3 style={styles.titles}>
        Upcoming Events
      </Text>

      <View style={{ flex: 1 }}>
        {events.filter((item) => item.startDateTime > moment().unix()).length ==
        0 ? ( // if there are currently no events for this category
          loading ? (
            // if there are no events in the filter and the events are still loading, put an activity indicator
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            // if there are no events in the filter and the events have loaded, show text that says "no events"
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 45 }}>😎</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontFamily: "Helvetica",
                  fontWeight: "bold",
                }}
              >
                Join an Event on the Search Page!
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {events
              .filter((item) => item.startDateTime > moment().unix())
              .sort((item1, item2) => item1.startDateTime - item2.startDateTime)
              .slice(0, limitUpcoming)
              .map((event) => (
                <TouchableOpacity
                  style={[styles.clickable, { flex: 1, paddingVertical: 0 }]}
                  key={event.id}
                  onPress={() =>
                    props.navigation.navigate("CardDetails", {
                      id: event.id,
                      name: event.name,
                      loop: event.loop,
                      creator: event.creator,
                      startDateTime: event.startDateTime,
                      address: event.address,
                    })
                  }
                  onLongPress={() => {
                    console.log(event.id);
                    Alert.alert(
                      "Unregister event?",
                      "Remove this from your list of events?",
                      [
                        {
                          text: "no",
                        },
                        {
                          text: "yes",
                          onPress: () => {
                            // put an unregister event here too
                            fixDeletedEvent(userID, {
                              id: event.id,
                              name: event.name,
                              loop: event.loop,
                              creator: event.creator,
                              startDateTime: event.startDateTime,
                              address: event.address,
                            });
                          },
                        },
                      ]
                    );
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: eventLoopThumbnail(event.loop),
                    }}
                    style={{ height: "100%", width: "auto", minWidth: 200 }}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                    overflow="hidden"
                  >
                    <LinearGradient
                      colors={["transparent", "#3B4046"]}
                      style={{ flex: 1, borderRadius: 10 }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          padding: 10,
                        }}
                      >
                        <Text style={styles.listingItem}>
                          {event.name.substring(0, 25)}
                          {event.name.length > 25 && "..."}
                        </Text>

                        <Text style={styles.descriptionItem}>
                          <View style={{ width: 20, alignItems: "center" }}>
                            <Icon
                              name={eventLoopIconName(event.loop)}
                              size={16}
                              color="white"
                            />
                          </View>

                          {event.loop}
                        </Text>
                        <Text style={styles.descriptionItem}>
                          <View style={{ width: 20, alignItems: "center" }}>
                            <Icon name={"map-marker"} size={16} color="white" />
                          </View>

                          {event.address.substring(0, 30)}
                          {event.address.length > 30 && "..."}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            {events.filter((item) => item.startDateTime > moment().unix())
              .length > limitUpcoming && (
              <TouchableOpacity
                style={[styles.clickable, { flex: 1 }]}
                onPress={() => {
                  setLimitUpcoming(limitUpcoming + 3);
                }}
              >
                <ListItem
                  pad={16}
                  bottomDivide={true}
                  Component={TouchableScale}
                  button
                  friction={90}
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  linearGradientProps={{
                    colors: ["#3B4046", "#3B4046"],
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                  }}
                  ViewComponent={LinearGradient}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.listingItem}>
                      {events.filter(
                        (item) => item.startDateTime > moment().unix()
                      ).length - limitUpcoming}{" "}
                      more event
                      {/* puts the 's' at the end if the number of remaining events is not 1 */}
                      {events.filter(
                        (item) => item.startDateTime > moment().unix()
                      ).length -
                        limitUpcoming ==
                      1
                        ? ""
                        : "s"}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.descriptionItem}>
                      Tap to view
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron color="gray" />
                </ListItem>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      <Text h3 style={styles.titles}>
        Events in your loops
      </Text>

      <View style={{ flex: 1 }}>
        {/* {events.filter((item) => item.startDateTime <= moment().unix()) */}
        {loopEvents.length == 0 ? ( // if there are currently no events for this category
          loading ? (
            // if there are no events in the filter and the events are still loading, put an activity indicator
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            // if there are no events in the filter and the events have loaded, show text that says "no events"
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 45 }}>🥳</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontFamily: "Helvetica",
                  fontWeight: "bold",
                }}
              >
                Attend Some Events and Create Memories!
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {loopEvents
              .sort((item1, item2) => item2.startDateTime - item1.startDateTime)
              .slice(0, limitPrevious)
              .map((event) => (
                <TouchableOpacity
                  style={[styles.clickable, { flex: 1, paddingVertical: 0 }]}
                  key={event.id}
                  onPress={() =>
                    props.navigation.navigate("CardDetails", {
                      id: event.id,
                      name: event.name,
                      loop: event.loop,
                      creator: event.creator,
                      startDateTime: event.startDateTime,
                      address: event.address,
                    })
                  }
                  onLongPress={() => {
                    console.log(event.id);
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: eventLoopThumbnail(event.loop),
                    }}
                    style={{ height: "100%", width: "auto", minWidth: 200 }}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                    overflow="hidden"
                  >
                    <LinearGradient
                      colors={["transparent", "#3B4046"]}
                      style={{ flex: 1, borderRadius: 10 }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          padding: 10,
                        }}
                      >
                        <Text style={styles.listingItem}>
                          {event.name.substring(0, 25)}
                          {event.name.length > 25 && "..."}
                        </Text>

                        <Text style={styles.descriptionItem}>
                          <View style={{ width: 20, alignItems: "center" }}>
                            <Icon
                              name={eventLoopIconName(event.loop)}
                              size={16}
                              color="white"
                            />
                          </View>

                          {event.loop}
                        </Text>
                        <Text style={styles.descriptionItem}>
                          <View style={{ width: 20, alignItems: "center" }}>
                            <Icon name={"map-marker"} size={16} color="white" />
                          </View>

                          {event.address.substring(0, 30)}
                          {event.address.length > 30 && "..."}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            {loopEvents.length > limitPrevious && (
              <TouchableOpacity
                style={[styles.clickable, { flex: 1 }]}
                onPress={() => {
                  setLimitPrevious(limitPrevious + 3);
                }}
              >
                <ListItem
                  pad={16}
                  bottomDivide={true}
                  Component={TouchableScale}
                  button
                  friction={90}
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  linearGradientProps={{
                    colors: ["#3B4046", "#3B4046"],
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                  }}
                  ViewComponent={LinearGradient}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.listingItem}>
                      {loopEvents.length - limitPrevious} more event
                      {/* puts the 's' at the end if the number of remaining events is not 1 */}
                      {loopEvents.length - limitPrevious == 1 ? "" : "s"}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.descriptionItem}>
                      Tap to view
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron color="gray" />
                </ListItem>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      <Text h3 style={styles.titles}>
        Events You're Hosting
      </Text>

      <View style={{ flex: 1 }}>
        {events.filter(
          (item) =>
            item.creator.userID == userID &&
            item.startDateTime > moment().unix()
        ).length == 0 ? ( // if there are currently no events for this category
          loading ? (
            // if there are no events in the filter and the events are still loading, put an activity indicator
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            // if there are no events in the filter and the events have loaded, show text that says "no events"
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 45 }}>😤</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontFamily: "Helvetica",
                  fontWeight: "bold",
                }}
              >
                Use the Event Creation Page to Plan a Banger!
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {events
              .filter(
                (item) =>
                  item.creator.userID == userID &&
                  item.startDateTime > moment().unix()
              )
              .sort((item1, item2) => item1.startDateTime - item2.startDateTime)
              .slice(0, limitHosting)
              .map((event) => (
                <TouchableOpacity
                  style={[styles.clickable, { flex: 1, paddingVertical: 0 }]}
                  key={event.id}
                  onPress={() =>
                    props.navigation.navigate("CardDetails", {
                      id: event.id,
                      name: event.name,
                      loop: event.loop,
                      creator: event.creator,
                      startDateTime: event.startDateTime,
                      address: event.address,
                    })
                  }
                  onLongPress={() => {
                    console.log(event.id);
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: eventLoopThumbnail(event.loop),
                    }}
                    style={{ height: "100%", width: "auto", minWidth: 200 }}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                    overflow="hidden"
                  >
                    <LinearGradient
                      colors={["transparent", "#3B4046"]}
                      style={{ flex: 1, borderRadius: 10 }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          padding: 10,
                        }}
                      >
                        <Text style={styles.listingItem}>
                          {event.name.substring(0, 25)}
                          {event.name.length > 25 && "..."}
                        </Text>

                        <Text style={styles.descriptionItem}>
                          <View style={{ width: 20, alignItems: "center" }}>
                            <Icon
                              name={eventLoopIconName(event.loop)}
                              size={16}
                              color="white"
                            />
                          </View>

                          {event.loop}
                        </Text>
                        <Text style={styles.descriptionItem}>
                          <View style={{ width: 20, alignItems: "center" }}>
                            <Icon name={"map-marker"} size={16} color="white" />
                          </View>

                          {event.address.substring(0, 30)}
                          {event.address.length > 30 && "..."}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            {events.filter(
              (item) =>
                item.creator.userID == userID &&
                item.startDateTime > moment().unix()
            ).length > limitHosting && (
              <TouchableOpacity
                style={[styles.clickable, { flex: 1 }]}
                onPress={() => {
                  setLimitHosting(limitHosting + 3);
                }}
              >
                <ListItem
                  pad={16}
                  bottomDivide={true}
                  Component={TouchableScale}
                  button
                  friction={90}
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  linearGradientProps={{
                    colors: ["#3B4046", "#3B4046"],
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                  }}
                  ViewComponent={LinearGradient}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.listingItem}>
                      {events.filter(
                        (item) =>
                          item.creator.userID == userID &&
                          item.startDateTime > moment().unix()
                      ).length - limitHosting}{" "}
                      more event
                      {/* puts the 's' at the end if the number of remaining events is not 1 */}
                      {events.filter(
                        (item) =>
                          item.creator.userID == userID &&
                          item.startDateTime > moment().unix()
                      ).length -
                        limitHosting ==
                      1
                        ? ""
                        : "s"}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.descriptionItem}>
                      Tap to view
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron color="gray" />
                </ListItem>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listingItem: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionItem: {
    color: "white",
  },
  clickable: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#3B4046",
    borderRadius: 10,
    margin: 10,
    paddingVertical: 25,
    shadowOffset: { width: 1, height: 0.1 },
    shadowOpacity: 0.8,
    shadowColor: "black",
  },

  titles: {
    textAlign: "left",
    color: "white",
    marginLeft: 10,
    paddingVertical: 5,
    fontFamily: "Helvetica",
    fontWeight: "bold",
  },
});

//Initialize the states you want to use on the page
const mapStateToProps = (state) => ({
  user: state.user,
});

//Initialize what actions you are going to use on the page
const mapDispatchToProps = (dispatch) => ({
  signOut: (navigation) => dispatch(signOut(navigation)),
});

//send the state and actions to props of the function
export default connect(mapStateToProps, mapDispatchToProps)(Home);
