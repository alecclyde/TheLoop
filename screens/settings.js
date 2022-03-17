import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { loggingOut, getUserData } from "../shared/firebaseMethods";
import * as firebase from "firebase";
import { globalStyles } from "../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { Switch } from "react-native-elements";
import { Button } from "react-native-elements";
import { CheckBox } from "react-native-elements";
import { Linking } from "react-native";

import { connect } from "react-redux";
import { signOut } from "../store/actions/userActions";
import { Input } from "react-native-elements";
import {
  toggleDarkmode,
  toggleNotifications,
} from "../store/actions/settingsActions";
import { Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";

const windowWidth = Dimensions.get("window").width;
const windowHight = Dimensions.get("window").height;

function UserProfileView(props) {
  // const email = route.params?.userData.email ?? 'email';
  // const firstName = route.params?.userData.firstName ?? 'firstName';
  // const lastName = route.params?.userData.lastName ?? 'lastName';
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pfpSource, setPfpSource] = useState(
    "https://p.kindpng.com/picc/s/678-6789790_user-domain-general-user-avatar-profile-svg-hd.png"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [pfpStep, setPfpStep] = useState(1);

  const [imageData, setImageData] = useState(null);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height * 0.5;

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  // const [userID, setUserID] = useState("");

  // const [events, setEvents] = useState([]);

  // const isFocused = useIsFocused();
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState(null);

  //work around an error when logging out
  useEffect(() => {
    if (props.user != null) {
      setEmail(props.user.email);
      setFirstName(props.user.firstName);
      setLastName(props.user.LastName);
      setPfpSource(props.user.profilePicSource);
    }
  });
  // Listener to update user data
  // function AuthStateChangedListener(user) {
  //   if (user) {
  //     setUserID(user.uid);
  //     getUserData(user.uid).then((user) => {
  //       setEmail(user.email);
  //       setFirstName(user.firstName);
  //       setLastName(user.lastName);
  //     }
  //     );
  //   } else {
  //     setUserID();
  //     setEmail("");
  //     setFirstName("");
  //     setLastName("");
  //   }
  // }

  // useEffect(() => {
  //   const unsubscriber = firebase
  //     .auth()
  //     .onAuthStateChanged(AuthStateChangedListener);
  //   return () => {
  //     unsubscriber;
  //   };
  // }, []);

  // useEffect(() => {
  //   setEvents([]);
  //   firebase
  //   .firestore()
  //   .collection('events')
  //   .where('attendees', 'array-contains', props.user.uid)
  //   .orderBy('startDateTime')
  //   .get()

  //   .then((snap) => {
  //     snap.forEach((doc) => {
  //       setEvents((events) => [...events, {id: doc.id, name: doc.data().name, startDateTime: doc.data().startDateTime, creatorID: doc.data().creatorID}])
  //     })
  //   })

  // }, [userID, isFocused])
  // props.navigation.navigate("LogIn");
  return (
    <View style={styles.container}>
      <View>
        {/* modal here */}
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <TouchableOpacity
            onPress={() => {
              if (pfpStep == 1) setModalVisible(false);
            }}
            style={{ flex: 1 }}
            activeOpacity={1}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
            >
              <View
                style={{
                  // justifyContent: "center",
                  backgroundColor: "white",
                  width: "75%",
                  borderWidth: "20%",
                  borderColor: "white",
                  borderRadius: "15%",
                }}
              >
                {pfpStep == 1 && (
                  <View>
                    <Button
                      title="Open Camera"
                      buttonStyle={{
                        height: 50,
                        marginBottom: 10,
                      }}
                      onPress={async () => {
                        const { status } =
                          await ImagePicker.requestCameraPermissionsAsync();
                        if (status == "granted") {
                          const image = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          });
                          if (!image.cancelled) {
                            setImageData(image);
                            setPfpStep(2);
                          }
                        } else {
                          alert("Please allow camera roll permissions.");
                        }
                      }}
                    />
                    <Button
                      title="Choose from Photos"
                      buttonStyle={{
                        height: 50,
                      }}
                      onPress={async () => {
                        const { status } =
                          await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status == "granted") {
                          const image =
                            await ImagePicker.launchImageLibraryAsync({
                              mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            });
                          if (!image.cancelled) {
                            setImageData(image);
                            setPfpStep(2);
                          }
                        } else {
                          alert("Please allow camera roll permissions.");
                        }
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          {/* Add this -> https://blog.waldo.io/add-an-image-picker-react-native-app/ */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              style={globalStyles.avatar}
              source={{
                uri: pfpSource,
              }}
            />
          </TouchableOpacity>
          <Text style={globalStyles.name}>
            {firstName} {lastName}{" "}
          </Text>
          <Text style={globalStyles.userInfo}>{email} </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.item}>
          <View style={styles.infoContent}>
            <Text style={styles.info}>Dark Mode</Text>
          </View>
          <View style={styles.switch}>
            <Switch
              trackColor={{ false: "#767577", true: "#FFA500" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => props.toggleDarkmode()}
              value={props.settings.darkMode}
            />
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.infoContent}>
            <Text style={styles.info}>Push Notifications</Text>
          </View>
          <View style={styles.switch}>
            <Switch
              trackColor={{ false: "#767577", true: "#FFA500" }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => props.toggleNotifications()}
              value={props.settings.pushNotifications}
            />
          </View>
        </View>
        {/* 
            <View style={styles.item}>
              <View style={styles.infoContent}>
                <Text style={styles.info}>Setting Option 2</Text>
              </View>
              <CheckBox
                />
            </View>

            <View style={styles.item}>
              <View style={styles.infoContent}>
                <Text style={styles.info}>Setting Options 3</Text>
              </View>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="useless placeholder"
                />
            </View> */}

        {/* <View style={styles.item}>
              <View style={styles.infoContent}>
                <Text style={styles.info}>Maybe Button to go to preferences or other like security</Text>
              </View>
              <Button
                title="Solid Button"
                buttonStyle={{
                      borderWidth: 1,
                      borderColor: "black",
                      titleColor: "black",
                      backgroundColor: "#FFA500",
                    }}
                />
            </View> */}

        <View
          style={{ justifyContent: "center", alignItems: "center", margin: 5 }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
            }}
          >
            <Button
              title="Privacy Policy"
              onPress={() =>
                Linking.openURL(
                  "https://github.com/alecclyde/TheLoop/blob/main/Privacy-Policy.md"
                )
              }
            ></Button>
            <Button
              title="Terms & Conditions"
              onPress={() =>
                Linking.openURL(
                  "https://github.com/alecclyde/TheLoop/blob/main/Terms%26Conditions.md"
                )
              }
            ></Button>
          </View>
          <Button
            title="Sign Out"
            onPress={() => props.signOut(props.navigation)}
          ></Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#DCDCDC",
    height: 500,
  },
  item: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  infoContent: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 5,
  },
  iconContent: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  switch: {
    paddingRight: 15,
    alignItems: "flex-end",
    flexDirection: "row",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  info: {
    fontSize: 18,
    marginTop: 15,
    color: "#000000",
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
  settings: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: (navigation) => dispatch(signOut(navigation)),
  toggleDarkmode: () => dispatch(toggleDarkmode()),
  toggleNotifications: () => dispatch(toggleNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);
