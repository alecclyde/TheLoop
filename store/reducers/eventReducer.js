import { ADD_EVENT } from '../constants';

const initialState = 
const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_EVENT:
            return {
                ...state,
            };
    default:
        return state;
    }
}
export default eventReducer;

export async function getEvents(dispatch, getState) {
    const events = await 
    dispatch({ type: 'GET_EVENTS', payload: events});
}