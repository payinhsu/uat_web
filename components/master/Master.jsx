import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import Sidebar from 'components/Sidebar';
import config from 'config-prod';

export default class Master extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };

  // componentDidMount() {
  //   this.props.getCourseDefs({organizationId:'1', rootCategoryId:'0'});
  // };

  static links = [
    {url:`${config.webContext}master/admin/courseDefs`, text:'課程管理'},
    {url:`${config.webContext}master/admin/courses`, text:'班級管理'},
    // {url:'/', text:'講師管理'},
    // {url:'/', text:'學員管理'},
    // {url:'/', text:'教材管理'},
    {url:`${config.webContext}master/admin/questions`, text:'問卷管理'},
    {url:`${config.webContext}master/admin/examQuestions`, text:'題庫管理'}
    // {url:'/', text:'公告管理'},
    // {url:'/', text:'場地管理'}
  ];

  render() {
    return (
      <div id="master-view">
        <h4>銀髮學苑</h4>
        <hr />
        <Sidebar links={Master.links} />
        {this.props.children && React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}