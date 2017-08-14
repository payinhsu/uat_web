import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import Sidebar from 'components/Sidebar';

export default class Management extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };

  static links = [
    {url:'/management/admin/sms', text:'簡訊發送'}
  ];

  render() {
    return (
      <div id="management-view">
      	<h4>後台管理</h4>
        <hr />
        <Sidebar links={Management.links} />
        {this.props.children && React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}