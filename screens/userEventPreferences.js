import {
  ImageBackground,
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { CheckBox, Card, Button, Text } from "react-native-elements";

import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import { setUserLoops } from "../shared/firebaseMethods";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHight = Dimensions.get("window").height;
// const setUserLoopsSchema = yup.object({
//   joinedLoops: yup.array.required("Please select at least 1 interest."),
// });

export default function UserEventPreferences({ navigation }) {
  const [checkSports, setCheckSports] = useState(false);
  const [checkMusic, setCheckMusic] = useState(false);
  const [checkVolunteer, setCheckVolunteer] = useState(false);
  const [checkGame, setCheckGame] = useState(false);
  const [checkSocial, setCheckSocial] = useState(false);
  const [checkArts, setCheckArts] = useState(false);
  const [checkOutdoors, setCheckOutdoors] = useState(false);
  const [checkAcademic, setCheckAcademic] = useState(false);
  const [checkMedia, setCheckMedia] = useState(false);

  return (
    <View>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-photo/gray-abstract-wireframe-technology-background_53876-101941.jpg?size=626&ext=jpg",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={globalStyles.container}>
          <View style={{ alignItems: "center" }}>
            <Formik
              initialValues={{
                Sports: false,
                Music: false,
                Volunteer: false,
                Game: false,
                Social: false,
                Arts: false,
                Outdoors: false,
                Academic: false,
                Media: false,
              }}
              //validationSchema={setUserLoopsSchema}
              onSubmit={(joinedLoops) => {
                var success = setUserLoops(joinedLoops, navigation);
                if (success) {
                  Alert.alert(
                    "Success!",
                    "Loop preferences successfully saved!"
                  );
                  //actions.resetForm();
                }
              }}
            >
              {(props) => (
                <>
                  <View>
                    <Text style={globalStyles.titleText}></Text>
                    <Text style={globalStyles.titleText}>
                      Please select at least 1 area of interest.
                    </Text>
                    <View style={styles.container}>
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Sports"
                          // title={<Text style={{}}>Sports</Text>}
                          //textStyle={(size = 30)}
                          checkedIcon="futbol-o"
                          uncheckedIcon="futbol-o"
                          checkedColor="#2B7D9C"
                          checked={checkSports}
                          onPress={() => {
                            setCheckSports(!checkSports);
                            props.setFieldValue("Sports", !checkSports);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          checkedIcon="music"
                          uncheckedIcon="music"
                          checkedColor="#2B7D9C"
                          title="Music"
                          checked={checkMusic}
                          onPress={() => {
                            setCheckMusic(!checkMusic);
                            props.setFieldValue("Music", !checkMusic);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Volunteer"
                          checkedColor="#2B7D9C"
                          checkedIcon="plus"
                          uncheckedIcon="plus"
                          checked={checkVolunteer}
                          onPress={() => {
                            setCheckVolunteer(!checkVolunteer);
                            props.setFieldValue("Volunteer", !checkVolunteer);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Game"
                          checkedIcon="gamepad"
                          uncheckedIcon="gamepad"
                          checkedColor="#2B7D9C"
                          checked={checkGame}
                          onPress={() => {
                            setCheckGame(!checkGame);
                            props.setFieldValue("Game", !checkGame);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Social"
                          checkedIcon="users"
                          uncheckedIcon="users"
                          checkedColor="#2B7D9C"
                          checked={checkSocial}
                          onPress={() => {
                            setCheckSocial(!checkSocial);
                            props.setFieldValue("Social", !checkSocial);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Arts"
                          checkedIcon="paint-brush"
                          uncheckedIcon="paint-brush"
                          checkedColor="#2B7D9C"
                          checked={checkArts}
                          onPress={() => {
                            setCheckArts(!checkArts);
                            props.setFieldValue("Arts", !checkArts);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Outdoors"
                          checkedIcon="pagelines"
                          uncheckedIcon="pagelines"
                          checkedColor="#2B7D9C"
                          checked={checkOutdoors}
                          onPress={() => {
                            setCheckOutdoors(!checkOutdoors);
                            props.setFieldValue("Outdoors", !checkOutdoors);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          title="Academic"
                          checkedIcon="book"
                          uncheckedIcon="book"
                          checkedColor="#2B7D9C"
                          checked={checkAcademic}
                          onPress={() => {
                            setCheckAcademic(!checkAcademic);
                            props.setFieldValue("Academic", !checkAcademic);
                          }}
                        />
                      </View>
                      {/* </View>
                  <View style={styles.container}> */}
                      <View style={styles.boxContainer}>
                        <CheckBox
                          size={40}
                          fontSize="80"
                          title="Media"
                          checkedIcon="camera"
                          uncheckedIcon="camera"
                          checkedColor="#2B7D9C"
                          checked={checkMedia}
                          onPress={() => {
                            setCheckMedia(!checkMedia);
                            props.setFieldValue("Media", !checkMedia);
                          }}
                        />
                      </View>
                    </View>

                    <Text style={globalStyles.errorText}>
                      {props.touched.eventLoop && props.errors.eventLoop}
                    </Text>

                    <View />
                    <View>
                      <Button
                        title="Save Preferences"
                        titleStyle={{ fontSize: 26, color: "black" }}
                        buttonStyle={{
                          borderWidth: 10,
                          borderWidth: 1,
                          borderColor: "black",
                          titleColor: "black",
                          backgroundColor: "#2B7D9C",
                        }}
                        style={{ flex: 1 }}
                        onPress={props.handleSubmit}
                        // onPress={() => {
                        //   console.log(props.values);
                        // }}
                      />
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLoop: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: "#ffab8a",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // if you want to fill rows left to right
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  boxContainer: {
    width: "50%",
    height: "20%",
  },
});

//Credit to Robbie for his eventCreation.js code.
