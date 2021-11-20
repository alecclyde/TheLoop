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
    <View>
      <ImageBackground
        source={{
          uri: "data:image/jpeg;base64,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",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      >
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
                  colors: ["#232323", "#232323"],
                  start: { x: 1, y: 0 },
                  end: { x: 0.2, y: 0 },
                }}
                ViewComponent={LinearGradient}
              >
                <Avatar
                  size="large"
                  //change this to either be icon of loop or that groups profile picture
                  source={{
                    uri: "https://64.media.tumblr.com/51ce939c3b7570134515eea1c7eb59ff/tumblr_n2pgeb86ro1tw7pebo1_400.jpg",
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
      </ImageBackground>
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
    backgroundColor: "#232323",
    alignSelf: "center",
    borderWidth: 0,
    width: 365,
    borderRadius: 10,
    borderColor: "#232323",
    paddingVertical: 5,
    margin: 5,
  },
});

const mapStateToProps = (state) => ({
  events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
