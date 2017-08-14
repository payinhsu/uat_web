import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Divider from 'material-ui/lib/divider';

export default class CopyCoursePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      courseId: undefined
    };
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    courseDefId: React.PropTypes.string.isRequired
  }

  componentWillReceiveProps = newProps => {
    this.setState({
      open: newProps.open,
      courseId: undefined
    });
    if(this.props.courseDefId !== newProps.courseDefId) this.loadCourses();
  };

  loadCourses(){
    this.props.cleanCopyCourses();
    this.props.getCopyCourses(this.props.courseDefId);
  }

  componentDidMount = () => {
    this.loadCourses();
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  resetState(){
    this.setState({courses:[]});
  }

  handleClose = () => {
    this.setState({open: false, courseId: undefined });
    this.props.onRequestClose();
  };

  handlePickCourse = (courseId) => {
    console.log('pick course > ' + courseId);
    this.setState({courseId: courseId});
  }

  handleConfirm = (e) => {
    e.preventDefault();
    const course = this.props.master.copyCourses.find(course => course.id === this.state.courseId);
    this.setState({
      open: false,
      courseId: undefined
    });
    this.props.onConfirm(course);
    this.handleClose();
  };

  handleConfirmBlank = (e) => {
    e.preventDefault();
    this.setState({
      open: false,
      courseId: undefined
    });
    this.props.onConfirm(null);
    this.handleClose();
  };
  render() {
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    const dateStyle = {width: 100};

    return (
      <Dialog
          title="選擇班級資訊複製"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <button onClick={this.handleConfirm}>複製班級</button>
        <button onClick={this.handleConfirmBlank}>新開空白班級</button>
        <Divider />
          <form>
            <table className={"order-list"}>
              <thead>
                <tr>
                  <th></th>
                  <th>上課日期</th>
                  <th>開班名稱</th>
                  <th>費用</th>
                  <th>時數</th>
                  <th>課程分類</th>
                  <th>對應課程</th>
                  <th>已報人數</th>
                  <th>已付費人數</th>
                  <th>班級屬性</th>
                  <th>講師名單</th>
                </tr>
              </thead>
              <tbody>
                {this.props.master.copyCourses.map( (course, index) => (
                  <tr key={`course_${index}`}>
                    <td><input type="radio" value={course.id} name="courseId" onChange={this.handlePickCourse.bind(this, course.id)} /></td>
                    <td>{course.startDate} ~ {course.endDate}</td>
                    <td>{course.name}</td>
                    <td>{course.price}</td>
                    <td>{course.totalTime.hours}小時{course.totalTime.mins}分鐘</td>
                    <td>{course.categories}</td>
                    <td>{course.courseDefName}</td>
                    <td>{course.orderMemberCount}</td>
					<td>{course.paidMemberCount}</td>
                    <td>{course.classAttribute}</td>
                    <td>{course.teachers[0].familyName}{course.teachers[0].firstName} {course.teachers.length >1 ? "+" + (course.teachers.length-1):'' }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
      </Dialog>
    );
  }
}