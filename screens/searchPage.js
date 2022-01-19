// import { StyleSheet, View, Text, Dimensions, Searchbar } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { FontAwesome } from "@expo/vector-icons";
// import * as Location from "expo-location";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  FlatList,
  TouchableOpacity, 
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableScale } from "react-native-touchable-scale";
import { Button, ListItem, Avatar } from "react-native-elements";
import { globalStyles } from "../styles/global";





export default function Search({ navigation }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState({text: ''});
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
            setEvents((events) => [...events, {id: doc.id, loop: doc.data().loop, name: doc.data().name, creatorID: doc.data().creatorID}])
          };
        });
      });
  }, [isFocused]);




  return (
    <View>
        <SearchBar
  placeholder="Type Here..."
  onChangeText={(text)=> {setSearch({text})}}
  value={search.text}
/>
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
                  id: item.id,
                  loop: item.loop,
                  name: item.name,
                  creatorID: item.creatorID,
                })
              }
            >
              <ListItem
                bottomDivide
                bottomDivider={true}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                linearGradientProps={{
                  colors: ["#FF9800", "#F44336"],
                  start: { x: 1, y: 4 },
                  end: { x: 0.2, y: 0 },
                }}
                ViewComponent={LinearGradient}
              >
                <ListItem.Content>
                  <ListItem.Title style={globalStyles.listingItem}>
                    {item.name}
                  </ListItem.Title>
                  <ListItem.Subtitle style={globalStyles.descriptionItem}>
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




        













// const MapComponent = () => {
//   const [location, setLocation] = React.useState(null);
//   const [error, setError] = React.useState(null);

//   return (
//     <View>
//       {/* <Text style={styles.heading}>Map</Text> */}
//       <MapView style={styles.map}>
//         {location ? (
//           <Marker coordinate={location} title="My location">
//             <FontAwesome name="map-marker" size={40} color="#B12A5B" />
//           </Marker>
//         ) : (
//           <Text>{error}</Text>
//         )}
//       </MapView>
//     </View>
//   );
// };
// export default MapComponent;

// const styles = StyleSheet.create({
//   map: {
//     width: Dimensions.get("screen").width,
//     height: Dimensions.get("screen").height * 0.9,
//   },
//   heading: {
//     alignSelf: "center",
//     paddingTop: 20,
//     marginBottom: 10,
//     fontSize: 24,
//   },
// });


  // React.useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setError("Permission to access location was denied");
  //       return;
  //     }
  //     const locate = await Location.getCurrentPositionAsync({
  //       accuracy: 6,
  //     });
  //     setLocation(locate.coords);
  //   })();
  // }, []);
