import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import {courseLevelMap} from 'mapping';
var config = require('config-prod');

export default class CourseDefs extends React.Component {

  componentDidMount() {
    this.props.getCourseDefs({organizationId:'1', rootCategoryId:'0'});
  };

  render() {
    let childProps = Object.assign({}, this.props);
    delete childProps.children;
    return (
      <div id="courseDefs-view">
      	<h4>課程管理</h4>
		    <Link to={`${config.webContext}master/admin/newCourseDef`}>新增課程</Link>
		    <table className={"order-list"}>
          <thead>
            <tr>
              <th>NO</th>
              <th>課程編號</th>
              <th>課程名稱</th>
              <th>課程圖片</th>
              <th>基本時數</th>
              <th>定價</th>
              <th>課程等級</th>
              <th>課程分類</th>
              <th>開班資訊</th>
            </tr>
          </thead>
          <tbody>

	        {this.props.master.courseDefs.map( (courseDef, index) => (
	        	<tr key={`course_def_${index}`}>
	        		<td>{index+1}</td>
	        		<td>{courseDef.id}</td>
              <td><Link to={`${config.webContext}master/admin/courseDef/${courseDef.id}`}>{courseDef.name}</Link></td>
	        		<td><img src={courseDef.thumbnailPath} /></td>
	        		<td>{courseDef.totalTime.hours}小時{courseDef.totalTime.mins}分</td>
	        		<td>{courseDef.price}</td>
	        		<td>{courseLevelMap[courseDef.level]}</td>
	        		<td>{courseDef.rootCategories.map(cate => cate.name).join(', ')}</td>
	        		<td><Link to={`${config.webContext}master/admin/courseDef/${courseDef.id}/courses`}>開班資訊</Link></td>
	        	</tr>
	        ))}
          </tbody>
        </table>
        {this.props.children && React.cloneElement(this.props.children, childProps)}
      </div>
    );
  }
}