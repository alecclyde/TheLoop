import { ADD_EVENT } from '../constants';
import { GET_EVENTS } from '../constants';
import { REGISTER_EVENT } from '../constants';
import { UNREGISTER_EVENT } from '../constants';

function nextEventId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

const initialState = {
    id: {},
    events: []
};

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_EVENT:
            return {
                ...state,
                events: [...state.events, action.payload]
                }
        case GET_EVENTS:
            return {
                ...state.events
            };
        case REGISTER_EVENT:
            const newState = state.events.filter(x => x.id != action.payload.id).map(x => x.id);
            return {
                events: [...newState, action.payload]
            };
        case UNREGISTER_EVENT:
            return {

            };
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