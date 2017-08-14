import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';

/**
  the UI to filter and select a CourseDef item.
 */
export default class CourseDefPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      defaultCourseDefId: props.defaultCourseDefId
    };
    if(props.defaultCourseDefId && props.courseDefs){
      this.state.courseDef = props.courseDefs.find(courseDef => courseDef.id === props.defaultCourseDefId);
    }
  }

  componentWillReceiveProps = newProps => {
    let nextState = {
      open: newProps.open,
      defaultCourseDefId: newProps.defaultCourseDefId
    };
    if(newProps.defaultCourseDefId && newProps.courseDefs){
      nextState.courseDef = newProps.courseDefs.find(courseDef => courseDef.id === defaultCourseDefId);
    }
    this.setState(nextState);
  };

  componentDidMount() {
    this.props.getCourseDefs({organizationId:'0'});
  };

  handleChangeCourse = (courseDef) => {
    console.log('courseDef change > ' + JSON.stringify(courseDef));
    this.setState({courseDef});
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  resetState(){
    this.setState({courseDef: null, courseDefId: undefined});
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.onRequestClose();
  };

  handleConfirm = () => {
    console.log('courseDef confirm > ' + JSON.stringify(this.state.courseDef));
    this.props.onConfirm(this.state.courseDef);
    this.handleClose();
    this.resetState();
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
          title="選擇對應課程"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          <form>
            <table className="schedule-edit-table">
              <thead>
                <tr><th>選擇</th><th>課程編號</th><th>課程名稱</th><th>課程定價</th><th>基本時數</th><th>課程分類</th></tr>
              </thead>
              <tbody>
                {this.props.courseDefs.map(courseDef => {
                  return (
                    <tr key={`course_def_${courseDef.id}`}>
                      <td><input type="radio" name="course" value={courseDef.id} checked={this.state.courseDef && this.state.courseDef.id === courseDef.id } onChange={this.handleChangeCourse.bind(this, courseDef)} /></td>
                      <td>{courseDef.id}</td>
                      <td>{courseDef.name}</td>
                      <td>{courseDef.price}</td>
                      <td>{courseDef.totalTime.hours}小時 {courseDef.totalTime.mins}分</td>
                      <td>{courseDef.rootCategories.map(cate => cate.name).join('、')}</td>
                    </tr>
                )})}
              </tbody>
            </table>
          </form>
      </Dialog>
    );
  }
}