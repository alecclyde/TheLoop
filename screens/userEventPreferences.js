import {
  ImageBackground,
  View,
  SafeAreaView,
  Keyboard,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { CheckBox, Card, Button, Text } from "react-native-elements";

import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import { setUserLoops } from "../shared/firebaseMethods";

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
    <View
      style={{
        borderColor: "orange",
        borderWidth: 7,
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}
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
              var success = setUserLoops({
                joinedLoops,
              });
              if (success) {
                Alert.alert("Success!", "Loop preferences successfully saved!");
                //actions.resetForm();
              }
            }}
          >
            {(props) => (
              <>
                <Text style={globalStyles.titleText}></Text>
                <Text style={globalStyles.titleText}>
                  Please select 1 area of interest.
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Sports"
                      checked={checkSports}
                      onPress={() => {
                        setCheckSports(!checkSports);
                        props.setFieldValue("Sports", !checkSports);
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Music"
                      checked={checkMusic}
                      onPress={() => {
                        setCheckMusic(!checkMusic);
                        props.setFieldValue("Music", !checkMusic);
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Volunteer"
                      checked={checkVolunteer}
                      onPress={() => {
                        setCheckVolunteer(!checkVolunteer);
                        props.setFieldValue("Volunteer", !checkVolunteer);
                      }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Game"
                      checked={checkGame}
                      onPress={() => {
                        setCheckGame(!checkGame);
                        props.setFieldValue("Game", !checkGame);
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Social"
                      checked={checkSocial}
                      onPress={() => {
                        setCheckSocial(!checkSocial);
                        props.setFieldValue("Social", !checkSocial);
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Arts"
                      checked={checkArts}
                      onPress={() => {
                        setCheckArts(!checkArts);
                        props.setFieldValue("Arts", !checkArts);
                      }}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Outdoors"
                      checked={checkOutdoors}
                      onPress={() => {
                        setCheckOutdoors(!checkOutdoors);
                        props.setFieldValue("Outdoors", !checkOutdoors);
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Academic"
                      checked={checkAcademic}
                      onPress={() => {
                        setCheckAcademic(!checkAcademic);
                        props.setFieldValue("Academic", !checkAcademic);
                      }}
                    />
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <CheckBox
                      center
                      title="Media"
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
                      borderWidth: 1,
                      borderColor: "black",
                      titleColor: "black",
                      backgroundColor: "#ff7b00",
                    }}
                    style={{ padding: 45 }}
                    onPress={props.handleSubmit}
                    // onPress={() => {
                    //   console.log(props.values);
                    // }}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
      {/* </ImageBackground> */}
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
    alignItems: "center",
    justifyContent: "center",
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
});

//Credit to Robbie for his eventCreation.js code.
