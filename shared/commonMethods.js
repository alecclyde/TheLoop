
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

    switch (eventLoop) {
      case "Sports":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Fsports.jpg?alt=media&token=d91947fc-f06b-4930-be59-ccdad555b413";
      case "Music":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Fmusic.jpg?alt=media&token=7b4faf0f-3ea7-4c8e-bb8e-aa2496dc5244";
      case "Volunteer":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Fvolunteer.jpg?alt=media&token=5fbfa56e-7818-4a1c-b699-63b00a684649";
      case "Game":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Fgame.jpg?alt=media&token=40670497-8912-4a69-a2be-5cb6d2f821e2";
      case "Social":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Fsocial.jpg?alt=media&token=8ca12ec2-b087-4e20-8240-4f91155f4d3d";
      case "Arts":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Farts.jpg?alt=media&token=2341be93-4a13-4258-ace3-54513a6b5f4f";
      case "Outdoors":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Foutdoors.jpg?alt=media&token=edbee134-8383-4012-b5db-c860a1217876";
      case "Academic":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Facademic.jpg?alt=media&token=91e62de2-5787-41a1-8100-20f10bc29cf1";
      case "Media":
        return "https://firebasestorage.googleapis.com/v0/b/theloop-aa277.appspot.com/o/thumbnails%2Fmedia.jpg?alt=media&token=2f1ee04b-d0f2-49b2-958c-f0c7e8ee73a5";
    }
  }