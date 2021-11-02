import { ADD_EVENT } from '../constants';

const eventReducer = (state, action) => {
    switch(action.type) {
        case ADD_EVENT:
            return {
                ...state.events, 
                ...action.event
            };
        case GET_EVENTS:
            return {
                ...state.events
            }
    default:
        return state;
    }
}
export default eventReducer;


//this should probably be in actions
// export async function getEvents(dispatch, getState) {
//     const events = await //
//     dispatch({ type: 'GET_EVENTS', payload: events});
// }