import React, { PropTypes } from 'react';
import {Link} from 'react-router';

export default class Admin extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    let childProps = Object.assign({}, this.props);
    delete childProps.children;
    return (
      <div id="admin-view">
        {this.props.children && React.cloneElement(this.props.children, {...childProps})}
      </div>
    );
  }
}