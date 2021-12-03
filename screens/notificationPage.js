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

export default function Notifications({ navigation, route }) {
  // TO ROBBIE OR CADEN I could only make this code work by putting it into a class/ Component
  // U may have to fix it to include navigation

  // Robbie: It's taken care of B)

  const placeholderImage = {
    uri: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
  };

  const StylizedMessage = (notifType, notifData) => {
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
        return;

      case "event-change":
        return;

      case "event-kick":
        return;

      case "new-posts":
        return;

      case "new-joins":
        return;

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
      grabNotifications(user.uid).then((data) => {
        setNotifications(data);
      });
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

  const testData = [
    {
      id: 1,
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
      name: "User",
      text: "The owner of the Volunteer event you follow has posted an announcement",
    },
    {
      id: 2,
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
      name: "User",
      text: "The Sports loop event will start tomorrow at 15:00",
    },
  ];

  return (
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
                <Text style={styles.name}>{item.creatorName}</Text>
                <Text>{StylizedMessage(item.type, item)}</Text>
              </View>
              <Text style={styles.timeAgo}>
                {item.creationTimestamp.seconds}
              </Text>
              {/* The time can be imported from the database */}
            </View>
            <View />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFFFF",
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
