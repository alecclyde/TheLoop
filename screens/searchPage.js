// import { StyleSheet, View, Text, Dimensions, Searchbar } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";

import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { globalStyles } from "../styles/global";
import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar, withTheme } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableScale } from "react-native-touchable-scale";
import { Button, ListItem, Avatar } from "react-native-elements";
// import { Dimensions } from "react-native";
import { connect } from "react-redux";

// const height = Dimensions.get("window").height * 0.3;
// const width = Dimensions.get("window").width;

function Search(props, { navigation }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState({ text: "" });
  const isFocused = useIsFocused();
  const latitude = 41.241489;
  const longitude = -77.041924;
  const position = 0;

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
                creator:
                  // SPRINT7: remove conditional, uncomment actual line
                  doc.data().creator == undefined
                    ? { userID: doc.data().creatorID, userName: "" }
                    : doc.data().creator,
                //doc.data().creator,
                address: doc.data().address,
              },
            ]);
          }
        });
      });
  }, [isFocused]);

  return (
    <SafeAreaView
      style={{ ...globalStyles.container, backgroundColor: "#2B7D9C" }}
    >
      <View style={[styles.holder, { flexDirection: "column" }]}>
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder="Type Here..."
            onChangeText={(text) => {
              setSearch({ text });
            }}
            value={search.text}
          />
        </View>
        <View style={[styles.container, { flex: 2 }]}>
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
                    creator: item.creator,
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

        <View style={[styles.container, { flex: 3 }]}>
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.05,
            }}
            customMapStyle={mapStyle}
            loadingEnabled={true}

            //onPoiClick={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
          >
            <Marker
              draggable
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
              title={"Messiah University"}
              description={"position"}
            />
          </MapView>
          <TouchableOpacity
            style={styles.expander}
            onPress={() => props.navigation.navigate("MapView")}
          >
            <Icon
              //style={styles.icon}
              //reverse
              name="expand"
              color="white"
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const styles = StyleSheet.create({
  container: {
    color: "white",
    margin: 5,
  },
  holder: {
    flex: 1,
    //padding: 0,
  },
  expander: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
    borderRadius: 75,
    backgroundColor: "#696969",
    left: 315,
  },
  mapStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paragraph: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    //marginTop: -50,
  },
  listingItem: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionItem: {
    color: "white",
  },
});

const mapStateToProps = (state) => ({
  events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
