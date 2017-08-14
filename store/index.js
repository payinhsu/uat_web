import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'middlewares/logger';
import * as reducers from 'reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk, logger),
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
)(createStore);

function configureStore() {
	const initialState = (typeof window === 'object'  && typeof window.__INITIAL_STATE__ === 'object' && window.__INITIAL_STATE__) || {};
	const store = createStoreWithMiddleware(combineReducers(reducers), initialState);
	return store;
}

export default configureStore