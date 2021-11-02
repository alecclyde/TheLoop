import { ADD_EVENT } from '../constants';
import { GET_EVENTS } from '../constants';

export function addEvent(event) {
    return async function addEventThunk(dispatch, getState){
        const event = await //add event to firebase
        dispatch({ type: ADD_EVENT, payload: event})
    }
}

export async function getEvents() {
    return async function getEventsThink(dispatch, getState){
        const events = await //get events from database
        dispatch({ type: GET_EVENTS, payload: events});
    }
}