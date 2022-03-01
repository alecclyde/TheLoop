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

export default function ProfilePic({ navigation }) {
  const [imageData, setImageData] = useState(null);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height * 0.7;

  let viewWidth = 0;
  let viewHeight = 0;

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  //   // from https://docs.expo.dev/versions/v42.0.0/sdk/imagepicker/#using-imagepicker-with-firebase

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
            });
            formatImageSize(image);
          }
        }}
      />

    
        {imageData != null && !imageData.cancelled ? (
          <Image
            source={{
              uri: imageData.uri,
              width: imageWidth,
              height: imageHeight,
            }}
          />
        ) : (
          <Text>Take a photo!</Text>
        )}
    </View>
  );
}
