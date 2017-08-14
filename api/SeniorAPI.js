import axios from 'axios';
import config from 'config-prod';
import BaseAPI from './BaseAPI';

const APP_TOKEN = '8e387797-da95-4366-9578-74714b61effc';
const API_BASE_URL = config.seniorAPIUrl;

export default class SeniorAPI extends BaseAPI {
  constructor(auth) {
    super('SeniorAPI', API_BASE_URL, APP_TOKEN);
    this.token = auth ? auth.accessToken : APP_TOKEN;
    this.auth = auth;
    if(auth) this.USER_TOKEN = auth.accessToken;
  }

  /** private APIs **/
  getWebDetail(orderId, from){
    return this.get(`/order/${orderId}/webDetail`, {from:from}, this.auth.accessToken).then(resp => resp.data);
  }

  updateWebOrder(webOrder, saveType){
    const param = Object.assign({}, webOrder, {matchAuthor: this.auth.id, saveType})
    return this.put(`/order/${webOrder.id}/web`, param, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  /** public APIs **/
  saveTempOrder(webOrder){
    return this.updateWebOrder(webOrder, 'T');
  }

  confirmOrder(webOrder){
    return this.updateWebOrder(webOrder, 'C');
  }

  updateOrder(order){
    return this.put(`/order/${order.id}`, order, this.auth.accessToken)
    .then((resp) => this.getOrderDetail(order.id));
  }

  getDifferentHistoryOrders(orderId, historyIndex) {
    return this.get(`/order/${orderId}/history/${historyIndex}`, null, this.auth.accessToken).then((resp) => resp.data.historys)
  }

  getWebOrderDetail(orderId){
    return Promise.all(['H','T'].map(from => this.getWebDetail(orderId, from)).concat([this.getOrderDetail(orderId)])).then(orders => {
    return {reqOrder:orders[0], tmpOrder:orders[1], order:orders[2]};
  })};

  getFare(orderId, serviceId, startZip, endZip){
    return this.get(`/service/fare`, {serviceId, type:"I", startZip, endZip}, this.auth.accessToken).then(resp => resp.services.fare);
  }

  /** param fields: orderId, orderStatus(option), paymentStatus(option), updateAuthor  **/
  updateOrderStatus(orderId, orderStatus){
    const param = {orderStatus, updateAuthor: this.auth.id};
    return this.put(`/order/${orderId}/status`, param, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  /** this function is only used to load company services now **/
  getCompanyServices = (companyId) => {
    return this.get(`/company/${companyId}/detail`, {}, this.auth.accessToken).then((resp) => resp.data.companyServices);
  };

  getCompaniesByRootCategory(rootCategoryId){// return get(`${API_URL}/category/${rootCategoryId}/companies`, {}, USER_TOKEN).then((resp) => resp.data.companies);
    const self = this;
    return this.get(`/category/${rootCategoryId}/companies`, {}, this.auth.accessToken)
    .then(resp => resp.data.companies)
    .then(companies => Promise.all(companies.map(company => {
      return self.getCompanyServices(company.id).then(companyServices => {
        company.companyServices = companyServices;
        return company;
      })
    })));
  }

  getOrders(query){
    return this.get(`/orders`, query, this.auth.accessToken).then((resp) => resp.data.orders);
  }

  getOrderDetail(orderId){
    return this.get(`/order/${orderId}`, {}, this.auth.accessToken).then((resp) => resp.data);
  }

  sendSms(sms) {
    return this.post(`/sms`,sms, this.auth.accessToken).then((resp) => resp.data.response);
  }

  getSmsStatus(responseCode) { 
    return this.get(`/sms/${responseCode}`,null, this.auth.accessToken).then((resp) => resp.data.response);
   }
}