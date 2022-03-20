
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