import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import {
  getEventData,
  grabNotifications,
  getUserPfp,
} from "../shared/firebaseMethods";
import { globalStyles } from "../styles/global";
import firebase from "firebase";
import { makeTimeDifferenceString } from "../shared/commonMethods";
import { useIsFocused } from "@react-navigation/native";

export default function Notifications({ navigation, route }) {
  // TO ROBBIE OR CADEN I could only make this code work by putting it into a class/ Component
  // U may have to fix it to include navigation

  // Robbie: It's taken care of B)

  const placeholderImage = {
    uri: "https://p.kindpng.com/picc/s/678-6789790_user-domain-general-user-avatar-profile-svg-hd.png",
  };

  const isFocused = useIsFocused();

  const [user, setUser] = useState();
  const [userPfps, setUserPfps] = useState({});

  const stylizedMessage = (notifType, notifData) => {
    switch (notifType) {
      case "announcement":
        return (
          <Text style={styles.notifText}>
            <Text style={{ fontWeight: "bold" }}>{notifData.creatorName}</Text>
            <Text style={{ color: "white" }}>
              {" "}
              has made a new announcement in{" "}
            </Text>
            <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
            <Text>.</Text>
          </Text>
        );

      case "new-reply":
        return (
          <Text style={styles.notifText}>
            <Text style={{ fontWeight: "bold" }}>{notifData.replierName}</Text>
            <Text> replied to your post in </Text>
            <Text style={{ fontWeight: "bold" }}>{notifData.eventName}</Text>
            <Text>.</Text>
          </Text>
        );

      case "event-change":
        return (
          <Text style={styles.notifText}>
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
            <Text style={styles.notifText}>
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
              <Text style={styles.notifText}>
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
              <Text style={styles.notifText}>
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
            <Text style={styles.notifText}>
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
            <Text style={styles.notifText}>
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
            <Text style={styles.notifText}>
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
      if (isFocused == true) {
        grabNotifications(user.uid).then((data) => {
          setNotifications(data);
        });
      }
    }
  }, [user, isFocused]);

  // grab profile pictures of users who appear in notifications
  useEffect(() => {
    let userIDs = new Set();
    notifications.forEach((notif) => {
      // add userIDs to a set

      switch (notif.type) {
        case "new-posts":
          userIDs.add(notif.newPosts[0].userID);
          break;

        case "announcement":
          if (notif.creatorID) userIDs.add(notif.creatorID);
          break;


        case "new-reply":
          // AAAAAAAAAA I FORGOT TO TRACK USERIDS WHEN CREATING REPLY NOTIFICATIONS EVEN THOUGH I SET EVERYTHING UP FOR IT
          if (notif.replierID) userIDs.add(notif.replierID);
          break;

        case "new-joins":
          userIDs.add(notif.newAttendees[0].userID);
          break;
      }
    });
  }, [notifications]);

  return (
    <SafeAreaView
      style={{ ...globalStyles.container, backgroundColor: "#2B7D9C" }}
    >
      <View>
        <FlatList
          style={styles.root}
          data={notifications}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.container,
                !item.seen && { backgroundColor: "#EBEBEB" },
              ]}
            >
              <Image
                source={placeholderImage}
                style={globalStyles.notifavatar}
              />
              <View style={styles.content}>
                <View style={styles.mainContent}>
                  <View style={styles.text}>
                    {/* <Text style={styles.name}>{item.creatorName}</Text> */}
                    <TouchableOpacity
                      onPress={() => {
                        let event = getEventData(item.eventID);
                        navigation.navigate("CardDetails", {
                          id: item.eventID,
                          name: event.name,
                          loop: event.loop,
                          creator: event.creator,
                          startDateTime: event.startDateTime,
                          address: event.address,
                        });
                      }}
                    >
                      <Text>{stylizedMessage(item.type, item)}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.timeAgo}>
                    {makeTimeDifferenceString(item.updatedTimestamp.seconds)}{" "}
                    ago
                  </Text>
                  {/* The time can be imported from the database */}
                </View>
                <View />
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#3B4046",
  },
  container: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#3B4046",
    alignItems: "flex-start",
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
    backgroundColor: "#2B7D9C",
  },
  timeAgo: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  name: {
    fontSize: 16,
    color: "#b37400",
  },
  notifText: {
    color: "white",
  },
});
