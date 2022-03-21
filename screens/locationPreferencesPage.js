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
import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar, withTheme } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableScale } from "react-native-touchable-scale";
import { Button, ListItem, Avatar } from "react-native-elements";
// import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { addDistance, setLocation } from "../store/actions/userActions";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../styles/global";
import { Formik } from "formik";
import { Constants, Location, Permissions } from "expo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "@env";

//navigator.geolocation = require("@react-native-community/geolocation");
//navigator.geolocation = require("react-native-geolocation-service");

const windowWidth = Dimensions.get("window").width;
const windowHight = Dimensions.get("window").height;

function LocationPreferencesPage(props) {
  const [range, setRange] = useState(parseInt(props.user.distanceTolerance) + " mile");
  const [searchQuery, setSearchQuery] = React.useState("");
  //const [sliding, setSliding] = useState("Inactive");
  const [search, setSearch] = useState({ text: "" });
  const isFocused = useIsFocused();
  const [latitude, setLatitude] = useState(props.user.location.latitude || 40.15974);
  const [longitude, setLongitude] = useState(props.user.location.longitude|| -76.988419);
  const position = 0;
  const messiahPlace = {
    description: "Messiah University",
    geometry: { location: { lat: 40.15974, lng: -76.988419 } },
  };
  

  return (
    <SafeAreaView
    style={{ ...globalStyles.container, backgroundColor: "#2B7D9C" }}
  >
      <View style={[styles.holder, { flexDirection: "column" }]}>
        <View style={{ flex: 3}}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => {
              setLatitude(details.geometry.location.lat);
              setLongitude(details.geometry.location.lng);
            }}
            getDefaultValue={() => {
              return ""; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: API_KEY,
              language: "en", // language of the results
              types: "(cities)", // default: 'geocode'
            }}
            styles={{
              textInput: {
              height: 38,
              color: 'black',
              fontSize: 16,
              },
              description: {
                fontWeight: "bold",
                borderColor: "black",
                titleColor: "black",
                borderRadius: 40,
              },
              predefinedPlacesDescription: {
                color: "#1faadb",
              },
            }}
            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance",
              //types: "food",
            }}
            filterReverseGeocodingByTypes={[
              "locality",
              "administrative_area_level_3",
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            predefinedPlaces={[messiahPlace]}
            debounce={200}
          />
        </View>
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
            scrollEnabled={false}

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
              center={{ latitude: latitude, longitude: longitude }}
              radius={parseInt(range) * 1609.34}
              strokeColor="rgba(43, 125, 156,.85)"
              fillColor="rgba(170, 218, 255, .3)"
            />
          </MapView>
        </View>

        <View style={[styles.container, { flex: 3 }]}>
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
            minimumTrackTintColor="#3B4046"
            maximumTrackTintColor="#3B4046"
            thumbTintColor="#3B4046"
          />
        </View>
        <View style={[styles.container, { flex: 3 }]}>
          <Button
            title="Submit"
            titleStyle={{ fontSize: 26, color: "#FFFFFF" }}
            buttonStyle={{
              borderWidth: 10,
              borderWidth: 1,
              width: windowWidth * 0.5,
              height: windowHight * 0.08,
              borderColor: "black",
              titleColor: "black",
              backgroundColor: "#3B4046",
              borderRadius: 40,
            }}
            style={{ padding: 0 }}
            onPress={() => {
              props.setLocation(latitude, longitude);
              props.addDistance(parseInt(range), props.navigation);
            }}
            //onPress={() => {(props).handleSubmit}}
            // onPress={() => {
            //   console.log(parseInt(range) + " miles");
            // }}
          />
        </View>
        {/* </>
          )} */}
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
    width: windowWidth - 50,
    height: 40,
  },
  mileText: {
    margin: windowHight * 0.02,
    fontSize: 24,
    fontWeight: "bold",
  },
});
const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  addDistance: (range, navigation) => dispatch(addDistance(range, navigation)),
  setLocation: (latitude, longitude) =>
    dispatch(setLocation(latitude, longitude)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationPreferencesPage);

//Credit Code Palace: https://www.youtube.com/watch?v=MwSudWtT7ps&ab_channel=ProgrammingwithMosh
