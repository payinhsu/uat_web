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
export default class SubTeachersPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      teachers: props.teachers, 
      defaultTeacherId: props.defaultTeacherId
    };

    //console.log("sub Teacher : " +  this.state.teachers ) ;
    // console.log("sub TeacherId : " +  this.state.defaultTeacherId ) ;
    // initialize teacher status
    if(props.defaultTeacherId){                    // defaultTeachers: 預設要被勾選的 teachers
      this.state.teachers.forEach(teacher => {
        const _defaultTeacher = props.teachers.find(t => t.id === props.defaultTeacherId);
        if(_defaultTeacher){
          teacher.isMain = _defaultTeacher.isMain;
        }
      })
    }
  }

  componentWillReceiveProps = newProps => {
    let nextState = {
      open: newProps.open,
      teachers: _.cloneDeep(newProps.teachers), 
      defaultTeacherId: _.cloneDeep(newProps.defaultTeacherId)
    };

    // initialize teacher status
    if(newProps.defaultTeachers){                    // defaultTeachers: 預設要被勾選的 teachers
      nextState.teachers.forEach(teacher => {
        const _defaultTeacher = newProps.defaultTeachers.find(t => t.id === teacher.id);
        if(_defaultTeacher){
          teacher.isMain = _defaultTeacher.isMain;
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
    //console.log("teachers " + JSON.stringify(this.state.teachers))  ;
    const teachers = this.state.teachers.filter(t => t.isMain == true);
    //console.log('teachers confirm > ' + JSON.stringify(teachers));
    //console.log("teacherId : " + teachers[0].memberId) ;
    this.props.onConfirm(teachers[0].memberId);
    this.handleClose();
    this.resetState();
  };

  setMainTeacher = (id) => {
    //console.log('set main teacher id > ' + id);
    this.state.teachers.forEach(teacher => {
      if(teacher.id === id){
        teacher.isMain = true;
      }
      else{
        teacher.isMain = false;
      }
    });
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