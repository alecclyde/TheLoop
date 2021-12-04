import {
  ImageBackground,
  View,
  SafeAreaView,
  ScrollView,
  Key,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { Text } from "react-native-elements";
import LinearGradient from 'expo-linear-gradient';

import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import moment from "moment";
import { addEvent } from "../store/actions/eventActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Test to make sure that a selected date and time hasn't happened yet
function isFutureDate(ref, msg) {
  return this.test({
    name: "isFutureDate",
    exclusive: false,
    message: msg || "You cannot create an event in the past",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      if (value == null || this.resolve(ref) == null) {
        return false;
      } else {
        return (
          moment(this.resolve(ref) + "T" + value).format("x") >
          moment().format("x")
        );
      }
    },
  });
}

yup.addMethod(yup.string, "isFutureDate", isFutureDate);

const CreateEventSchema = yup.object({
  eventName: yup.string().required("Please enter a name for your event"),
  eventLoop: yup.string().required("Please select a loop for your event"),
  eventDate: yup.string().required("Please select a date for your event"),
  eventTime: yup
    .string()

    .isFutureDate(yup.ref("eventDate"))
    .required("Please select a time for your event"),
  eventAddress: yup.string().required("Please enter an address for your event"),
});

function EventCreation(props) {
  const date = new Date();
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState();
  const [timeText, setTimeText] = useState();
  const [mode, setMode] = useState("date");
  const [loop, setLoop] = useState();

  // from https://github.com/react-native-datetimepicker/datetimepicker

  const onConfirm = (selectedDate) => {
    const currentDate = selectedDate || date;

    setShow(false);

    if (mode == "date") {
      setDateText(moment(currentDate).format("MMMM Do, YYYY"));
    }
    if (mode == "time") {
      setTimeText(moment(currentDate).format("hh:mm A"));
    }
  };

  const onCancel = () => {
    setShow(false);
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const showDatePicker = () => {
    showMode("date");
  };

  const showTimePicker = () => {
    showMode("time");
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >

    <ImageBackground
        source={{
          uri: "data:image/jpeg;base64,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",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%", position: "absolute"}}
        />

      <SafeAreaView style={globalStyles.container}>
        <View style={{ alignItems: "center" }}>
          <Formik
            initialValues={{
              eventName: "",
              eventLoop: "",
              eventDate: "",
              eventTime: "",
              eventAddress: "",
            }}
            validationSchema={CreateEventSchema}
            onSubmit={(values) => {

              var success = props.addEvent(
                {
                  name: values.eventName,
                  loop: values.eventLoop,
                  startDateTime: moment(values.eventDate + " " + values.eventTime).format("x"),
                  address: values.eventAddress,
                }
              );
              if (success) {
                Alert.alert("Success!", "Event successfully created!");
                //console.log(props.events);
                //actions.resetForm();
              }
            }}
          >
            {(props) => (
              // What is this magic diamond and why can't it be removed?
              // The world may never know.
              <>
                {/* <Text style={globalStyles.titleText}></Text> */}

                <Input
                  textAlign="center"
                  placeholder="*Event Title*"
                  value={props.values.eventName}
                  onChangeText={props.handleChange("eventName")}
                  onBlur={props.handleBlur("eventName")}
                  placeholderTextColor='white'
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.eventName && props.errors.eventName}
                </Text>

                {/* Touching the date button opens the date picker */}
                <Button
                  titleStyle={{ color: "white", width: 250 }}
                  buttonStyle={{
                    borderWidth: 1,
                    borderColor: "white",
                    titleColor: "black",
                    backgroundColor: "transparent",
                  }}
                  style={{ padding: 10 }}
                  title={dateText || "Date"}
                  onPress={showDatePicker}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.eventDate && props.errors.eventDate}
                </Text>

                {/* and touching the time button opens the time picker */}

                <Button
                  titleStyle={{ color: "white", width: 250 }}
                  buttonStyle={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "white",
                    titleColor: "black",
                    backgroundColor: "transparent",
                  }}
                  style={{ padding: 10 }}
                  title={timeText || "Time"}
                  onPress={showTimePicker}
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.eventTime && props.errors.eventTime}
                </Text>
                {
                  <DateTimePickerModal
                    // value={date}
                    mode={mode}
                    isVisible={show}
                    display="spinner"
                    textColor="black"
                    onConfirm={(date) => {
                      onConfirm(date);
                      // updates the date or time field value, depending on which one was selected
                      mode === "date" &&
                        props.setFieldValue(
                          "eventDate",
                          moment(date).format("YYYY-MM-DD")
                        );
                      mode === "time" &&
                        props.setFieldValue(
                          "eventTime",
                          moment(date).format("HH:mm:00ZZ")
                        );
                    }}
                    // onCancel is a required prop, so ignore this for now
                    onCancel={onCancel}
                  />
                }

                {/* <TextInput
                    style={globalStyles.input}
                    placeholder="Event Loop"
                    value={props.values.eventLoop}
                    onChangeText={props.handleChange("eventLoop")}
                    onBlur={props.handleBlur("eventLoop")}
                  /> */}

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Sports"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Sports");
                        props.setFieldValue("eventLoop", "Sports");
                      }}
                    >
                      <Text style={{color: "white"}}>Sports</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5, }}>
                    <TouchableOpacity
                      style={[
                        loop == "Music"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Music");
                        props.setFieldValue("eventLoop", "Music");
                      }}
                    >
                      <Text style={{color: "white"}}>Music</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Volunteer"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Volunteer");
                        props.setFieldValue("eventLoop", "Volunteer");
                      }}
                    >
                      <Text style={{color: "white"}}>Volunteer</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Game"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Game");
                        props.setFieldValue("eventLoop", "Game");
                      }}
                    >
                      <Text style={{color: "white"}}>Game</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Social"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Social");
                        props.setFieldValue("eventLoop", "Social");
                      }}
                    >
                      <Text style={{color: "white"}}>Social</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Arts"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Arts");
                        props.setFieldValue("eventLoop", "Arts");
                      }}
                    >
                      <Text style={{color: "white"}}>Arts</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Outdoors"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Outdoors");
                        props.setFieldValue("eventLoop", "Outdoors");
                      }}
                    >
                      <Text style={{color: "white"}}>Outdoors</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Academic"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Academic");
                        props.setFieldValue("eventLoop", "Academic");
                      }}
                    >
                      <Text style={{color: "white"}}>Academic</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                    <TouchableOpacity
                      style={[
                        loop == "Media"
                          ? styles.selectedLoop
                          : globalStyles.input,
                        { alignItems: "center" },
                      ]}
                      onPress={() => {
                        setLoop("Media");
                        props.setFieldValue("eventLoop", "Media");
                      }}
                    >
                      <Text style={{color: "white"}}>Media</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={globalStyles.errorText}>
                  {props.touched.eventLoop && props.errors.eventLoop}
                </Text>
                <Input
                  textAlign="center"
                  placeholder="Address"
                  value={props.values.eventAddress}
                  onChangeText={props.handleChange("eventAddress")}
                  onBlur={props.handleBlur("eventAddress")}
                  placeholderTextColor='white'
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.eventAddress && props.errors.eventAddress}
                </Text>
                <View />
                <View>
                  <Button
                    title="Create Event"

                    titleStyle={{ fontSize: 25, color: "white" }}
                    buttonStyle={{
                      borderWidth: 1,
                      borderColor: "white",
                      titleColor: "black",
                      backgroundColor: "#fb8c00",
                      borderRadius: 10,

                    }}
                    style={{ padding: 45 }}
                    onPress={props.handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLoop: {
    borderWidth: 1,

    borderColor: "white",

    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: "#f57c00",
  },
});

const mapStateToProps = state => ({
  events: state.events
});

// const ActionCreators = Object.assign(
//   {},
//   addEvent()
// );

// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

const mapDispatchToProps = (dispatch) => ({
  addEvent: (event) => dispatch(addEvent(event))
})

export default connect(mapStateToProps, mapDispatchToProps)(EventCreation);