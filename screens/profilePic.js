/**
 *      ___
 *     /   \
 *    /  |  \
 *   /   |   \
 *  /    |    \
 * /     o     \
 * \___________/
 * 
 * This page is probably inaccessible on the app, it was a page I made for testing image picker and uploading files to firebase storage
 * 
 * (I hope you liked my ASCII art - Robbie)
 */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Button, ListItem, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as firebase from 'firebase'

// import { getStorage, ref, uploadBytes } from 'firebase/storage'

export default function ProfilePic({ navigation }) {
  const [imageData, setImageData] = useState(null);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height * 0.5;

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [userID, setUserID] = useState();

// from https://docs.expo.dev/versions/v42.0.0/sdk/imagepicker/#using-imagepicker-with-firebase

  // solution from here:
  // https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
  
  async function uploadImageAsync(uri) {

    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        resolve(xhr.response)
      };

      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network Request Failed!"))
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    })

    const storage = firebase.storage()
    const ref = storage.ref("profile-pics/test.jpg")

    ref.put(blob).then((snapshot) => {
      storage.ref("profile-pics/test.jpg").getDownloadURL()
      .then((url) => {

      })
    })

    // blob.close();
  }

  const formatImageSize = (image) => {
    const ratio = Math.max(
      image.width / windowWidth,
      image.height / windowHeight
    );

    const widthScale = image.width / windowWidth / ratio;
    const heightScale = image.height / windowHeight / ratio;

    // console.log("------------");
    // console.log("Window Width  : " + windowWidth);
    // console.log("Window Height : " + windowHeight);
    // console.log("Scaled Width  : " + windowWidth * widthScale);
    // console.log("Scaled Height : " + windowHeight * heightScale);

    setImageWidth(windowWidth * widthScale);
    setImageHeight(windowHeight * heightScale);
    setImageData(image);
  };

  return (
    <View>
      <Button
        title="Open Camera"
        onPress={async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status == "granted") {
            const image = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              base64: true,
            });
            formatImageSize(image);
          }
        }}
      />

      <Button
        title="Open Photos"
        onPress={async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status == "granted") {
            const image = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              base64: true,

            });
            formatImageSize(image);
          }
        }}
      />

      {imageData != null && !imageData.cancelled ? (
        <View>
          <Image
            source={{
              uri: imageData.uri,
              width: imageWidth,
              height: imageHeight,
            }}

          />
          <Button
            title="upload to cloud"
            onPress = {async () => {

              await uploadImageAsync(imageData.uri)
            }}
          />
        </View>
      ) : (
        <Text>Take a photo!</Text>
      )}
    </View>
  );
}
