import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  getEventData,
  grabNotifications,
  getMultiplePfps,
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
  const [refresh, setRefresh] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [rawNotifs, setRawNotifs] = useState([]);

  const [loading, setLoading] = useState(true);

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

  const getHighlightedUserID = (notif) => {
    // console.log(notif.id + ": " + notif.type)
    switch (notif.type) {
      case "new-posts":
        return notif.newPosts[0].userID;

      case "announcement":
        if (notif.creatorID) return notif.creatorID;
        return false;

      case "new-reply":
        // AAAAAAAAAA I FORGOT TO TRACK USERIDS WHEN CREATING REPLY NOTIFICATIONS EVEN THOUGH I SET EVERYTHING UP FOR IT
        if (notif.replierID) return notif.replierID;
        return false;

      case "new-joins":
        // console.log(notif.type)
        if (notif.newAttendees[0]) return notif.newAttendees[0].userID;
        return false;

      default:
        return false;
    }
  };

  const debug = (string) => {
    // console.log(string);
    return string;
  };

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
        if (refresh || rawNotifs.length == 0) {
          // weird refresh workaround
        }
        setLoading(true);
        grabNotifications(user.uid).then((data) => {
          setRefresh(false);

          setRawNotifs(data);
        });
      }
    }
  }, [user, isFocused, refresh]);

  // grab profile pictures of users who appear in notifications

  useEffect(() => {
    let userIDSet = new Set();
    rawNotifs.forEach((notif) => {
      // add userIDs to a set
      if (getHighlightedUserID(notif))
        userIDSet.add(getHighlightedUserID(notif));
    });

    let userIDs = [];
    userIDSet.forEach((userID) => {
      userIDs.push(userID);
    });

    let notifs = [...rawNotifs];

    // console.log(userIDs)

    getMultiplePfps(userIDs).then((pfps) => {
      // console.log(pfps)

      notifs.forEach((notif) => {
        if (getHighlightedUserID(notif)) {
          notif.uri = pfps[getHighlightedUserID(notif)];
        }
      });

      setNotifications(notifs);
      setLoading(false);
    });
  }, [rawNotifs]);

  return (
    <SafeAreaView
      style={{ ...globalStyles.container, backgroundColor: "#2B7D9C" }}
    >
      <View style={{ flex: 1 }}>
        {notifications.length == 0 ? ( // are there any notifications currently?
          loading ? ( // are the notifications loading?
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            // we're not loading and there's no notifications
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 45 }}>😴</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                }}
              >
                No notifications.
              </Text>
            </View>
          )
        ) : (
          // otherwise, put them in the flatlist

          <FlatList
            onRefresh={() => setRefresh(true)}
            refreshing={refresh}
            style={styles.root}
            data={notifications}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.eventID) {
                    let event = getEventData(item.eventID);
                    navigation.navigate("CardDetails", {
                      id: item.eventID,
                      name: event.name,
                      loop: event.loop,
                      creator: event.creator,
                      startDateTime: event.startDateTime,
                      address: event.address,
                    });
                  }
                }}
                onLongPress={() => {
                  console.log(item.id)
                }}
              >
                <View
                  style={[
                    styles.container,
                    !item.seen && { backgroundColor: "#61666b" },
                  ]}
                >
                  <Image
                    source={{
                      uri: item.uri,
                    }}
                    style={globalStyles.notifavatar}
                  />
                  <View style={styles.content}>
                    <View style={styles.mainContent}>
                      <View style={styles.text}>
                        {/* <Text style={styles.name}>{item.creatorName}</Text> */}

                        <Text>{stylizedMessage(item.type, item)}</Text>
                      </View>
                      <Text style={styles.timeAgo}>
                        {makeTimeDifferenceString(
                          item.updatedTimestamp.seconds
                        )}{" "}
                        ago
                      </Text>
                      {/* The time can be imported from the database */}
                    </View>
                    <View />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
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
