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
  ScrollView,
} from "react-native";
import { loggingOut, getUserData } from "../shared/firebaseMethods";
import * as firebase from "firebase";
import { globalStyles } from "../styles/global";
import { useIsFocused } from "@react-navigation/native";
import { Switch } from "react-native-elements";
import { Button } from "react-native-elements";
import { CheckBox } from "react-native-elements";
import { Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { connect } from "react-redux";
import { signOut, updatePfpSource } from "../store/actions/userActions";
import { Input } from "react-native-elements";
import {
  toggleDarkmode,
  toggleNotifications,
} from "../store/actions/settingsActions";
import { Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";

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
  const [userID, setUserID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [pfpStep, setPfpStep] = useState(1);

  const [imageData, setImageData] = useState(null);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  // const [userID, setUserID] = useState("");

  // const [events, setEvents] = useState([]);

  // const isFocused = useIsFocused();
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState(null);

  const scaleHeight = (image) => {
    let actualWidth = windowWidth * 0.75;
    let scale = image.width / actualWidth;
    let actualHeight = image.height / scale;

    return actualHeight;
  };

  // from https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
  async function uploadImageAsync(uri) {
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network Request Failed!"));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageLocation = "profile-pics/" + userID + ".jpg";
    const storage = firebase.storage();
    const ref = storage.ref(imageLocation);

    ref.put(blob).then((snapshot) => {
      storage
        .ref(imageLocation)
        .getDownloadURL()
        .then((url) => {
          // should probably move this into firebase methods
          // console.log(url)
          firebase
            .firestore()
            .collection("users")
            .doc(userID)
            .update({
              profilePicSource: url,
            })
            .then((snap) => {
              // redux action to update pfp uri
              console.log(typeof url);
              props.updatePfpSource(url.toString());
            });
        });
    });

    // blob.close();
  }

  //work around an error when logging out
  useEffect(() => {
    if (props.user != null) {
      setEmail(props.user.email);
      setFirstName(props.user.firstName);
      setLastName(props.user.LastName);
      setPfpSource(props.user.profilePicSource);
    }
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserID(user.uid);
      }
    });
  }, []);
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
    <View >
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
                  backgroundColor: "#2B7D9C",
                  width: "85%",
                  // height: "80%",
                  borderWidth: windowWidth * 0.05, // used to be percents in quotes, but android did android things
                  borderColor: "#2B7D9C",
                  borderRadius: windowWidth * 0.05,
                }}
              >
                {pfpStep == 1 && (
                  <View style={styles.body1}>
                    <Button
                      title="Open Camera"
                      buttonStyle={{
                        height: 50,
                        marginBottom: 10,
                        backgroundColor: "#3e3e3e",
                        borderColor: "#2B7D9C"
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
                        backgroundColor: "#3e3e3e",
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
                {pfpStep == 2 && (
                  <View>
                    <Button
                      title="go back"
                      onPress={() => {
                        setPfpStep(1);
                      }}
                      buttonStyle={{
                        height: 50,
                      }}
                    />

                    <Image
                      source={{
                        uri: imageData.uri,
                        height: Math.min(
                          scaleHeight(imageData),
                          windowHeight * 0.5
                        ),
                      }}
                      resizeMode="contain"
                    />
                    <Button
                      title="Set as profile picture"
                      onPress={async () => {
                        await uploadImageAsync(imageData.uri);
                        setModalVisible(false);
                        setPfpStep(1);
                      }}
                      buttonStyle={{
                        height: 50,
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <View style={styles.body1}>
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
        {/* <View style={styles.item}>
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
        </View> */}

        {/* <View style={styles.item}>
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
        </View> */}

        {/* <View
          style={{ justifyContent: "center", alignItems: "center", margin: 5 }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ marginBottom: 10, marginRight: 3 }}>
                <Button
                  buttonStyle={styles.Button}
                  title="  Privacy Policy"
                  onPress={() =>
                    Linking.openURL(
                      "https://github.com/alecclyde/TheLoop/blob/main/Privacy-Policy.md"
                    )
                  }
                  icon={<Icon name="user-secret" size={15} color="white" />}
                />
              </View>
              <View style={styles.settingButton}>
                <Button
                  buttonStyle={styles.Button}
                  title=" Terms&Conditions"
                  onPress={() =>
                    Linking.openURL(
                      "https://github.com/alecclyde/TheLoop/blob/main/Terms%26Conditions.md"
                    )
                  }
                  icon={<Icon name="gavel" size={15} color="white" />}
                />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={styles.settingButton}>
                <Button
                  buttonStyle={styles.Button}
                  title="  Change Location"
                  onPress={() =>
                    props.navigation.navigate("LocationPreferencesPage")
                  }
                  icon={<Icon name="rocket" size={15} color="white" />}
                />
              </View>
              <View style={styles.settingButton}>
                <Button
                  buttonStyle={styles.Button}
                  title="  Change Loops"
                  onPress={() =>
                    props.navigation.navigate("UserEventPreferences", {
                      settings: true,
                    })
                  }
                  icon={<Icon name="rocket" size={15} color="white" />}
                />
              </View>
            </View>
          </View>
          <View style={{}}>
            <View style={styles.settingButton}>
              <Button 
                buttonStyle={styles.Button}
                title=" Feedback"
                onPress={() =>
                  Linking.openURL(
                    "https://docs.google.com/forms/d/e/1FAIpQLSdwOLeqnDlB1Y3age2MK5EMtCMKINHl1yf53ztW7FFklmkNTQ/viewform?usp=sf_link"
                  )
                }
                icon={<Icon name="pencil-square-o" size={15} color="white" />}
              />
            </View>
            <View style={styles.settingButton}>
              <Button
                buttonStyle={styles.Button}
                title=" Sign Out "
                onPress={() => props.signOut(props.navigation)}
                icon={<Icon name="sign-out" size={15} color="white" />}
              ></Button>
            </View>
          </View>
        </View> */}
        <ScrollView>
          <Button
            buttonStyle={styles.Button}
            title="  Privacy Policy"
            onPress={() =>
              Linking.openURL(
                "https://github.com/alecclyde/TheLoop/blob/main/Privacy-Policy.md"
              )
            }
            icon={<Icon name="user-secret" size={15} color="white" />}
          />

          <Button
            buttonStyle={styles.Button}
            title=" Terms&Conditions"
            onPress={() =>
              Linking.openURL(
                "https://github.com/alecclyde/TheLoop/blob/main/Terms%26Conditions.md"
              )
            }
            icon={<Icon name="gavel" size={15} color="white" />}
          />
          <Button
            buttonStyle={styles.Button}
            title="  Change Location"
            onPress={() => props.navigation.navigate("LocationPreferencesPage")}
            icon={<Icon name="rocket" size={15} color="white" />}
          />
          <Button
            buttonStyle={styles.Button}
            title="  Change Loops"
            onPress={() =>
              props.navigation.navigate("UserEventPreferences", {
                settings: true,
              })
            }
            icon={<Icon name="rocket" size={15} color="white" />}
          />
          <Button
            buttonStyle={styles.Button}
            title=" Feedback"
            onPress={() =>
              Linking.openURL(
                "https://docs.google.com/forms/d/e/1FAIpQLSdwOLeqnDlB1Y3age2MK5EMtCMKINHl1yf53ztW7FFklmkNTQ/viewform?usp=sf_link"
              )
            }
            icon={<Icon name="pencil-square-o" size={15} color="white" />}
          />
          <Button
            buttonStyle={styles.Button}
            title=" Sign Out "
            onPress={() => props.signOut(props.navigation)}
            icon={<Icon name="sign-out" size={15} color="white" />}
          ></Button>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body1: {
    backgroundColor: "#3B4046",

  },
  body: {
    backgroundColor: "#2B7D9C",
    height: 500,
    padding: 5,
  },
  item: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  settingButton: {
    marginBottom: 10,
    marginRight: 3,
    borderRadius: 10,
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
  Button: {
    backgroundColor: "#3B4046",
    height: 45,
    marginVertical: 10,
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
  updatePfpSource: (pfpSource) => dispatch(updatePfpSource(pfpSource)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);
