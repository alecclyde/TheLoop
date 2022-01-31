import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getUserData, getEventData } from "../shared/firebaseMethods";
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

function Profile(props, { navigation, route }) {
  // const email = route.params?.userData.email ?? 'email';
  // const firstName = route.params?.userData.firstName ?? 'firstName';
  // const lastName = route.params?.userData.lastName ?? 'lastName';
  const [email, setEmail] = useState(props.user.email);
  const [firstName, setFirstName] = useState(props.user.firstName);
  const [lastName, setLastName] = useState(props.user.LastName);
  const [userID, setUserID] = useState(props.user.userID);
  const [eventIDs, setEventIDs] = useState([]);
  const [events, setEvents] = useState([]);


  // work around an error when logging out
  useEffect(() => {
    if (props.user != null) {
      setEmail(props.user.email);
      setFirstName(props.user.firstName);
      setLastName(props.user.LastName);
      setEventIDs(props.user.myEvents);
    }
  });


  const isFocused = useIsFocused();

  // Listener to update user data
  // function AuthStateChangedListener(user) {
  //   if (user) {
  //     setUserID(user.uid);
  //     getUserData(user.uid).then((user) => {
  //       setEmail(user.email);
  //       setFirstName(user.firstName);
  //       setLastName(user.lastName);
  //     });
  //   } else {
  //     setUserID();
  //     setEmail("");
  //     setFirstName("");
  //     setLastName("");
  //   }
  // }

  // useEffect(() => {
  //   const unsubscriber = firebase
  //     .auth()
  //     .onAuthStateChanged(AuthStateChangedListener);
  //   return () => {
  //     unsubscriber;
  //   };
  // }, []);

  useEffect(() => {
    if (props.user) {
      eventIDs.forEach((eventID) => {
        getEventData(eventID).then((event) => {

          let creator;

          // SPRINT7: collapse this to just use event.creator
          if (event.creator == undefined) {
            creator = {userID: event.creatorID, userName: ""}
          } else {
            creator = event.creator
          }
          setEvents((events) => [
            ...events,
            {
              id: eventID,
              name: event.name,
              loop: event.loop,
              startDateTime: event.startDateTime,
              creator: creator,
              address: event.address,
            }
          ]);
        });
      });
    }
  }, []);
  //console.log(props.user);

  return (
    <SafeAreaView style={globalStyles.container}>
        <View style={{...globalStyles.header, height: "40%"}}>
          <View style={styles.headerContent}>
            <Image
              style={globalStyles.avatar}
              source={{
                uri: "https://p.kindpng.com/picc/s/678-6789790_user-domain-general-user-avatar-profile-svg-hd.png",
              }}
            />

            <Text style={globalStyles.name}>
              {firstName} {lastName}{" "}
            </Text>
            <Text style={globalStyles.userInfo}>{email} </Text>
          </View>
        </View>


          <View style={styles.statusBar}>
            
          <View style={styles.statusBarText}>
            <View style={styles.statusBarTextLine}>
              <Text style={styles.statusBarTextLine}>
                Followers
              </Text>
            </View>
            <View style={styles.statusBarTextLine}>
            <Text style={styles.statusBarTextLine}>
                12aaaaaaaaaaaaaaaaaaaaaa
              </Text>
            </View>
          </View>

          <View style={styles.verticleLine}></View>

          <View style={styles.statusBarText}>
          <Text style={styles.statusBarTextLine}>
              Following
            </Text>
            <Text style={styles.statusBarTextLine}>
              12
            </Text>
          </View>

          <View style={styles.verticleLine}></View>

          <View style={styles.statusBarText}>
          <Text style={styles.statusBarTextLine}>
              Loops
            </Text>
            <Text style={styles.statusBarTextLine}>
              12
            </Text>
          </View>
              
          </View>




            <Text h3 style={styles.titles}>
              Upcoming Events
            </Text>


            

            <ScrollView
              persistentScrollbar={true}
              horizontal={true}
              style={{ flex: 1 }}
            >
              {events.map((event) => (
                <TouchableOpacity
                  style={styles.clickable}
                  key={event.id}
                  onPress={() =>
                    props.navigation.navigate("CardDetails", {
                      id: event.id,
                      name: event.name,
                      loop: event.loop,
                      creatorID: event.creatorID,
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
            </ScrollView>

        
{/* 
        <View style={{ backgroundColor: "black" }}>
          <Text h3 style={{ textAlign: "center", color: "#ffa835" }}>
            Upcoming Events
          </Text>
        </View>

        <ScrollView persistentScrollbar={true}>
          {events.map((event) => (
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
                  colors: ["#2C2C2C", "#2C2C2C"],
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
        </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
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
    margin: 5,
    paddingVertical: 37,
    shadowOffset: {width: 1, height: .1},
    shadowOpacity: 0.8,
    shadowColor: 'black',
  },
  statusBar: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#3B4046",
    borderRadius: 10,
    margin: 5,
    paddingVertical: 37,
    shadowOffset: {width: 1, height: .1},
    shadowOpacity: 0.8,
    shadowColor: 'black',
    alignSelf: "stretch",
    flexDirection: "row",
  },

    titles: {
    textAlign: "left",
    color: "white",
    marginLeft: 10,
    fontFamily: 'Helvetica-Bold',
  },

  statusBarText:{
    margin: 5,
    flex: 1,
    flexDirection: "row",
    //justifyContent: "center",
    //fontSize: 12,
    flexWrap: "wrap",
  },

  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
    textAlign: "center",
  },

  statusBarTextLine:{
    flex: 1,
    width: "100%",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    flexDirection: "row",
    flexBasis: "50%",
    flexWrap: "wrap",
  }




});

const mapStateToProps = (state) => ({
  user: state.user,
  events: state.events,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: (navigation) => dispatch(signOut(navigation)),
  getEvents: () => dispatch(getEvents()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
