// import { StyleSheet, View, Text, Dimensions, Searchbar } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";

import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Icon } from "react-native-elements";
import { SearchBar, withTheme } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
// import { Dimensions } from "react-native";
import { connect } from "react-redux";

// const height = Dimensions.get("window").height * 0.3;
// const width = Dimensions.get("window").width;

function mapView(props) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState({ text: "" });
  const isFocused = useIsFocused();
  const [latitude, setLatitude] = useState(props.user.location.latitude || 40.15974);
  const [longitude, setLongitude] = useState( props.user.location.longitude || -76.988419);
  // const latitude = 41.241489;
  // const longitude = -77.041924;
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
                creatorID: doc.data().creatorID,
              },
            ]);
          }
        });
      });
  }, [isFocused]);

  return (
    <View style={[styles.holder, { flexDirection: "column" }]}>
      <View style={[styles.container, { flex: 3 }]}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          }}
          loadingEnabled={true}
          customMapStyle={mapStyle}
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
      </View>
    </View>
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
  },
  holder: {
    flex: 1,
    padding: 0,
  },
  expander: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
    borderRadius: 75,
    backgroundColor: "#696969",
    left: 305,
  },
  mapStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paragraph: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    marginTop: -60,
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

export default connect(mapStateToProps, mapDispatchToProps)(mapView);
