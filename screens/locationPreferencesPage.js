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
import MapView, { Circle, Marker } from "react-native-maps";
import Geolocation, {
  getCurrentPosition,
} from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";
import { SearchBar, withTheme } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableScale } from "react-native-touchable-scale";
import { Button, ListItem, Avatar } from "react-native-elements";
// import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { TouchableHighlight } from "react-native-gesture-handler";

function LocationPreferencesPage(props, { navigation }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState({ text: "" });
  const isFocused = useIsFocused();
  const latitude = 41.241489;
  const longitude = -77.041924;
  const position = 0;

  //Gets all the events from the database and sets them to the events
  useEffect(() => {}, [isFocused]);

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-photo/gray-abstract-wireframe-technology-background_53876-101941.jpg?size=626&ext=jpg",
      }}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    >
      <View style={[styles.holder, { flexDirection: "column" }]}>
        <View style={[styles.container, { flex: 1 }]}>
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
            <MapView.Circle
              center={{ latitude: 41.241489, longitude: -77.041924 }}
              radius={500}
              strokeColor="transparent"
              fillColor={"red"}
            />
          </MapView>
        </View>
      </View>
    </ImageBackground>
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
    margin: 0,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationPreferencesPage);
