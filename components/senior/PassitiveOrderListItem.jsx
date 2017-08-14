import React, { Component , PropTypes }   from 'react';
import {Link} from 'react-router';
import {sexNameMap, paymentStatusMap, applyStatusMap, serviceNameMap, MapapplyStatusMap,zipsMap} from 'mapping';
import { browserHistory } from 'react-router';
var config = require('config-prod');

export default class PassitiveOrderListItem extends Component {
  componentDidMount() {
  };

  // handleClick = (e) => {
  //   // this.context.router.push(`/order/${this.props.order.id}/assign`);
  //   this.props.selectRootService(1);
  //   this.props.history.push(`/order/${this.props.order.id}/assign`);
  // };

  handleAcceptOrder = (orderId) => {
    this.props.acceptOrder(orderId) 
    // this.props.getOrders();
  }

  handleReAcceptOrder = (orderId) => {
    this.props.reAcceptOrder(orderId) 
    // this.props.getOrders();
  }

  renderOpBtns = order => {
  	switch(order.orderStatus){
  		case '0':
  			return <button type="button" onClick={this.handleAcceptOrder.bind(this, order.id)} className="btn-warning btn-default">派案</button>;
  		case '3':
  			return <button type="button" onClick={this.handleReAcceptOrder.bind(this, order.id)} className="btn-danger btn-default">重新派案</button>;
  		default:
  			return '';
  	}
  };

  render() {
    const { order, dispatch, orderIndex } = this.props;
    return (
        <tr key={this.props.orderIndex} data-id={orderIndex}>
          <td>{order._orderDate}</td>
          <td className="txt-blue">{ order.updateDate - order.orderDate > 1000 ? order._updateDate : "" }</td>
          <td>
          	<Link to={`${config.webContext}senior/admin/order/${order.id}/passive`}>{order.id}</Link>
          </td>
          <td className="txt-blue">{order.careMember.name} ({sexNameMap[order.careMember.sex]})</td>
          <td>{order.careMember.zipId == undefined ? '':zipsMap[order.careMember.zipId].name }</td>
          <td className="txt-blue">
              {order.rootServiceCategories.map(
                (rootService, index) => { return (<div key={`service_date_${index}`}>{rootService.display ? rootService._serviceDate : ""}</div>); }
              )}
          </td>
          <td>
              {order.rootServiceCategories.map(
                (rootService, index) => {
                  var style ;
                  if(rootService.id == '1') {
                      style = "t1" ;
                  } else if(rootService.id == '2') {
                      style = "t2" ;
                  } else if (rootService.id == '3') {
                      style = "t3" ;
                  } else {
                      style = "t4" ;
                  }
                  return (<div key={`root_id_${index}`} className={style}>{serviceNameMap[rootService.id]}</div>);
                }
              )}
          </td>
          <td className="txt-orange cost">
              {order.rootServiceCategories.map(
                (rootService, index) => { return (<div key={`subtotal_price_${index}`}>{rootService.display ? rootService.subtotalPrice : ""}</div>); }
              )}
          </td>
          <td>{applyStatusMap[order.applyStatus]}</td>
          <td className="txt-orange">{paymentStatusMap[order.paymentStatus]}</td>
          <td>{order.isOverdue?'逾期未付款':''}</td>
          <td>{order.matchAuthorName}</td>
          <td>{order.orderStatus == '9' ? '訂單取消' : '' }{this.renderOpBtns(order)}</td>
        </tr>
	)
  }
}

