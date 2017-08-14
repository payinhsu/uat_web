/** this module provides app level actions **/
import { bindActionCreators }  from 'redux'

/** senior actions **/
import * as OrderActions       from 'actions/senior/OrderActions';

/** master actions **/
import * as CourseActions       from 'actions/master/CourseActions';
import * as DefinitionActions   from 'actions/master/DefinitionActions';

/** util actions **/
import * as UtilActions from 'actions/management/UtilActions';

const seniorActions = Object.assign({}, OrderActions /*, ... */);
const masterActions = Object.assign({}, CourseActions, DefinitionActions);
const commonActions = Object.assign({}, UtilActions);

export default function mapDispatchToProps(dispatch) {
  return { 
  	seniorActions: bindActionCreators(seniorActions, dispatch),
  	masterActions: bindActionCreators(masterActions, dispatch), 
  	commonActions: bindActionCreators(commonActions, dispatch)
  }
}