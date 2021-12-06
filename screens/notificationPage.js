import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { grabNotifications } from "../shared/firebaseMethods";
import firebase from "firebase";
import { makeTimeDifferenceString } from "../shared/commonMethods";
import { Button } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";

export default function Notifications({ navigation, route }) {
  // TO ROBBIE OR CADEN I could only make this code work by putting it into a class/ Component
  // U may have to fix it to include navigation

  // Robbie: It's taken care of B)

  const placeholderImage = {
    uri: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
  };

  const isFocused = useIsFocused();

  const [user, setUser] = useState();

  const stylizedMessage = (notifType, notifData) => {
    switch (notifType) {
      case "announcement":
        return (
          <Text>
            <Text style={{ fontWeight: "bold" }}>{notifData.creatorName}</Text>
            <Text> has made a new announcement in </Text>
            <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
            <Text>.</Text>
          </Text>
        );

      case "reply":
        return null;

      case "event-change":
        return (
          <Text>
            <Text style={{ fontWeight: "bold" }}>{notifData.creatorName}</Text>
            <Text> has made changes in </Text>
            <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
            <Text>.</Text>
          </Text>
        );

      case "event-kick":
        return;

      case "new-posts":
        let multipleUsers = false;

        notifData.newPosts.forEach((post) => {
          if (notifData.newPosts[0].userID != post.userID) {
            multipleUsers = true;
            // break;
          }
        });

        if (multipleUsers) {
          return (
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                {notifData.newPosts[0].userName}
              </Text>
              <Text> and others have made </Text>
              <Text style={{ fontWeight: "bold" }}>
                {notifData.newPosts.length}
              </Text>
              <Text> new posts in </Text>
              <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
              <Text>.</Text>
            </Text>
          );
        } else {
          if (notifData.newPosts.length == 1) {
            return (
              <Text>
                <Text style={{ fontWeight: "bold" }}>
                  {notifData.newPosts[0].userName}
                </Text>
                <Text> has made a new post in </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {notifData.eventName}
                </Text>
                <Text>.</Text>
              </Text>
            );
          } else {
            return (
              <Text>
                <Text style={{ fontWeight: "bold" }}>
                  {notifData.newPosts[0].userName}
                </Text>
                <Text> has made </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {notifData.newPosts.length}
                </Text>
                <Text> new posts in </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {notifData.eventName}
                </Text>
                <Text>.</Text>
              </Text>
            );
          }
        }

      case "new-joins":
        if (notifData.newAttendees.length == 1) {
          return (
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                {notifData.newAttendees[0].userName}
              </Text>
              <Text> has registered for </Text>
              <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
              <Text>.</Text>
            </Text>
          );
        } else if (notifData.newAttendees.length == 2) {
          return (
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                {notifData.newAttendees[0].userName}
              </Text>
              <Text> and </Text>
              <Text style={{ fontWeight: "bold" }}>1</Text>
              <Text> other have registered for </Text>
              <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
              <Text>.</Text>
            </Text>
          );
        } else if (notifData.newAttendees.length > 2) {
          return (
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                {notifData.newAttendees[0].userName}
              </Text>
              <Text> and </Text>
              <Text style={{ fontWeight: "bold" }}>
                {notifData.newAttendees.length - 1}
              </Text>
              <Text> others have registered for </Text>
              <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
              <Text>.</Text>
            </Text>
          );
        } else {
          return;
        }

      case "user-report":
        return;

      default:
        console.log("notifType=" + notifType);
        return;
    }
  };

  const [notifications, setNotifications] = useState([]);

  const AuthStateChangedListener = (user) => {
    if (user) {
      setUser(user);
    }
  };

  // idk redux yet, but redux will replace this I think
  useEffect(() => {
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(AuthStateChangedListener);
    return () => {
      unsubscriber;
    };
  }, []);

  // grab the posts when user is authenticated or screen is refocused
  useEffect(() => {
    if (user) {
      grabNotifications(user.uid).then((data) => {
        setNotifications(data);
      });
    }
  }, [user, isFocused]);

  return (
    <View>
      <FlatList
        style={styles.root}
        data={notifications}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image source={placeholderImage} style={styles.avatar} />
            <View style={styles.content}>
              <View style={styles.mainContent}>
                <View style={styles.text}>
                  {/* <Text style={styles.name}>{item.creatorName}</Text> */}
                  <Text>{stylizedMessage(item.type, item)}</Text>
                </View>
                <Text style={styles.timeAgo}>
                  {makeTimeDifferenceString(item.updatedTimestamp.seconds)} ago
                </Text>
                {/* The time can be imported from the database */}
              </View>
              <View />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#D3D3D3",
  },
  container: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "flex-start",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    marginBottom: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  img: {
    height: 50,
    width: 50,
    margin: 0,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
  },
  timeAgo: {
    fontSize: 12,
    color: "#696969",
  },
  name: {
    fontSize: 16,
    color: "#b37400",
  },
});
