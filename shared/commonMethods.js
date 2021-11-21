
/**
 * Takes a user document (from doc.data()) and returns a concatenated first and last name
 * @param {user} user - The user's data
 */
export function makeName(user) {
    return (user.firstName + ' ' + user.lastName)
}