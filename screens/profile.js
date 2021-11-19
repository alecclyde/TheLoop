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
          uri: "https://wallpaperaccess.com/full/1260080.jpg",
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
                })
              }
            >
              <ListItem
                // width={350}
                // height={100}
                pad={16}
                bottomDivide
                //bottomDivider={true}
                Component={TouchableScale}
                friction={90} //
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
                    uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngitem.com%2Fmiddle%2FhhmRJo_profile-icon-png-image-free-download-searchpng-employee%2F&psig=AOvVaw1nu2_4XE-Qi1_c2NTmGh8m&ust=1637426818221000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMCUhbHwpPQCFQAAAAAdAAAAABAD",
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
