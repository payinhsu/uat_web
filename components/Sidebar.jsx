import React from 'react';
import {Link} from 'react-router';
var config = require('config-prod');

export default class Admin extends React.Component {
  render() {
    return (
      <ul id="sidebar-view">
      	{this.props.links.map(link => <li><Link to={link.url}>{link.text}</Link></li>)}
      </ul>
    );
  }
}