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
import LinearGradient from "expo-linear-gradient";

import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import moment from "moment";
import { addEvent } from "../store/actions/eventActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { PLACES_ID } from "@env";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHight = Dimensions.get("window").height;

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

  const messiahPlace = {
    description: "Messiah University",
    geometry: { location: { lat: 40.15974, lng: -76.988419 } },
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{ ...globalStyles.container, backgroundColor: "#2B7D9C" }}
      >
        <View style={({ alignItems: "center" }, { flexDirection: "column" })}>
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
              var success = props.addEvent({
                name: values.eventName,
                loop: values.eventLoop,
                startDateTime: moment(
                  values.eventDate + " " + values.eventTime
                ).format("x"),
                address: values.eventAddress,
              });
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
                  placeholderTextColor="white"
                />
                <Text style={globalStyles.errorText}>
                  {props.touched.eventName && props.errors.eventName}
                </Text>

                {/* <Input
                  textAlign="center"
                  placeholder="Address"
                   // value={props.values.eventAddress}
                    // onChangeText={props.handleChange("eventAddress")}
                    // onBlur={props.handleBlur("eventAddress")}
                  placeholderTextColor='white'
                /> */}
                <View style={styles.searchBox}>
                  <GooglePlacesAutocomplete
                    placeholder="Search"
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed="auto" // true/false/undefined
                    fetchDetails={true}
                    renderDescription={(row) => row.description} // custom description render
                    onPress={(data, details = null) => {
                      console.log(data);
                      console.log(details);
                    }}
                    getDefaultValue={() => {
                      return ""; // text input default value
                    }}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: PLACES_ID,
                      language: "en", // language of the results
                      types: "(cities)", // default: 'geocode'
                    }}
                    // style={{ marginBottom: 10 }}
                    styles={{
                      description: {
                        fontWeight: "bold",
                      },
                      predefinedPlacesDescription: {
                        color: "#1faadb",
                      },
                    }}
                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
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
                    currentLocation={true}
                    currentLocationLabel="Current location"
                  />
                </View>
                <Text style={globalStyles.errorText}>
                  {props.touched.eventAddress && props.errors.eventAddress}
                </Text>

                {/* Touching the date button opens the date picker */}
                <Button
                  titleStyle={{ color: "white", width: 250 }}
                  buttonStyle={{
                    borderWidth: 1,
                    borderColor: "white",
                    titleColor: "black",
                    backgroundColor: "#3B4046",
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
                    backgroundColor: "#3B4046",
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
                      <Text style={{ color: "white" }}>Sports</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
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
                      <Text style={{ color: "white" }}>Music</Text>
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
                      <Text style={{ color: "white" }}>Volunteer</Text>
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
                      <Text style={{ color: "white" }}>Game</Text>
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
                      <Text style={{ color: "white" }}>Social</Text>
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
                      <Text style={{ color: "white" }}>Arts</Text>
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
                      <Text style={{ color: "white" }}>Outdoors</Text>
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
                      <Text style={{ color: "white" }}>Academic</Text>
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
                      <Text style={{ color: "white" }}>Media</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={globalStyles.errorText}>
                  {props.touched.eventLoop && props.errors.eventLoop}
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
                      backgroundColor: "#3B4046",
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
    backgroundColor: "#2B7D9C",
  },
  searchBox: {
    //top: 0,
    //position: "absolute",
    flex: 1,
    justifyContent: "center",
    //marginBottom: 50,
  },
});

const mapStateToProps = (state) => ({
  events: state.events,
});

// const ActionCreators = Object.assign(
//   {},
//   addEvent()
// );

// const mapDispatchToProps = dispatch => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

const mapDispatchToProps = (dispatch) => ({
  addEvent: (event) => dispatch(addEvent(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCreation);
