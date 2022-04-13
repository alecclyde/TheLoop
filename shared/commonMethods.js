
import moment from "moment"

// Tkaes a user document and returns a concatenated first and last name
//   ^ I will NEVER fix this typo
export function makeName(user) {
    return (user.firstName + ' ' + user.lastName)
}

/**
 * Returns a string representing the difference between the timestamp and now
 * @param timestamp - the timestamp in seconds to compare to now
 */
export function makeTimeDifferenceString(timestamp) {

    const difference = moment().unix() - timestamp;
    
    if (difference < 60) {
        return "<1m"

    } else if (difference < 3600) {
        return "" + Math.floor(difference / 60) + "m"

    } else if (difference < 86400) {
        return "" + Math.floor(difference / 3600) + "h"

    } else if (difference < 604800) { 
        return "" + Math.floor(difference / 86400) + "d"

    } else {
        return "" + Math.floor(difference / 604800) + "w"
    }
}

// given an event loop name, returns the name of the icon pertaining to it
export const eventLoopIconName = (eventLoop) => {
    switch (eventLoop) {
      case "Sports":
        return "futbol-o";
      case "Music":
        return "music";
      case "Volunteer":
        return "plus";
      case "Game":
        return "gamepad";
      case "Social":
        return "users";
      case "Arts":
        return "paint-brush";
      case "Outdoors":
        return "pagelines";
      case "Academic":
        return "book";
      case "Media":
        return "camera";
    }
  };

  export const eventLoopThumbnail = (eventLoop) => {

    if (eventLoop == "Outdoors") {
      return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Foutdoors.jpg?alt=media&token=edbee134-8383-4012-b5db-c860a1217876"

    } else {
      return 'https://business.twitter.com/content/dam/business-twitter/insights/may-2018/event-targeting.png.twimg.1920.png'
    }
  }