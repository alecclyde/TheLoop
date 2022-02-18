import {
  ImageBackground,
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
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

// const SignUpSchema = yup
//   .object()
//   .shape({
//     Sports: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Music: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Volunteer: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Game: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Social: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Arts: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Outdoors: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Academic: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//     Media: yup
//       .boolean()
//       .oneOf([true], "Must select at least one area of interest."),
//   })
//   .atLeastOneOf([
//     "Sports",
//     "Music",
//     "Volunteer",
//     "Game",
//     "Social",
//     "Arts",
//     "Outdoors",
//     "Academic",
//     "Media",
//   ]);

const SignUpSchema = yup.object({
  Checked: yup.boolean().oneOf([true], "Must have at least one box checked."),
});

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
  const [valid, setValid] = useState(false);

//   useEffect(() => {
//     if (
//       checkMedia ||
//       checkAcademic ||
//       checkArts ||
//       checkGame ||
//       checkMusic ||
//       checkOutdoors ||
//       checkSocial ||
//       checkSports ||
//       checkVolunteer
//     ) {
//       console.log("-------------------------------------")
//       console.log("MEDIA: " + checkMedia);
//       console.log("Academic: " + checkAcademic);
//       console.log("Arts: " + checkArts);
//       console.log("Game: " + checkGame);
//       console.log("Music: " + checkMusic);
//       console.log("Outdoors: " + checkOutdoors);
//       console.log("Social: " + checkSocial);
//       console.log("Sports: " + checkSports);
//       console.log("Volunteer: " + checkVolunteer);
//       console.log("true");
//       setValid(true);
//     } else {
//       console.log("-------------------------------------")
//       console.log("MEDIA: " + checkMedia);
//       console.log("Academic: " + checkAcademic);
//       console.log("Arts: " + checkArts);
//       console.log("Game: " + checkGame);
//       console.log("Music: " + checkMusic);
//       console.log("Outdoors: " + checkOutdoors);
//       console.log("Social: " + checkSocial);
//       console.log("Sports: " + checkSports);
//       console.log("Volunteer: " + checkVolunteer);
//       console.log("false");
//       setValid(false);
//     }
// })

  return (
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
            // Checked: false,
          }}
          validationSchema={SignUpSchema}
          //validationSchema={setUserLoopsSchema}
          onSubmit={(joinedLoops) => {
            // console.log("-------------------------------------")
            // console.log("MEDIA: " + joinedLoops.Media);
            // console.log("Academic: " + joinedLoops.Academic);
            // console.log("Arts: " + joinedLoops.Arts);
            // console.log("Game: " + joinedLoops.Game);
            // console.log("Music: " + joinedLoops.Music);
            // console.log("Outdoors: " + joinedLoops.Outdoors);
            // console.log("Social: " + joinedLoops.Social);
            // console.log("Sports: " + joinedLoops.Sports);
            // console.log("Volunteer: " + joinedLoops.Volunteer);
            // console.log(joinedLoops.Checked);
            setUserLoops(joinedLoops, navigation);
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
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Sports{"\n"}
                        </Text>
                      }
                      // title={<Text style={{}}>Sports</Text>}
                      //textStyle={(size = 30)}
                      checkedIcon="futbol-o"
                      uncheckedIcon="futbol-o"
                      checkedColor="#2B7D9C"
                      checked={checkSports}
                      onPress={() => {
                        setCheckSports(!checkSports);
                        props.setFieldValue("Sports", !checkSports);
                        // props.setFieldValue("Checked", valid);
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
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Music{"\n"}
                        </Text>
                      }
                      checked={checkMusic}
                      onPress={() => {
                        setCheckMusic(!checkMusic);
                        props.setFieldValue("Music", !checkMusic);
                        // props.setFieldValue("Checked", valid);
                      }}
                    />
                  </View>
                  {/* </View>
                  <View style={styles.container}> */}
                  <View style={styles.boxContainer}>
                    <CheckBox
                      size={40}
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Volunteer{"\n"}
                        </Text>
                      }
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
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Game{"\n"}
                        </Text>
                      }
                      checkedIcon="gamepad"
                      uncheckedIcon="gamepad"
                      checkedColor="#2B7D9C"
                      checked={checkGame}
                      onPress={() => {
                        setCheckGame(!checkGame);
                        props.setFieldValue("Game", !checkGame);
                        // props.setFieldValue("Checked", valid);
                      }}
                    />
                  </View>
                  {/* </View>
                  <View style={styles.container}> */}
                  <View style={styles.boxContainer}>
                    <CheckBox
                      size={40}
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Social{"\n"}
                        </Text>
                      }
                      checkedIcon="users"
                      uncheckedIcon="users"
                      checkedColor="#2B7D9C"
                      checked={checkSocial}
                      onPress={() => {
                        setCheckSocial(!checkSocial);
                        props.setFieldValue("Social", !checkSocial);
                        // props.setFieldValue("Checked", valid);
                      }}
                    />
                  </View>
                  {/* </View>
                  <View style={styles.container}> */}
                  <View style={styles.boxContainer}>
                    <CheckBox
                      size={40}
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Arts{"\n"}
                        </Text>
                      }
                      checkedIcon="paint-brush"
                      uncheckedIcon="paint-brush"
                      checkedColor="#2B7D9C"
                      checked={checkArts}
                      onPress={() => {
                        setCheckArts(!checkArts);
                        props.setFieldValue("Arts", !checkArts);
                        // props.setFieldValue("Checked", valid);
                      }}
                    />
                  </View>
                  {/* </View>
                  <View style={styles.container}> */}
                  <View style={styles.boxContainer}>
                    <CheckBox
                      size={40}
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Outdoors{"\n"}
                        </Text>
                      }
                      checkedIcon="pagelines"
                      uncheckedIcon="pagelines"
                      checkedColor="#2B7D9C"
                      checked={checkOutdoors}
                      onPress={() => {
                        setCheckOutdoors(!checkOutdoors);
                        props.setFieldValue("Outdoors", !checkOutdoors);
                        // props.setFieldValue("Checked", valid);
                      }}
                    />
                  </View>
                  {/* </View>
                  <View style={styles.container}> */}
                  <View style={styles.boxContainer}>
                    <CheckBox
                      size={40}
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Academic{"\n"}
                        </Text>
                      }
                      checkedIcon="book"
                      uncheckedIcon="book"
                      checkedColor="#2B7D9C"
                      checked={checkAcademic}
                      onPress={() => {
                        setCheckAcademic(!checkAcademic);
                        props.setFieldValue("Academic", !checkAcademic);
                        // props.setFieldValue("Checked", valid);
                      }}
                    />
                  </View>
                  {/* </View>
                  <View style={styles.container}> */}
                  <View style={styles.boxContainer}>
                    <CheckBox
                      size={40}
                      title={
                        <Text style={styles.titleStyle}>
                          {"\n"}Media{"\n"}
                        </Text>
                      }
                      checkedIcon="camera"
                      uncheckedIcon="camera"
                      checkedColor="#2B7D9C"
                      checked={checkMedia}
                      onPress={() => {
                        setCheckMedia(!checkMedia);
                        props.setFieldValue("Media", !checkMedia);
                        // props.setFieldValue("Checked", valid);
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
                    onPress={props.handleSubmit}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
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
  titleStyle: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
});

//Credit to Robbie for his eventCreation.js code.
