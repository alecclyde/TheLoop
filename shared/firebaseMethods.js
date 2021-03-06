import * as firebase from "firebase";
import * as firestore from "firebase/firestore";
import { Alert } from "react-native";
import { StackActions } from "@react-navigation/native";
import LocationPreferencesPage from "../screens/locationPreferencesPage";

// export async function registration(
//   email,
//   password,
//   lastName,
//   firstName,
//   navigation
// ) {
//   try {
//     await firebase.auth().createUserWithEmailAndPassword(email, password);
//     const currentUser = firebase.auth().currentUser;

//     const db = firebase.firestore();
//     db.collection("users").doc(currentUser.uid).set({
//       email: currentUser.email,
//       lastName: lastName,
//       firstName: firstName,
//       joinedLoops: [],
//       distanceTolerance: 15,
//       myEvents: [],
//       creationTimestamp: firebase.firestore.Timestamp.now(),
//     });
//     //   navigation.dispatch(StackActions.pop(1));
//     //   if(firebase.auth().currentUser !== null){
//     navigation.navigate("RootStack");
//     //   }
//   } catch (err) {
//     Alert.alert("There is something wrong!", err.message);
//   }
// }

// export async function signIn(email, password, navigation) {
//   try {
//     await firebase.auth().signInWithEmailAndPassword(email, password);
//     if (firebase.auth().currentUser !== null) {
//       navigation.navigate("RootStack");
//     }
//   } catch (err) {
//     console.log(err);
//     Alert.alert("There is something wrong!", "Email or Password are incorrect");
//     console.log(err);
//   }
// }

// export async function loggingOut(navigation) {
//   try {
//     await firebase.auth().signOut();
//     navigation.navigate("LogIn");
//   } catch (err) {
//     Alert.alert("There is something wrong!", err.message);
//   }
// }

export async function setUserLoops(joinedLoops) {
  try {
    const currentUser = firebase.auth().currentUser;
    const db = firebase.firestore();
    console.log(joinedLoops)
    db.collection("users")
      .doc(currentUser.uid)
      .update({ joinedLoops: joinedLoops })
    // probably should navigate to event page after this
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong!", err.message);
    return false;
  }
}

// Grabs a single user's data
export async function getUserData(userID) {
  try {
    const user = await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .get();
    return user.data();
  } catch (err) {
    console.log(err);
    Alert.alert("Something went wrong!", err.message);
  }
}

// Creates a new event and adds the data to Firebase
// Returns true if event is successfully created, returns false otherwise
// export async function createEvent(
//   data
// ) {
//   try {
//     const currentUser = firebase.auth().currentUser;
//     const db = firebase.firestore();

//     db.collection("events").add({
//       name: data.name,
//       loop: data.loop,
//       // creator: currentUser.uid, // DEPRECATED, start transitioning into creatorID
//       creatorID: currentUser.uid,
//       address: data.address,
//       recurAutomatically: false,
//       recurFrequency: 1,
//       // datetime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // DEPRECATED, start transitioning to startDateTime
//       startDateTime: firebase.firestore.Timestamp.fromMillis(data.startDateTime),
//       endDateTime: firebase.firestore.Timestamp.fromMillis(data.startDateTime), // Will want to query for actual end dateTime later
//       creationTimestamp: firebase.firestore.Timestamp.now(),
//       attendees: [currentUser.uid],
//       location: new firebase.firestore.GeoPoint(0, 0), // Temporary value, adjust when Alec/Caden finishes geolocation
//     }).then(() => {
//       return true;
//     });

//     // probably should navigate to event page after this
//   } catch (err) {
//     console.log(err);
//     Alert.alert("Something went wrong!", err.message);
//     return false;
//   }
// }

/**
 * Gets the data for one event
 * @param eventID - the ID of the event to get data for
 */
