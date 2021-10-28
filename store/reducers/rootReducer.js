import eventReducer from '../reducers/eventReducer';
import userReducer from '../reducers/userReducer';
import { combineReducers } from 'redux';

export deafult rootReducer = combineReducers({ 
    event: eventReducer 
    user: userReducer
});