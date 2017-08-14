/** master reducers */
import { combineReducers } from 'redux'
import * as courseReducers from './CourseReducer';
import * as definitionReducers from './DefinitionReducer';
import * as memberReducers from './MemberReducer';
const masterResucers = combineReducers({...courseReducers, ...definitionReducers, ...memberReducers});
export default masterResucers;