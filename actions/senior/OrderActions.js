import api from 'api/SeniorAPI';

export function changeQuery(query){
  return {
      type: 'CHANGE_QUERY',
      query
  }
}

export function getOrders(initQuery) {
  return (dispatch, getState) => {
    if(initQuery) dispatch(changeQuery(initQuery));
    const query = getState().senior.query;
    console.log('query order param: ' + JSON.stringify(query));
    return new api(getState().auth).getOrders(query).then((orders)=> dispatch(receiveOrders(orders)));
  }
}

export function selectRootService(rootServiceId) {
  return {
    type:    'SELECT_ROOTSERVICE',
    rootServiceId
  }
}

export function getCompanyCandidates(rootCategoryId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getCompaniesByRootCategory(rootCategoryId).then(
      (companies)=> {
        dispatch(receiveCompanyCandidates(rootCategoryId, companies));
      }
    );
  }
}

export function receiveCompanyCandidates(rootCategoryId, companies) {
  return {
    type: 'RECEIVE_COMPANY_CANDIDATES',
    rootCategoryId,
    companies
  }
}

export function receiveOrders(orders) {
  	return {
	    type:    'RECEIVE_ORDERS',
      orders
	}
}

export function selectOrder(id) {
    return {
      type:    'SELECT_ORDER',
      id
  }
}

export function getOrderDetailFromPath(params) {
  return getOrderDetail(params.orderId);
}

export function getOrderDetail(id) {
  return (dispatch, getState) => {
    return new api(getState().auth).getOrderDetail(id).then((orderDetail)=> dispatch(receiveOrderDetail(orderDetail)));
  }
}

export function receiveOrderDetail(orderDetail) {
  return {
    type:    'RECEIVE_ORDER_DETAIL',
    orderDetail
  }
}

export function acceptOrder(orderId) {
  const orderStatus = '1';
  return (dispatch, getState) => {
    const auth = getState().auth;
    return new api(auth).updateOrderStatus(orderId, orderStatus).then((success) => dispatch(getOrders()));
  }
} // changeOrderStatus(auth.id, orderId, orderStatus)

export function cancelOrder(orderId) {
  const orderStatus = '9';
  return (dispatch, getState) => {
    const auth = getState().auth;
    return new api(auth).updateOrderStatus(orderId, orderStatus).then((success) => dispatch(changeOrderStatus(auth.id, orderId, orderStatus)));
  }
}

export function reAcceptOrder(orderId) {
  const orderStatus = '3';
  return (dispatch, getState) => {
    const auth = getState().auth;
    return new api(auth).updateOrderStatus(orderId, orderStatus).then((success) => dispatch(getOrders()));
  }
}  // changeOrderStatus(auth.id, orderId, orderStatus)

export function changeOrderStatus(userId, orderId, orderStatus){
  return {
    type:    'ORDER_STATUS_CHANGED',
    orderId,
    orderStatus,
    userId
  }
}

export function updateActiveOrder(order) {
  return (dispatch, getState) => {
    return new api(getState().auth).updateOrder(order).then(updatedOrder => dispatch(activeOrderUpdated(updatedOrder)));
  }
}

export function activeOrderUpdated(updatedOrder){
  return {
    type: 'ACTIVE_ORDER_UPDATED',
    updatedOrder: updatedOrder
  }
}

export function getWebOrderDetail(orderId){
  return (dispatch, getState) => {
    return new api(getState().auth).getWebOrderDetail(orderId).then(webOrderDetail => dispatch(receiveWebOrderDetail(webOrderDetail)));
  }
}

export function receiveWebOrderDetail(webOrderDetail){
  return {
    type:    'RECEIVE_WEB_ORDER_DETAIL',
    webOrderDetail
  }
}

export function receiveFare(orderId, fare){
  return {
    type:    'RECEIVE_FARE',
    orderId,
    fare
  }
}

export function saveTempOrder(webOrder){
  return (dispatch, getState) => {
    return new api(getState().auth).saveTempOrder(webOrder)
    .then(success => {
      if(success){
      dispatch(getWebOrderDetail(webOrder.id));
    }});
  }
}

export function confirmOrder(webOrder){
  return (dispatch, getState) => {
    return new api(getState().auth).confirmOrder(webOrder)
    .then(success => {
      if(success){
      dispatch(getWebOrderDetail(webOrder.id));
    }});
  }
}

export function changeItemZips(startZip, endZip, price){
  return {
    type: 'ITEM_ZIPS_CHANGE',
    startZip,
    endZip,
    price
  }
}

/** set the editing order to store */
export function cacheTmpOrder(tmpOrder){
  return {
    type: 'CACHE_TMP_ORDER',
    tmpOrder
  }
}

export function getFarePrice(orderId, serviceId, startZip, endZip){
  return (dispatch, getState) => {
    return new api(getState().auth).getFare(orderId, serviceId, startZip, endZip)
    .then(fare => {
      dispatch(receiveFare(orderId, fare));
    });
  }
}

export function receiveDiffHistory(orderId, historys){
  return {
    type:    'RECEIVE_DIFF_HISTORY',
    orderId,
    historys
  }
}

export function getDiffHistory(orderId, historyIndex){
  return (dispatch, getState) => {
    return new api(getState().auth).getDifferentHistoryOrders(orderId, historyIndex)
        .then(historys => {
          dispatch(receiveDiffHistory(orderId, historys));
        });
  }
}
