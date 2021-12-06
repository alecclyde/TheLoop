import eventReducer from '../reducers/eventReducer';
import userReducer from '../reducers/userReducer';
import settingsReducer from './settingsReducer';
import { combineReducers } from 'redux';

export default rootReducer = combineReducers({ 
    events: eventReducer,
    user: userReducer,
    settings: settingsReducer
});