export async function getEventData(eventID) {
  try {
    // Get some event data
    const event = await firebase
      .firestore()
      .collection("events")
      .doc(eventID)
      .get();
    return event.data();
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

export async function sendPasswordResetEmail(email, navigation) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (err) {
    if (err.code != "auth/user-not-found") {
      console.log(err.code);
      Alert.alert("something went wrong!", err.message);
    }
  }

  Alert.alert(
    "Email sent!",
    "Check your email for instructions on how to reset your password."
  );
  navigation.pop();
}

/**
 * Registers a user for an event
 * @param eventData - The data for the event
 * @param userID - the data of the user being registered
 */
export async function registerEvent(eventData, userData) {
  try {
    // if newAttendeesNotifID is "0", then there isn't a notification waiting
    if (eventData.newAttendeesNotifID == "0") {
      // make a new notification
      await createNotification(eventData.eventCreator.userID, "new-joins", {
        eventName: eventData.eventName,
        eventID: eventData.eventID,
        userData: userData,
      }).then((doc) => {
        // set the newAttendeesNotifID to the notification ID in the event document
        firebase
          .firestore()
          .collection("events")
          .doc(eventData.eventID)
          .update({
            attendees: firebase.firestore.FieldValue.arrayUnion(userData),
            newAttendeesNotifID: doc.id,
          });
      });
    } else {
      // otherwise, update the notification document
      updateAddAttendeeNotification(
        eventData.newAttendeesNotifID,
        eventData.eventCreator.userID,
        userData
      );

      // finally, update the actual event attendees
      await firebase
        .firestore()
        .collection("events")
        .doc(eventData.eventID)
        .update({
          attendees: firebase.firestore.FieldValue.arrayUnion(userData),
        });
    }

    // replace this one with a hook (if I find out what Trevor meant)
    await firebase
      .firestore()
      .collection("users")
      .doc(userData.userID)
      .update({
        myEvents: firebase.firestore.FieldValue.arrayUnion({
          address: eventData.eventAddress,
          creator: eventData.eventCreator,
          id: eventData.eventID,
          loop: eventData.eventLoop,
          name: eventData.eventName,
          startDateTime: eventData.eventStartDateTime,
        }),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("registerEvent: something went wrong!", err.message);
  }
}

/**
 * Unregisters a user for an event
 * @param eventData - The data for the event
 * @param userData - the data for the user being unregistered
 */
export async function unregisterEvent(eventData, userData) {
  try {
    // only update the notification if there's a notification to update
    if (eventData.newAttendeesNotifID != "0") {
      await updateRemoveAttendeeNotification(
        eventData.newAttendeesNotifID,
        eventData.eventCreator.userID,
        userData
      );
    }

    await firebase
      .firestore()
      .collection("events")
      .doc(eventData.eventID)
      .update({
        attendees: firebase.firestore.FieldValue.arrayRemove(userData),
      });

    // replace this one with a hook (if I find out what Trevor meant)
    await firebase
      .firestore()
      .collection("users")
      .doc(userData.userID)
      .update({
        myEvents: firebase.firestore.FieldValue.arrayRemove({
          address: eventData.eventAddress,
          creator: eventData.eventCreator,
          id: eventData.eventID,
          loop: eventData.eventLoop,
          name: eventData.eventName,
          startDateTime: eventData.eventStartDateTime,
        }),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Creates a post in an event
 * @param eventData - the data for the event (needs eventID, creatorID, eventName, newPostsNotifID)
 * @param userData - the user data of the poster (needs userID and userName)
 * @param postText - the text of the post
 */
export async function createPost(eventData, userData, postText) {
  try {
    // premake the document for later use
    const postDoc = firebase
      .firestore()
      .collection("posts")
      .doc(eventData.eventID)
      .collection("posts")
      .doc();

    // if the event creator is the poster, we don't want to update the notification
    if (eventData.creatorID != userData.userID) {
      // ifnewPostsNotifID is "0", then there isn't a new posts notification yet
      if (eventData.newPostsNotifID == "0") {
        //make a new notification
        await createNotification(eventData.creatorID, "new-posts", {
          eventName: eventData.eventName,
          eventID: eventData.eventID,
          userData: {
            userID: userData.userID,
            userName: userData.userName,
            postID: postDoc.id,
          },
        }).then((doc) => {
          // set the newPostsNotifID to the notification ID in the event document
          firebase
            .firestore()
            .collection("events")
            .doc(eventData.eventID)
            .update({
              newPostsNotifID: doc.id,
            });
        });
      } else {
        //otherwise, update the notification document
        updateAddPostNotification(
          eventData.newPostsNotifID,
          eventData.creatorID,
          {
            userID: userData.userID,
            userName: userData.userName,
            postID: postDoc.id,
          }
        );
      }
    }

    // finally, add the actual post to the posts collection
    await postDoc.set({
      message: postText,
      posterID: userData.userID,
      posterName: userData.userName,
      creationTimestamp: firebase.firestore.Timestamp.now(),
      updatedTimestamp: firebase.firestore.Timestamp.now(),
      edited: false,
      replies: [],
    });
  } catch (err) {
    console.log(err);
    Alert.alert("createPost: something went wrong!", err.message);
  }
}

export async function editPost(eventID, postID, newMessage) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .doc(eventID)
      .collection("posts")
      .doc(postID)
      .update({
        message: newMessage,
        updatedTimestamp: firebase.firestore.Timestamp.now(),
        edited: true,
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Deletes a post in an event
 * @param eventData - the data for the event (needs eventID, creatorID, newPostsNotifID)
 * @param postData - the data for the post (needs postID, posterID, and posterName)
 */
export async function deletePost(eventData, postData) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .doc(eventData.eventID)
      .collection("posts")
      .doc(postData.postID)
      .delete();

    // removes the attendee from the "new posts" notification if it exists
    if (eventData.newPostsNotifID != "0") {
      await updateRemovePostNotification(
        eventData.newPostsNotifID,
        eventData.creatorID,
        {
          userID: postData.posterID,
          userName: postData.posterName,
          postID: postData.postID,
        }
      );
    }
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Replies to a post in an event
 * @param postData - the data for the post (needs postID, posterID, eventID, eventName)
 * @param userData - the user data of the replier (needs userID and userName)
 * @param replyText - the text of the reply
 */
export async function createReply(postData, userData, replyText) {
  // If the person is not replying to themselves, create a notification
  if (userData.userID != postData.posterID) {
    // create a notification

    await createNotification(postData.posterID, "new-reply", {
      eventName: postData.eventName,
      eventID: postData.eventID,
      replierName: userData.userName,
      replierID: userData.userID,
    });
  }
  // generate an ID for the document
  let replyID = firebase
    .firestore()
    .collection("posts")
    .doc(postData.eventID)
    .collection("posts")
    .doc();

  await firebase
    .firestore()
    .collection("posts")
    .doc(postData.eventID)
    .collection("posts")
    .doc(postData.postID)
    .update({
      replies: firebase.firestore.FieldValue.arrayUnion({
        creationTimestamp: firebase.firestore.Timestamp.now(),
        updatedTimestamp: firebase.firestore.Timestamp.now(),
        edited: false,
        message: replyText,
        replierID: userData.userID,
        replierName: userData.userName,
        id: replyID.id,
      }),
      updatedTimestamp: firebase.firestore.Timestamp.now(),
    });
}

/**
 * Deletes a reply from a post
 * @param eventID - the data for the event (needs eventID, eventName)
 * @param postID - the data for the original post (needs postID, posterID)
 * @param reply - the reply to be deleted (should contain the entire reply object)
 */
export async function deleteReply(eventID, postID, reply) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .doc(eventID)
      .collection("posts")
      .doc(postID)
      .update({
        replies: firebase.firestore.FieldValue.arrayRemove(reply),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Creates a notification for a user
 * @param userID - The userID receiving the notification
 * @param notifType - The type of notification being added
 * @param notifData - The data required for creating the notification
 * @returns the documentID of the notificaton
 */
export async function createNotification(userID, notifType, notifData) {
  try {
    const doc = firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .collection("notifications")
      .doc();

    switch (notifType) {
      case "announcement":
        // create an announcement notification with notifData.eventName and notifData.creatorName
        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          updatedTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          eventID: notifData.eventID,
          creatorName: notifData.creatorName,
          creatorID: notifData.creatorID,
          seen: false,
        });
        return doc;

      case "new-reply":
        // man oh man I hope I can get replies working eventually
        // boy have I got good news for you

        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          updatedTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          eventID: notifData.eventID,
          replierName: notifData.replierName,
          replierID: notifData.replierID,
          seen: false,
        });
        return doc;

      case "event-change":
        // create an event-change notification with notifData.eventName and notifData.creatorName
        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          updatedTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          eventID: notifData.eventID,
          creatorName: notifData.creatorName,
          seen: false,
        });
        return doc;

      case "event-kick":
        // create the message for the event kick with notifData.event
        break;

      case "new-posts":
        // showstopper
        /**
         * requires a special query
         *
         * first checks the "newPostsID" value (either 0 or a document ID)
         * if 0, create a new documentID for the "new posts" notification
         *   - set the "newPostsID" value in the event to this Document ID
         *     (any future attendee notifs will be updated here)
         *   - add the document to the event creator's notifications along
         *     with an array of new attendees (probably just names)
         * if it's a documentID, add the new attendee in the notification document
         *
         * Possible case: someone leaves an event before the owner checks the notification
         */
        //

        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          updatedTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          eventID: notifData.eventID,
          newPosts: [notifData.userData], // this is messy, might want to change
          seen: false,
        });

        return doc;

      case "new-joins":
        // showstopper
        // requires a special query that adds a userID as a new attendee

        await doc.set({
          type: notifType,
          creationTimestamp: firebase.firestore.Timestamp.now(),
          updatedTimestamp: firebase.firestore.Timestamp.now(),
          eventName: notifData.eventName,
          eventID: notifData.eventID,
          newAttendees: [notifData.userData], // this is messy, might want to change
          seen: false,
        });

        return doc;

      case "user-report":
        // tbh I don't know how to do this one yet
        break;
    }
  } catch (err) {
    console.log(err);
    Alert.alert("createNotification: something went wrong!", err.message);
  }
}

/**
 * Adds an attendee to the "new attendees" notification for the creator
 * @param notificationID - the documentID of the notification to be updated
 * @param creatorID - the userID whom the notification belongs to
 * @param newAttendeeData - the new user attending the event
 */
export async function updateAddAttendeeNotification(
  notificationID,
  creatorID,
  newAttendeeData
) {
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(creatorID)
      .collection("notifications")
      .doc(notificationID)
      .update({
        newAttendees: firebase.firestore.FieldValue.arrayUnion(newAttendeeData),
        updatedTimestamp: firebase.firestore.Timestamp.now(),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Removes an attendee to the "new attendees" notification for the creator
 * @param notificationID - the documentID of the notification to be updated
 * @param creatorID - the userID whom the notification belongs to
 * @param newAttendeeData - the new user unregistering from the event
 */
export async function updateRemoveAttendeeNotification(
  notificationID,
  creatorID,
  newAttendeeData
) {
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(creatorID)
      .collection("notifications")
      .doc(notificationID)
      .update({
        newAttendees:
          firebase.firestore.FieldValue.arrayRemove(newAttendeeData),
        updatedTimestamp: firebase.firestore.Timestamp.now(),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

// might be able to reuse code for new-posts and new-joins

/**
 * Adds an attendee to the "new posts" notification for the creator
 * @param notificationID - the documentID of the notification to be updated
 * @param creatorID - the userID whom the notification belongs to
 * @param userData - the user data of the poster (userID and userName)
 */
export async function updateAddPostNotification(
  notificationID,
  creatorID,
  userData
) {
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(creatorID)
      .collection("notifications")
      .doc(notificationID)
      .update({
        newPosts: firebase.firestore.FieldValue.arrayUnion(userData),
        updatedTimestamp: firebase.firestore.Timestamp.now(),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Removes an attendee to the "new posts" notification for the creator
 * @param notificationID - the documentID of the notification to be updated
 * @param creatorID - the userID whom the notification belongs to
 * @param userData - the user data of the poster (userID and userName)
 */
export async function updateRemovePostNotification(
  notificationID,
  creatorID,
  userData
) {
  try {
    await firebase
      .firestore()
      .collection("users")
      .doc(creatorID)
      .collection("notifications")
      .doc(notificationID)
      .update({
        newPosts: firebase.firestore.FieldValue.arrayRemove(userData),
        updatedTimestamp: firebase.firestore.Timestamp.now(),
      });
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Grabs the users notifications
 * @param userID - the userID to get notifications for
 */
export async function grabNotifications(userID) {
  try {
    const notifs = [];

    await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .collection("notifications")
      .orderBy("creationTimestamp", "desc")
      .limit(10)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          setNotifSeen(userID, doc.id, {
            notifType: doc.data().type,
            eventID: doc.data().eventID,
          });
          notifs.push({ id: doc.id, ...doc.data() });
        });
      });

    // console.log(notifs)
    return notifs;

    // do stuff
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Sets a notification as "seen" and modifies event details if necessary
 * @param userID - the userID whose notification is being marked as seen
 * @param notifID - the notifID of the notification being marked as seen
 * @param notifData - the other data required when making a notification seen
 */
export async function setNotifSeen(userID, notifID, notifData) {
  try {
    switch (notifData.notifType) {
      case "new-joins":
        await firebase
          .firestore()
          .collection("users")
          .doc(userID)
          .collection("notifications")
          .doc(notifID)
          .update({
            seen: true,
          })
          .then(() => {
            // check if document exists
            firebase.firestore().collection("events").doc(notifData.eventID).get()
            .then((doc) => {
              if (doc.exists) { // if the document exists (could've been deleted)
                firebase
                .firestore()
                .collection("events")
                .doc(notifData.eventID)
                .update({
                  newAttendeesNotifID: "0",
                });
              }
            })
          });
        break;

      case "new-posts":
        await firebase
          .firestore()
          .collection("users")
          .doc(userID)
          .collection("notifications")
          .doc(notifID)
          .update({
            seen: true,
          })
          .then(() => {
            // check if document exists
            firebase.firestore().collection("events").doc(notifData.eventID).get()
            .then((doc) => {
              if (doc.exists) { // if the document exists (could've been deleted)
                firebase
                .firestore()
                .collection("events")
                .doc(notifData.eventID)
                .update({
                  newPostNotifID: "0",
                });
              }
            })
          });
        break;

      case "announcement":
        await firebase
          .firestore()
          .collection("users")
          .doc(userID)
          .collection("notifications")
          .doc(notifID)
          .update({
            seen: true,
          });
        break;

      case "new-reply":
        await firebase
          .firestore()
          .collection("users")
          .doc(userID)
          .collection("notifications")
          .doc(notifID)
          .update({
            seen: true,
          });
        break;
      case "event-change":
      case "event-kick":
      case "report":
        await firebase
          .firestore()
          .collection("users")
          .doc(userID)
          .collection("notifications")
          .doc(notifID)
          .update({
            seen: true,
          });
        break;
    }
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Grabs a single user's profile picture (if they have one set)
 * @param userID - the id of the user to pull the profile picture from
 */
 export async function getUserPfp(userID) {
  try {
    
    const user = await firebase.firestore().collection("users").doc(userID).get()
      if (user.data().profilePicSource) {
        // console.log("source found for " + doc.data().firstName + doc.data().lastName)
        // console.log(doc.data().profilePicSource)
        return user.data().profilePicSource

      } else {
        // console.log("no source found for " + doc.data().firstName + doc.data().lastName)

        return "https://p.kindpng.com/picc/s/678-6789790_user-domain-general-user-avatar-profile-svg-hd.png"
      }
    

  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Gets a group of user profile pictures given an iterable object of userIDs
 * @param userIDs - the userIDs to get profile pictures of
 * @returns - an object pairing a userID to a url
 */
 export async function getMultiplePfps(userIDs) {
  try {
    let profilePics = {}

    await Promise.all(userIDs.map(async (userID) => {
      // console.log("userID: " + userID)
      let url = await getUserPfp(userID)

      profilePics[userID] = url
    }))
    
    // userIDs.forEach((userID) => {
    //   let url = getUserPfp(userID).then(() => {
    //     profilePics[userID] = url
    //   })
    // })

    return profilePics;

  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Deletes an event and all associated data safely
 * @param eventID - The ID of the event being deleted
 * @param eventAttendees - The attendees of the event
 * @param eventData - The data for the event to be deleted (should match format in "myEvents" for users)
 */
 export async function safeDeleteEvent(eventID, eventAttendees, eventData) {
  try {
    let postCollection = firebase.firestore().collection("posts").doc(eventID).collection("posts")
    // pull all posts, and delete each one
    postCollection.get()
    .then((snap) => {
      snap.forEach((doc) => {
        postCollection.doc(doc.id).delete()
      })
    })

    // edit each user attending and remove the event from their "myEvents"
    eventAttendees.forEach((attendee) => {
      firebase.firestore().collection("users").doc(attendee.userID).update(
        {
          myEvents: firebase.firestore.FieldValue.arrayRemove(eventData)
        }
      )
    })

    // lastly, delete the event
    firebase.firestore().collection("events").doc(eventID).delete()

  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}

/**
 * Deletes event data from a user if it didn't delete properly
 * @param userID - userID
 * @param eventData - eventData
 */
 export async function fixDeletedEvent(userID, eventData) {
  try {
    firebase.firestore().collection("users").doc(userID).update(
      {
        myEvents: firebase.firestore.FieldValue.arrayRemove(eventData)
      }
    )
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}


/**
 * Copy this template for making new firebase functions
 * @param args - arguments
 */
export async function template(args) {
  try {
    // do stuff
  } catch (err) {
    console.log(err);
    Alert.alert("something went wrong!", err.message);
  }
}
