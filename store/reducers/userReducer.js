import { SET_USER } from '../constants';

const userReducer = (state, action) => {
    switch(action.type) {
        case SET_USER:
            return {
                action.payload,
            };
    default:
        return state;
    }
}
export default userReducer;

// export async function setUser(dispatch, getState) {
//     const user = await //Do firebase stuff
//     dispatch({ type: SET_USER, payload: user});
// }

//should this replace the firebasemethods?
//should I store all the events in redux?
//how to replace the user without replacing the entire store
//how does initialstate work? 