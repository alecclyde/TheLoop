import { createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

const configureStore = () => {return createStore(rootReducer, composedEnhancer);}

export default configureStore;