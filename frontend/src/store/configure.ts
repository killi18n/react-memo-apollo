import { combineReducers, compose, createStore } from 'redux';
import rootReducer from './modules';

const reducers = combineReducers(rootReducer);
const devtools =
    typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devtools || compose;

const configure = (preloadedState?: any) =>
    createStore(reducers, preloadedState, composeEnhancers());

export default configure;
