import React, { PropTypes } from 'react';
import { connect }            from 'react-redux';
// import * as OrderActions       from 'actions/senior/OrderActions';
import mapDispatchToProps       from 'actions';
import {Link} from 'react-router';
var config = require('config-prod');

class App extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    let childProps = Object.assign({}, this.props);
    delete childProps.children;
      // <div id="main-view">     - origin
      //   <div>
      //     <Link to={`${config.webContext}senior`}>銀髮銀行</Link> &nbsp;
      //     <Link to={`${config.webContext}master`}>銀髮學苑</Link> &nbsp;
      //     <Link to={`${config.webContext}management`}>後台管理</Link>
      //     ({this.props.auth ? ' 您好, ' + this.props.auth.firstName : ' 未登入'})
      //   </div>
      //   {this.props.children && React.cloneElement(this.props.children, {...childProps})}
      // </div>

    return (
      <div id="main-view">
        {this.props.children && React.cloneElement(this.props.children, {...childProps})}
      </div>
    );
  }
}

export default connect(
  state => ({auth: state.auth, senior: state.senior, master: state.master, management: state.management}),
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => {
    const pathname = ownProps.location && ownProps.location.pathname || undefined;

    if(pathname && pathname.indexOf(`${config.webContext}senior`) === 0)
      return Object.assign({}, stateProps, {...dispatchProps.seniorActions, ...dispatchProps.commonActions}, ownProps);

    if(pathname && pathname.indexOf(`${config.webContext}master`) === 0)
      return Object.assign({}, stateProps, {...dispatchProps.masterActions, ...dispatchProps.commonActions}, ownProps);

    return Object.assign({}, stateProps, {...dispatchProps.seniorActions, ...dispatchProps.commonActions}, ownProps);
  }
)(App)