import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import {
  BorderlessButton,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { loggingOut, getUserData } from "../shared/firebaseMethods";
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

export default function Home({ navigation, route }) {
  // const email = route.params?.userData.email ?? 'email';
  // const firstName = route.params?.userData.firstName ?? 'firstName';
  // const lastName = route.params?.userData.lastName ?? 'lastName';
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
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
                startDateTime: doc.data().startDateTime,
                creatorID: doc.data().creatorID,
              },
            ]);
          });
        });
    }
  }, [userID, isFocused]);

  const list = [
    {
      name: "Event 1",
      subtitle: "Short Descrp",
    },
    {
      name: "Event 2",
      subtitle: "Short Descrp",
    },
    {
      name: "Event3",
      subtitle: "or location",
    },
  ];

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ borderBottomColor: "black", borderBottomWidth: 3 }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            h2
            style={{ textAlign: "center" }}
          >
            Welcome Back {"\n"} {firstName || ""}!
          </Text>
        </View>

        <View style={{ backgroundColor: "black" }}>
          <Text h3 style={{ textAlign: "center", color: "orange" }}>
            Your Upcoming Events...
          </Text>
        </View>

        <View>
          <ScrollView
            height={380}
            persistentScrollbar={true}
            style={styles.scrollView}
          >
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() =>
                  navigation.navigate("CardDetails", {
                    id: event.id,
                    name: event.name,
                    creatorID: event.creatorID,
                    startDateTime: event.startDateTime,
                  })
                }
              >
                <ListItem //.Swipeable
                  bottomDivide
                  //onRightSwipe
                  //onLeftSwipe
                  bottomDivider={true}
                  Component={TouchableScale}
                  friction={90} //
                  tension={100} // These props are passed to the parent component (here TouchableScale)
                  activeScale={0.95} //
                  linearGradientProps={{
                    colors: ["#ffa835", "#F44336"],
                    start: { x: 1, y: 0 },
                    end: { x: 0.2, y: 0 },
                  }}
                  ViewComponent={LinearGradient}
                >
                  <ListItem.Content>
                    <ListItem.Title
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      {event.name}
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ color: "white" }}>
                      {moment
                        .unix(event.startDateTime)
                        .format("MMMM Do, hh:mm A")}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron color="white" />
                </ListItem>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ flex: 1 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              margin: 10,
            }}
          >
            <Button
              title="Sign Out"
              onPress={() => loggingOut(navigation)}
            ></Button>
          </View>
          <View style={{ flex: 0.3 }}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
