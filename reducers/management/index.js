/** management reducers */
import { combineReducers } from 'redux'
import * as utilReducers from './UtilReducer';
const managementReducers = combineReducers(utilReducers);
export default managementReducers;