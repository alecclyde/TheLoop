import { ADD_EVENT } from '../constants';

export function addEvent(event) {
    return {
        type: ADD_EVENT,
        payload: event
    }
}