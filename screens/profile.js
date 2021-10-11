import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableScale } from "react-native-touchable-scale";
import { Button, ListItem, Avatar } from "react-native-elements";

export default function Profile({ navigation }) {
  const [events, setEvents] = useState([]);
  const isFocused = useIsFocused();

  //Gets all the events from the database and sets them to the events
  useEffect(() => {
    setEvents([]);
    firebase
      .firestore()
      .collection("events")
      .get()
      .then((snap) => {
        snap.docs.forEach((doc) => {
          if (doc.exists) setEvents((events) => [...events, doc.data()]);
        });
      });
  }, [isFocused]);
  return (
    <View>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-photo/gray-abstract-wireframe-technology-background_53876-101941.jpg?size=626&ext=jpg",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      >
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CardDetails", {
                  address: item.address,
                  attendees: item.attendees,
                  creator: item.creator,
                  datetime: item.dateTime,
                  loop: item.loop,
                  name: item.name,
                })
              }
            >
              <ListItem
                bottomDivide
                bottomDivider={true}
                Component={TouchableScale}
                friction={90} //
                tension={100} // These props are passed to the parent component (here TouchableScale)
                activeScale={0.95} //
                linearGradientProps={{
                  colors: ["#FF9800", "#F44336"],
                  start: { x: 1, y: 0 },
                  end: { x: 0.2, y: 0 },
                }}
                ViewComponent={LinearGradient}
              >
                <ListItem.Content>
                  <ListItem.Title
                    style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                  >
                    {item.name}
                  </ListItem.Title>
                  <ListItem.Subtitle style={{ color: "white" }}>
                    {item.loop}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="white" />
              </ListItem>
            </TouchableOpacity>
          )}
        />
      </ImageBackground>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     fontSize: 24,
//     padding: 20,
//     borderRadius: 6,
//     elevation: 3,
//     backgroundColor: "#FFFFFF",
//     shadowOffset: { width: 1, height: 1 },
//     shadowColor: "#333",
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//     marginHorizontal: 4,
//     marginVertical: 6,
//   },
//   containerItem: {
//     flex: 9,
//     fontSize: 18,
//     padding: 25,
//     backgroundColor: "#FFFFFF",
//   },
//   descriptionItem: {
//     fontSize: 15,
//     flex: 3,
//   },
// });
