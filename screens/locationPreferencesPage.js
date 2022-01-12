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
  import { connect } from "react-redux";
  import { signOut } from "../store/actions/userActions";
  import { TouchableOpacity } from "react-native-gesture-handler";
  
function LocationPreferencesPage(props, { navigation }) {
    const [checkSports, setCheckSports] = useState(false);
  
    return (
      <View
        style={{
          //borderColor: "#ffa835",
          borderWidth: 7,
          flex: 1,
          backgroundColor: "#F8F8F8",
        }}
      >
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
                initialValues={{}}
                onSubmit={}
              >
                {(props) => (
                  <>
                    <Text style={globalStyles.titleText}></Text>
                    <Text style={globalStyles.titleText}>
                      Please select at least 1 area of interest.
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
                        
                      </View>
                    </View>

  
                    <View />
                    <View>
                      <Button
                        title="Submit"
                        titleStyle={{ fontSize: 26, color: "black" }}
                        buttonStyle={{
                          borderWidth: 10,
                          borderWidth: 1,
                          borderColor: "black",
                          titleColor: "black",
                          backgroundColor: "#ffa835",
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
  
  //Initialize the states you want to use on the page
const mapStateToProps = state => ({
    user: state.user
  });
  
  //Initialize what actions you are going to use on the page
  const mapDispatchToProps = (dispatch) => ({
    signOut: (navigation) => dispatch(signOut(navigation)),
  });
  
  //send the state and actions to props of the function
  export default connect(mapStateToProps, mapDispatchToProps)(LocationPreferencesPage);
  