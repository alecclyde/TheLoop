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
import { SearchBar, withTheme } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableScale } from "react-native-touchable-scale";
import { Button, ListItem, Avatar } from "react-native-elements";
// import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { TouchableHighlight } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";
import { addDistance } from "../store/actions/eventActions";
import { Formik } from "formik";
import { Constants, Location, Permissions } from "expo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { PLACES_ID } from "@env";
//import { Searchbar } from "react-native-paper";

const windowWidth = Dimensions.get("window").width;
const windowHight = Dimensions.get("window").height;

function LocationPreferencesPage(props, { navigation }) {
  const [range, setRange] = useState("1 mile");
  const [searchQuery, setSearchQuery] = React.useState("");
  //const [sliding, setSliding] = useState("Inactive");
  const [search, setSearch] = useState({ text: "" });
  const isFocused = useIsFocused();
  const latitude = 41.241489;
  const longitude = -77.041924;
  const position = 0;
  //const left = (this.state.value * (windowWidth - 60)) / 100 - 15;

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-photo/gray-abstract-wireframe-technology-background_53876-101941.jpg?size=626&ext=jpg",
      }}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    >
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.container}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: PLACES_ID,
              language: "en",
            }}
          />
        </View>

        <View style={[styles.holder, { flexDirection: "column" }]}>
          {/* {(props) => (
            <> */}
          <View style={[styles.container, { flex: 6 }]}>
            <MapView
              style={styles.mapStyle}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.4,
                longitudeDelta: 0.04,
              }}
              region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: parseInt(range) * 0.05,
                longitudeDelta: 0.04,
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
                onDragEnd={(e) =>
                  alert(JSON.stringify(e.nativeEvent.coordinate))
                }
                title={"Messiah University"}
                description={"position"}
              />
              <MapView.Circle
                center={{ latitude: latitude, longitude: longitude }}
                radius={parseInt(range) * 1609.34}
                strokeColor="rgba(43, 125, 156,.85)"
                fillColor="rgba(170, 218, 255, .3)"
              />
            </MapView>
          </View>
          <View style={styles.slider}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              query={{
                key: PLACES_ID,
                language: "en",
              }}
              currentLocation={true}
              currentLocationLabel="Current location"
            />
          </View>
          <View style={[styles.container, { flex: 2 }]}>
            <Text style={styles.mileText}>{range}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={1}
              onValueChange={(value) => setRange(parseInt(value) + " miles")}
              //onSlidingStart={() => setSliding("Sliding")}
              //onSlidingComplete={() => setSliding("Inactive")}
              minimumTrackTintColor="#2B7D9C"
              maximumTrackTintColor="#2B7D9C"
              thumbTintColor="#2B7D9C"
            />
          </View>
          <View style={[styles.container, { flex: 1 }]}>
            <Button
              title="Submit"
              titleStyle={{ fontSize: 26, color: "#FFFFFF" }}
              buttonStyle={{
                borderWidth: 10,
                borderWidth: 1,
                width: windowWidth * 0.5,
                height: windowHight * 0.09,
                borderColor: "black",
                titleColor: "black",
                backgroundColor: "#2B7D9C",
                borderRadius: 50,
              }}
              style={{ padding: 45 }}
              onPress={props.addDistance(range)}
              // onPress={() => {
              //   console.log(parseInt(range) + " miles");
              // }}
            />
            <Button
              title="LOCATION"
              titleStyle={{ fontSize: 26, color: "#FFFFFF" }}
              buttonStyle={{
                borderWidth: 10,
                borderWidth: 1,
                width: windowWidth * 0.5,
                height: windowHight * 0.09,
                borderColor: "black",
                titleColor: "black",
                backgroundColor: "#2B7D9C",
                borderRadius: 50,
              }}
              style={{ padding: 45 }}
              //onPress={}
            />
          </View>
          {/* </>
          )} */}
        </View>
      </SafeAreaView>
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
    alignItems: "center",
  },
  holder: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  expander: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
    borderRadius: 75,
    backgroundColor: "#696969",
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
  },
  listingItem: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionItem: {
    color: "white",
  },
  slider: {
    width: windowWidth,
    height: 40,
  },
  mileText: {
    margin: windowHight * 0.02,
    fontSize: 24,
    fontWeight: "bold",
  },
});
const mapStateToProps = (state) => ({
  events: state.events,
});

const mapDispatchToProps = (dispatch) => ({
  addDistance: (event) => dispatch(addDistance(event)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationPreferencesPage);

//Credit Code Palace: https://www.youtube.com/watch?v=MwSudWtT7ps&ab_channel=ProgrammingwithMosh
