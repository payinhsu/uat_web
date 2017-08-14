import _ from 'lodash';
import {caculateOrder} from 'lib/OrderUtil';

export function query(state={}, action) {
  switch(action.type) {
    case 'CHANGE_QUERY':
      return action.query;
    default:
      return state;
  }
}

export function orders(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_ORDERS':
      return action.orders;
    case 'ORDER_STATUS_CHANGED':
      let nextState = Object.assign([], state);
      return nextState.map(order => {
        if(order.id == action.orderId){
          order.orderStatus = action.orderStatus;
          order.matchAuthor = action.userId;
        }
        return order;
      });
    default:
      return state;
  }
}

export function selectedOrder(state = '', action) {
  switch(action.type) {
    case 'SELECT_ORDER':
      return action.id;
    default:
      return state;
  }
}

export function selectedOrderDetail(state = {}, action){
  switch(action.type) {
    case 'RECEIVE_ORDER_DETAIL':
      return action.orderDetail;
    case 'ACTIVE_ORDER_UPDATED':
      return action.updatedOrder;
    case 'ORDER_STATUS_CHANGED':
      if(state.id === action.orderId){
        return Object.assign({}, state, {orderStatus: action.orderStatus});
      }
      else {
        return state;
      }
    default:
      return state;
  }
}

// export function companyCandidates(state=[], action){
//   switch(action.type) {
//     case 'RECEIVE_COMPANY_CANDIDATES':
//       return action.companies;
//     default:
//       return state;
//   }
// }

function companyCandidates(state=[], action){
  switch(action.type){
    case 'RECEIVE_COMPANY_CANDIDATES':
      return action.companies;
    default:
      return state;
  }
}

export function assignment(state={}, action){
  switch(action.type){
    case 'SELECT_ROOTSERVICE':
      return Object.assign({}, state, {rootServiceId: action.rootCategoryId});
    case 'RECEIVE_COMPANY_CANDIDATES':
      return Object.assign({}, state, {
        rootCategoryId: action.rootCategoryId,
        companyCandidates: companyCandidates(action.companyCandidates, action)
      });
    default:
      return state;
  }
}

export function webOrderDetail(state={}, action){
  let nextState = {};
  switch(action.type) {
    case 'RECEIVE_WEB_ORDER_DETAIL':
      return action.webOrderDetail
    case 'ITEM_ZIPS_CHANGE':
      nextState = Object.assign({},state);
      let root3 = nextState.tmpOrder.rootServiceCategories.find(root => root.id === "3");
      let detail = root3.details[0];
      root3.pickUp == detail.pickUp || {};
      root3.pickUp.startZip = action.startZip;
      root3.pickUp.endZip = action.endZip;
      detail.price = action.price;
      caculateOrder(nextState.tmpOrder);
      return nextState;
    case 'CACHE_TMP_ORDER':
      return Object.assign({},state, {tmpOrder: action.tmpOrder});
    case 'RECEIVE_FARE':
      nextState = Object.assign({},state);
      let _root3 = nextState.tmpOrder.rootServiceCategories.find(root => root.id === "3");
      let _detail = _root3.details[0];
      _detail.price = action.fare;
      caculateOrder(nextState.tmpOrder);
      return nextState;
    case 'ORDER_STATUS_CHANGED':
      if(state.order && state.order.id === action.orderId){
        let o = Object.assign({}, state.order, {orderStatus: action.orderStatus});
        return Object.assign({}, state, {order : o});
      }
      else {
        return state;
      }
    default:
      return state;
  }
}

export function historys(state = {}, action) {
  switch(action.type) {
    case 'RECEIVE_DIFF_HISTORY':
      return action.historys;
    default:
      return state;
  }
}
