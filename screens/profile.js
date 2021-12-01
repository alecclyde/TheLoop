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
import { Button, ListItem, Avatar, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

function Profile(props, { navigation }) {
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
          if (doc.exists) {
            setEvents((events) => [
              ...events,
              {
                id: doc.id,
                loop: doc.data().loop,
                name: doc.data().name,
                creatorID: doc.data().creatorID,
                address: doc.data().address,
              },
            ]);
          }
        });
      });
  }, [isFocused]);
  return (
    <View
    style={{
      backgroundColor: "#D3D3D3"
    }}
    >
      {/* <Header
        centerComponent={"Profile"}
        containerStyle={{
          backgroundColor: "#2C2C2C",
          //justifyContent: "space-around",
        }}
      /> */}
        <FlatList
          //contentContainerStyle={{ paddingBottom: }}
          persistentScrollbar={true}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clickable}
              onPress={() =>
                props.navigation.navigate("CardDetails", {
                  id: item.id,
                  loop: item.loop,
                  name: item.name,
                  creatorID: item.creatorID,
                  address: item.address,
                })
              }
            >
              <ListItem
                pad={16}
                bottomDivide
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
                    {item.name}
                  </ListItem.Title>
                  <ListItem.Subtitle style={styles.descriptionItem}>
                    {item.loop}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle style={styles.descriptionItem}>
                    <Icon name="map-marker" size={16} color="white" />
                    {"  "}
                    {item.address}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="gray" />
              </ListItem>
            </TouchableOpacity>
          )}
        />
    </View>
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
    backgroundColor: "#2C2C2C",
    alignSelf: "center",
    borderWidth: 0,
    width: 365,
    borderRadius: 10,
    borderColor: "#2C2C2C",
    paddingVertical: 5,
    margin: 5,
  },
});

const mapStateToProps = (state) => ({
  events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
