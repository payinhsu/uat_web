import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import CopyCoursePicker from 'components/master/CopyCoursePicker';
import * as DefinitionActions from 'actions/master/DefinitionActions';
import {classAttributeMap, courseStatusMap} from 'mapping';
var config = require('config-prod');

export default class CourseDefCourses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openCopyCoursePicker: false
    };
  }

  static onEnter(store){
    return (nextState, replace, callback) => {
      DefinitionActions.getDefinitions()(store.dispatch, store.getState).then(() => callback());
    }
  }

  componentDidMount() {
    this.props.getCourses(this.props.params.courseDefId);
  };

  onCloseCopyCoursePicker = () => {
    this.setState({openCopyCoursePicker: false});
  };

  onConfirmCopyCourse = (course) => {
    // if course is null it means user want to create a blank course.
    this.props.setCopyCourse(course);
    this.props.history.push(`${config.webContext}master/admin/courseDef/${this.props.params.courseDefId}/newCourse`);
  };

  handleOpenCopyCoursePicker = (e) => {
    console.log('click open');
    this.setState({openCopyCoursePicker: true});
  };

  handleEditCourse = (course, e) => {
    e.preventDefault();
    this.props.setCourse(course);
    this.props.history.push(`${config.webContext}master/admin/course/${course.id}`);
  };

  render() {
    let childProps = Object.assign({}, this.props);
    delete childProps.children;
    return (
    <div id="courseDef-courses-view">
      <h4>課程開班資訊</h4>
      <button onClick={this.handleOpenCopyCoursePicker}>新增班級</button>
      <table className={"order-list"}>
        <thead>
          <tr>
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
            {this.props.master.courses.map( (course, index) => (
              <tr key={`courseDef_course_${index}`}>
                <td>{course.startDate} ~ {course.endDate}</td>
                <td><a href="#" onClick={this.handleEditCourse.bind(this, course)}>{course.name}</a></td>
                <td>{course.price}</td>
                <td>{course.totalTime.hours}小時{course.totalTime.mins}分鐘</td>
                <td>{course.categories.map(cate => this.props.master.definition.categories.find(cate1 => cate === cate1.id)).map(cate => cate.name).join('、')}</td>
        				<td>{course.courseDefName}</td>
                <td>{course.orderMemberCount != 0 ?<Link to={`${config.webContext}master/admin/courseOrderMembers/${course.id}`}>{course.orderMemberCount}</Link> : course.orderMemberCount}</td>
                <td>{course.paidMemberCount != 0 ?<Link to={`${config.webContext}master/admin/courseOrderPaidMembers/${course.id}`}>{course.paidMemberCount}</Link> : course.paidMemberCount}</td>
                <td>{classAttributeMap[course.classAttribute]}</td>
                <td>{course.teachers[0].familyName}{course.teachers[0].firstName} {course.teachers.length >1 ? "+" + (course.teachers.length-1):'' }</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CopyCoursePicker open={this.state.openCopyCoursePicker} courseDefId={this.props.params.courseDefId} master={this.props.master} cleanCopyCourses={this.props.cleanCopyCourses} getCopyCourses={this.props.getCopyCourses} onRequestClose={this.onCloseCopyCoursePicker} onConfirm={this.onConfirmCopyCourse} />
        {this.props.children && React.cloneElement(this.props.children, childProps)}
      </div>
    );
  }
}