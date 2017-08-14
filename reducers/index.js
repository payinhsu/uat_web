import { combineReducers } from 'redux'
import senior from './senior';
import master from './master';
import {auth} from './AuthReducer';
import management from './management';

/** export combined reducers used by app */
export {auth, senior, master, management};
