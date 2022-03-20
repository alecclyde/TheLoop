import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getUserData, getEventData, editPost } from "../shared/firebaseMethods";
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

function Home(props, { navigation, route }) {
  // const email = route.params?.userData.email ?? 'email';
  // const firstName = route.params?.userData.firstName ?? 'firstName';
  // const lastName = route.params?.userData.lastName ?? 'lastName';
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userID, setUserID] = useState("");

  const [events, setEvents] = useState([]);
  const [eventIDs, setEventIDs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [limitUpcoming, setLimitUpcoming] = useState(3);
  const [limitPrevious, setLimitPrevious] = useState(3);
  const [limitHosting, setLimitHosting] = useState(3);

  const isFocused = useIsFocused();

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
  //console.log(props.user);

  // useEffect(() => {
  //   setEvents([]);

  //   if (userID) {
  //     eventIDs.forEach((eventID) => {
  //       getEventData(eventID).then((event) => {
  //         let creator;

  //         // SPRINT7: collapse this to just use event.creator
  //         if (event.creator == undefined) {
  //           creator = { userID: event.creatorID, userName: "" };
  //         } else {
  //           creator = event.creator;
  //         }
  //         setEvents((events) => [
  //           ...events,
  //           {
  //             id: eventID,
  //             name: event.name,
  //             loop: event.loop,
  //             startDateTime: event.startDateTime,
  //             creator: creator,
  //             address: event.address,
  //           },
  //         ]);
  //       });
  //     });
  //   }
  // }, [eventIDs]);

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
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Join an Event on the Search Page!
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {events // upcoming events
              .filter((item) => item.startDateTime > moment().unix())
              .sort((item1, item2) => item1.startDateTime - item2.startDateTime)
              .slice(0, limitUpcoming)
              .map((event) => (
                <TouchableOpacity
                  style={styles.clickable}
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
                    <Avatar
                      size="large"
                      //change this to either be icon of loop or that groups profile picture
                      source={{
                        uri: "https://business.twitter.com/content/dam/business-twitter/insights/may-2018/event-targeting.png.twimg.1920.png",
                      }}
                      resizeMode="cover"
                      //style={{ width: "100%", height: "100%" }}
                    />
                    <ListItem.Content>
                      <ListItem.Title style={styles.listingItem}>
                        {event.name.substring(0, 15)}
                      </ListItem.Title>
                      <ListItem.Subtitle style={styles.descriptionItem}>
                        {event.loop}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle style={styles.descriptionItem}>
                        <Icon name="map-marker" size={16} color="white" />
                        {"  "}
                        {event.address}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color="gray" />
                  </ListItem>
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
        Previous Events
      </Text>

      <View style={{ flex: 1 }}>
        {events.filter((item) => item.startDateTime <= moment().unix())
          .length == 0 ? ( // if there are currently no events for this category
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
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Attend Some Events and Create Memories!
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {events // previous events the user attended
              .filter((item) => item.startDateTime <= moment().unix())
              .sort((item1, item2) => item2.startDateTime - item1.startDateTime)
              .slice(0, limitPrevious)
              .map((event) => (
                <TouchableOpacity
                  style={styles.clickable}
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
                    <Avatar
                      size="large"
                      //change this to either be icon of loop or that groups profile picture
                      source={{
                        uri: "https://business.twitter.com/content/dam/business-twitter/insights/may-2018/event-targeting.png.twimg.1920.png",
                      }}
                      resizeMode="cover"
                      //style={{ width: "100%", height: "100%" }}
                    />
                    <ListItem.Content>
                      <ListItem.Title style={styles.listingItem}>
                        {event.name}
                      </ListItem.Title>
                      <ListItem.Subtitle style={styles.descriptionItem}>
                        {event.loop}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle style={styles.descriptionItem}>
                        <Icon name="map-marker" size={16} color="white" />
                        {"  "}
                        {event.address}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color="gray" />
                  </ListItem>
                </TouchableOpacity>
              ))}
            {events.filter((item) => item.startDateTime <= moment().unix())
              .length > limitPrevious && (
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
                      {events.filter(
                        (item) => item.startDateTime <= moment().unix()
                      ).length - limitPrevious}{" "}
                      more event
                      {/* puts the 's' at the end if the number of remaining events is not 1 */}
                      {events.filter(
                        (item) => item.startDateTime <= moment().unix()
                      ).length -
                        limitPrevious ==
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
                  fontFamily: "Helvetica-Bold",
                }}
              >
                Use the Event Creation Page to Plan a Banger!
              </Text>
            </View>
          )
        ) : (
          // if there are events in the filter, put them in the ScrollView
          <ScrollView persistentScrollbar={true} horizontal={true}>
            {events // upcoming events the user is hosting
              .filter(
                (item) =>
                  item.creator.userID == userID &&
                  item.startDateTime > moment().unix()
              )
              .sort((item1, item2) => item1.startDateTime - item2.startDateTime)
              .slice(0, limitHosting)

              .map((event) => (
                <TouchableOpacity
                  style={styles.clickable}
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
                    <Avatar
                      size="large"
                      //change this to either be icon of loop or that groups profile picture
                      source={{
                        uri: "https://business.twitter.com/content/dam/business-twitter/insights/may-2018/event-targeting.png.twimg.1920.png",
                      }}
                      resizeMode="cover"
                      //style={{ width: "100%", height: "100%" }}
                    />
                    <ListItem.Content>
                      <ListItem.Title style={styles.listingItem}>
                        {event.name}
                      </ListItem.Title>
                      <ListItem.Subtitle style={styles.descriptionItem}>
                        {event.loop}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle style={styles.descriptionItem}>
                        <Icon name="map-marker" size={16} color="white" />
                        {"  "}
                        {event.address}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color="gray" />
                  </ListItem>
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

      {/* </View> */}
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
    fontFamily: "Helvetica-Bold",
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
