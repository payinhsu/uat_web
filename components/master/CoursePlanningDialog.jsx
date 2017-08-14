import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import LocalePicker from 'components/master/LocalePicker';
import Divider from 'material-ui/lib/divider';
import moment from 'moment';
import tv4 from 'tv4';
import {SCHEMA_COURSE_PLANNING} from 'lib/schema';
export default class CoursePlanningDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      planning: this.props.planning || this.emptyPlanningModel()
    };
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    planning: React.PropTypes.object,               // current model
    plannings: React.PropTypes.array.isRequired     // planning selection items.
  };

  emptyPlanningModel(){
    return {
      id: this.props.plannings[0].id,
      description: '',
      order: 0
    };
  };

  componentWillReceiveProps = newProps => {
    this.setState({
      open: newProps.open,
      planning: newProps.planning || this.emptyPlanningModel()
    });
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  resetState(){
    this.setState({planning: this.emptyPlanningModel()});
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleConfirm = () => {
    let valid = tv4.validate(this.state.planning, SCHEMA_COURSE_PLANNING);
    if(tv4.error){
      if(tv4.error.message === 'description' || tv4.error.dataPath.indexOf('description') > -1) {
          window.alert("說明欄位必須填寫"); 
      } else if (tv4.error.message === 'order' || tv4.error.dataPath.indexOf('order') > -1) {
          window.alert("順序欄位必須填寫"); 
      } else {
          window.alert(`${tv4.error.dataPath}: ${tv4.error.message}`);  
      }
    }
    else{
      this.props.onConfirm(this.state.planning);
      this.handleClose();
      this.resetState();
    }
  };

  handleChangePlanning(field, e){
    let value = e.target.value;
    if(field === 'order') value = parseInt(e.target.value);
    this.state.planning[field] = value;
    this.setState({planning: this.state.planning});
  }

  render() {
    const planning = this.props.plannings.find(planning => planning.id === this.state.planning.id);
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="確認"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConfirm}
      />,
    ];

    const dateStyle = {width: 100};

    return (
      <Dialog
          title="課程規劃"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          <form>
            <table className="planning-edit-table">
              <tbody>
              <tr>
                <td>順序</td>
                <td><input type="number" value={this.state.planning.order} onChange={this.handleChangePlanning.bind(this, 'order')} /></td>
              </tr>
              <tr>
                <td>類別</td>
                <td>
                  <select value={this.state.planning.id} onChange={this.handleChangePlanning.bind(this, 'id')}>
                    {this.props.plannings.map(planning => <option value={planning.id} key={`planning_id_${planning.id}`}>{planning.name}</option> ) }
                  </select>
                </td>
              </tr>
              <tr><td>說明</td><td><input type="text" value={this.state.planning.description} onChange={this.handleChangePlanning.bind(this, 'description')} /></td></tr>
              </tbody>
            </table>
          </form>
      </Dialog>
    );
  }
}
