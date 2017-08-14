/** senior reducers */
import { combineReducers } from 'redux'
import * as orderReducers from './OrderReducer';
const seniorReducers = combineReducers(orderReducers);
export default seniorReducers;