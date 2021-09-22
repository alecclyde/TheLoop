import {
  Text,
  ImageBackground,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  Keyboard,
  StyleSheet,
  Button,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";

import { globalStyles } from "../styles/global";
import * as yup from "yup";
import { Formik } from "formik";
import moment from "moment";
import { createEvent } from "../shared/firebaseMethods";

const CreateEventSchema = yup.object({

  // date: yup.date().min(moment()),
  eventName: yup.string().required("Please enter a name for your event"),
  eventLoop: yup.string().required("Please select a loop for your event"),
  eventDate: yup.string().required("Please select a date for your event"),
  eventTime: yup.string().required("Please select a time for your event"),
  eventAddress: yup.string().required("Please enter an address for your event"),
  
});

export default function EventCreation({ navigation }) {

  const date = new Date();
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState();
  const [timeText, setTimeText] = useState();
  const [mode, setMode] = useState("date");

  // from https://github.com/react-native-datetimepicker/datetimepicker

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);

    if (mode == "date") {
        setDateText(moment(currentDate).format('MMMM Do, YYYY'));
    }
    if (mode == "time") {
        setTimeText(moment(currentDate).format('hh:mm A'));
    }
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
    <View>
      <ImageBackground
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6JwPaFY0B1vbLzXu6HUGW6Ix4TReDfz_mXA&usqp=CAU",
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={globalStyles.container}>
          <View style={{ alignItems: "center" }}>
            <Text style={globalStyles.titleText}>Create a New Event</Text>

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
                createEvent(
                  values.eventName,
                  values.eventLoop,
                  // formats the date and time to be in milliseconds
                  moment(values.eventDate + ' ' + values.eventTime).format('x'),
                  values.eventAddress,
                  navigation
                );
              }}
            >
              {(props) => (
                <>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Event name"
                    value={props.values.eventName}
                    onChangeText={props.handleChange("eventName")}
                    onBlur={props.handleBlur("eventName")}
                  />
                  {/* Touching the date button opens the date picker */}
                  <TouchableOpacity
                    style={globalStyles.input}
                    onPress={showDatePicker}
                  >
                    <Text>{dateText || "Date"}</Text>
                  </TouchableOpacity>

                  {/* and touching the time button opens the time picker */}
                  <TouchableOpacity
                    style={globalStyles.input}
                    onPress={showTimePicker}
                  >
                    <Text>{timeText || "Time"}</Text>
                  </TouchableOpacity>
                  {show && (
                    <DateTimePicker
                      value={date}
                      mode={mode}
                      display="default"
                      onChange={(event, date) => {
                        onChange(event, date);
                        // updates the date or time field value, depending on which one was selected
                        mode === "date" && props.setFieldValue("eventDate", moment(date).format("YYYY-MM-DD"));
                        mode === "time" && props.setFieldValue("eventTime", moment(date).format("HH:mm"));

                      }
                        
                        }
                    />
                  )}
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Event Loop"
                    value={props.values.eventLoop}
                    onChangeText={props.handleChange("eventLoop")}
                    onBlur={props.handleBlur("eventLoop")}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Address"
                    value={props.values.eventAddress}
                    onChangeText={props.handleChange("eventAddress")}
                    onBlur={props.handleBlur("eventAddress")}
                  />

                  <TouchableOpacity
                  style={globalStyles.input}
                  onPress={props.handleSubmit}
                  >
                  <Text>Create Event</Text>

                  </TouchableOpacity>
                </>
              )}
            </Formik>

          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
