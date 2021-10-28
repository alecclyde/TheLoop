import { SET_USER } from '../constants';

export async function setUser(dispatch, getState) {
    const user = await //Do firebase stuff
    dispatch({ type: SET_USER, payload: user});
}


// export function setUser(user) {
//     return {
//         type: SET_USER,
//         payload: user
//     }
// }