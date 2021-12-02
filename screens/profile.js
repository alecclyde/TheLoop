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
import { getUserData } from "../shared/firebaseMethods";
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

  const isFocused = useIsFocused();

  // Listener to update user data
  function AuthStateChangedListener(user) {
    if (user) {
      setUserID(user.uid);
      getUserData(user.uid).then((user) => {
        setEmail(user.email);
        setFirstName(user.firstName);
        setLastName(user.lastName);
      });
    } else {
      setUserID();
      setEmail("");
      setFirstName("");
      setLastName("");
    }
  }

  useEffect(() => {
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(AuthStateChangedListener);
    return () => {
      unsubscriber;
    };
  }, []);

  useEffect(() => {
    if (userID != null) {
      setEvents([]);
      firebase
        .firestore()
        .collection("events")
        .where("attendees", "array-contains", userID)
        .orderBy("startDateTime")
        .get()

        .then((snap) => {
          snap.forEach((doc) => {
            setEvents((events) => [
              ...events,
              {
                id: doc.id,
                name: doc.data().name,
                loop: doc.data().loop,
                startDateTime: doc.data().startDateTime,
                creatorID: doc.data().creatorID,
                address: doc.data().address,
              },
            ]);
          });
        });
    }
  }, [userID, isFocused]);
  console.log(props.user);

  return (
      <SafeAreaView style={globalStyles.container}>
        <View style={{backgroundColor:"#D3D3D3"}}>
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={{uri: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png'}}/>

                <Text style={styles.name}>{firstName} {lastName} </Text>
                <Text style={styles.userInfo}>{email} </Text>
            </View>
          </View>


          <View style={{ backgroundColor: "black" }}>
            <Text h3 style={{ textAlign: "center", color: "#ffa835" }}>
              Upcoming Events
            </Text>
          </View>


            <ScrollView
              persistentScrollbar={true}
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
            </ScrollView>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:{
    ...Platform.select({
      ios: {
        backgroundColor: '#FFA500'
      },
      android: {
        backgroundColor: '#FFA500'
      },
    })
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
  },
  userInfo:{
    fontSize:16,
    color:"#000000",
    fontWeight:'600',
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
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
    backgroundColor: "#2C2C2C",
    alignSelf: "center",
    borderWidth: 0,
    width: 365,
    borderRadius: 10,
    borderColor: "#2C2C2C",
    paddingVertical: 5,

    //margin: 5,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: (navigation) => dispatch(signOut(navigation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
