import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import _ from 'lodash';
import {teacherAttributeMap} from 'mapping';

/**
  this component used to filter and select teachers.
 */
export default class TeachersPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      teachers: _.cloneDeep(props.teachers)
    };

    // console.log(props.defaultTeachers) ;
    // initialize teacher status
    if(props.defaultTeachers){                    // defaultTeachers: 預設要被勾選的 teachers
      this.state.teachers.forEach(teacher => {
        const _defaultTeacher = props.defaultTeachers.find(t => t.memberId === teacher.memberId);
        if(_defaultTeacher){
          teacher._checked = true;
          teacher.isMain = _defaultTeacher.isMain;
        }
        else{
          teacher._checked = false;
          teacher.isMain = false;
        }
      })
    }
  }

  componentWillReceiveProps = newProps => {
    let nextState = {
      open: newProps.open,
      teachers: _.cloneDeep(newProps.teachers)
    };

    // console.log(newProps.defaultTeachers) ;
    // initialize teacher status
    if(newProps.defaultTeachers){                    // defaultTeachers: 預設要被勾選的 teachers
      nextState.teachers.forEach(teacher => {
        const _defaultTeacher = newProps.defaultTeachers.find(t => t.memberId === teacher.memberId);
        // console.log(_defaultTeacher + "_defaultTeacher") ;
        if(_defaultTeacher){
          teacher._checked = true;
          teacher.isMain = _defaultTeacher.isMain;
        }
        else{
          teacher._checked = false;
          teacher.isMain = false;
        }
      })
    }
    this.setState(nextState);
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  resetState(){
    this.setState({defaultTeachers: [], teachers: []});
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleConfirm = () => {
    const teachers = this.state.teachers.filter(t => t._checked);
    console.log('teachers confirm > ' + JSON.stringify(teachers));
    this.props.onConfirm(teachers);
    this.handleClose();
    this.resetState();
  };

  setMainTeacher = (id) => {
    console.log('set main teacher id > ' + id);
    this.state.teachers.forEach(teacher => {
      if(teacher.id === id){
        teacher.isMain = true;
        teacher._checked = true;
      }
      else{
        teacher.isMain = false;
      }
    });
    this.setState({teachers: this.state.teachers});
  };

  handleCheckTeacher = (index, e) => {
    console.log('check teacher index > ' + index + ' checked > ' + e.target.checked);
    let teacher = this.state.teachers[index];
    teacher._checked = e.target.checked;
    if(!teacher._checked) teacher.isMain = false;
    if(teacher._checked === undefined) teacher.isMain = false;
    this.setState({teachers: this.state.teachers});
  };


  render() {
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

    return (
      <Dialog
          title="選擇授課講師"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          <form>
            <table className="teachers-table">
              <tbody>
                {this.state.teachers.map((teacher, index) => {
                  return (
                    <tr key={`teacher_${teacher.id}`}>
                      <td><input type="radio" name="main" value={teacher.id} checked={teacher.isMain} onChange={this.setMainTeacher.bind(this, teacher.id)} /></td>
                      <td><input type="checkbox" value={teacher.id} checked={teacher._checked} onChange={this.handleCheckTeacher.bind(this, index)} /></td>
                      <td>
                        <div className="teachers-teacher">
                          <img src={teacher.imagePath} style={{float:'left'}}/>
                          <div style={{float:'left'}}>
                            <div>{teacher.familyName + teacher.firstName}  [{teacherAttributeMap[teacher.attribute]}]</div>
                            <div>{teacher.cellphone}</div>
                            <div>{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                )})}
              </tbody>
            </table>
          </form>
      </Dialog>
    );
  }
}