import React, { Component , PropTypes }   from 'react';
import {Link} from 'react-router';
import {sexNameMap, paymentStatusMap, serviceNameMap, applyStatusMap,zipsMap} from 'mapping';
var config = require('config-prod');

export default class ActiveOrderListItem extends Component {
  componentDidMount() {
  };

  render() {
    const { order, dispatch, orderIndex } = this.props;
    return (
        <tr key={this.props.orderIndex} data-id={orderIndex}>
          <td>{order._orderDate}</td>
          <td className="txt-blue">{ order.updateDate - order.orderDate > 1000 ? order._updateDate : "" }</td>
          <td>
          	<Link to={`${config.webContext}senior/admin/order/${order.id}/active`}>{order.id}</Link>
          </td>
          <td className="txt-blue">
              {order.rootServiceCategories.map(
                (rootService, index) => { return (<div key={`nickname_${index}`}>{rootService.nickname}</div>); }
              )}
          </td>
          <td>{order.careMember.name} ({sexNameMap[order.careMember.sex]})</td>
          <td>{order.careMember.zipId == undefined ? "" : zipsMap[order.careMember.zipId].name}</td>
          <td className="txt-blue">
              {order.rootServiceCategories.map(
                (rootService, index) => { return (<div key={`service_date_${index}`}>{rootService._serviceDate}</div>); }
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
                (rootService, index) => { return (<div key={`subtotal_price_${index}`}>{rootService.subtotalPrice}</div>); }
              )}
          </td>
          <td>{paymentStatusMap[order.paymentStatus]}</td>
          <td className="txt-orange">{order.isOverdue?'訂單取消':'訂單成立'}</td>
          <td>無</td>
        </tr>
	)
  }
}

