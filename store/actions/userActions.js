import { SET_USER } from '../constants';

export function setUser()
    return async function setUserThunk(dispatch, getState) {
        const user = await //Do firebase stuff to get current user info
        dispatch({ type: SET_USER, payload: user});
    }


// export function setUser(user) {
//     return {
//         type: SET_USER,
//         payload: user
//     }
// }