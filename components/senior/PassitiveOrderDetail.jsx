import React, { Component , PropTypes }   from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as OrderActions       from 'actions/senior/OrderActions';
import {Link} from 'react-router';
import _ from 'lodash';
import api from 'api/SeniorAPI';
import CompanyServicePicker from './CompanyServicePicker';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import Snackbar from 'material-ui/lib/snackbar';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Checkbox from 'material-ui/lib/checkbox';
import {getCleanSizeMins, resetTotalCareMins, caculateOrder} from 'lib/OrderUtil';
import moment from 'moment';
import {requireAuth} from 'auth';
import $ from 'jquery'
var config = require('config-prod');

import {carSpecMap, applyStatusMap, sexNameMap, zipsMap, diseasesMap, disablilitiesMap} from 'mapping';

class PositiveOrderDetail extends Component {

  constructor(props) {
    super(props);
    props.senior.query.type = PositiveOrderDetail.orderType;
    this.state = {
      openServicePicker:false,
      rootCategoryId:undefined,
      tmpOrder: props.webOrderDetail.tmpOrder,
      historyNumbers: props.webOrderDetail.order.historyNumbers,
      snackbarOpen: false,
      snackMessage: ''
    };

    //console.log(this.state) ;
    /** 隨行管家初始化 */
    const root3 = props.webOrderDetail.tmpOrder.rootServiceCategories.find(root => root.id === '3');
    if(root3) this.state.root3 = root3;
    if(root3 && root3.details && root3.details.length) {
      // if(root3.pickUp){
      this.state.currentStartZip = root3.pickUp.startZip;
      this.state.currentEndZip = root3.pickUp.endZip;
    }

    this._priceInputs = {};
  }

  componentDidMount() {
    console.log("do did mount") ;
    //console.log(this.state) ;
    $(".gototop a").click(function()
    {
      $('html,body').animate({scrollTop: 0}, 500);
    });
  } ;

  static orderType = 'P';
  
  static needs = [
    OrderActions.getOrderDetailFromPath
  ];

  static onEnter(store){
    return (nextState, replace, callback) => {
      new api(store.getState().auth).getWebOrderDetail(nextState.params.orderId).then(webOrderDetail => {
        store.dispatch(OrderActions.receiveWebOrderDetail(webOrderDetail));
        callback();
      });
    }
  }

  /** fields edit control **/
  isDisabled = (field) => {

    const {order} = this.props.webOrderDetail;
    if(order.orderStatus === '1' || order.orderStatus === '2' || order.orderStatus === '3'){     // 我要派案, user拒絕 (所有欄位均可變更)
      return false;
    }else if(order.paymentStatus !== '0'){        // 已付款 (僅與 $ 無關欄位可變更)
      const editableFields = [
        // 'btnSaveTmp',
        // 'btnConfirm',
        // 'btnCancel',
        // 'btnCreateService',
        'careMember',
        'remark',
        'root.serviceDate',
        'root.cleanSize',
        'root.cleanSupply',
        'root.pickUp.startAddress',
        'root.pickUp.endAddress',
        'root.pickUp.wheelchairNum',
        'root.pickUp.passengerNum',
       ];
       return editableFields.indexOf(field) === -1;
    }
    else{
      return true;
    }
  };

  isCancel = (orderStatus) => {
      const style = {color: 'red'};
      if(orderStatus === '9'){
          return (<span style={style}> (訂單取消) </span>);
      } 
  } ;

  openPicker = (rootCategoryId) => {
    console.log('picker click: rootCategoryId > ' + rootCategoryId + ', props rootCategoryId > ' + this.state.rootCategoryId);
    if(this.state.rootCategoryId && rootCategoryId === this.state.rootCategoryId){
      this.setState({openServicePicker:true });
    } else {
      this.setState({openServicePicker:false });
      this.props.getCompanyCandidates(rootCategoryId);
    }
  };

  closeServicePicker = () => {
    this.setState(Object.assign({}, this.state, {
      openServicePicker: false
    }));
  };

  handleCompanyServicesPicked = (rootCategoryId, companyId, companyName, checkedServices) => {
    let nextState = {};
    let tmpOrder = Object.assign({}, this.props.webOrderDetail.tmpOrder);

    let rootCategory = tmpOrder.rootServiceCategories.find(rootCategory => rootCategory.id == rootCategoryId);

    // if this rootCategory have not been created, setup a new one.
    if(!rootCategory) {
      rootCategory = {id: rootCategoryId, details:[]};

      // setup related states that root3 needs.
      if(rootCategory.id === "3") {
        const startZip = checkedServices[0].startAreas[0].zips[0];
        const endZip = checkedServices[0].endAreas[0].zips[0];
        rootCategory.pickUp = {
          startZip: startZip.id,
          startAddress: '',
          endZip: endZip.id,
          wheelchairNum: 0,
          passengerNum: 1
        };
        this.setState({root3: rootCategory});
      }
      tmpOrder.rootServiceCategories.push(rootCategory);
    }
    rootCategory.companyId = companyId;
    rootCategory.companyName = companyName;
    rootCategory.details = checkedServices.map(service => {
      const detail = rootCategory.details.find(detail => detail.serviceDefId === service.serviceDefId);
      return {
        careMins: service.careMins,
        categoryName: service.categoryParentName,
        price: detail && detail.price || service.price,
        qty: detail && detail.qty || 1,
        // price: service.price,
        // qty: 1,
        companyServiceId: service.id,
        companyServiceName: service.name,
        serviceDefId: service.serviceDefId,
        serviceDefName: service.serviceDefName,
        definedPrice: service.price,
        calorie: service.calorie,
        companyServiceInfo: service
      };
    });
    if(rootCategory.id === '4'){
      if(!rootCategory.cleanSize) rootCategory.cleanSize = '1';
      if(!rootCategory.cleanSupply) rootCategory.cleanSupply = '1';
      resetTotalCareMins(rootCategory);
    }
    caculateOrder(tmpOrder);
    nextState.tmpOrder = tmpOrder;
    this.setState(nextState);
  };


  componentWillReceiveProps = newProps => {
    // console.log('========= comparing assignment ====== > ' + this.props.assignment.rootCategoryId + " > " + newProps.assignment.rootCategoryId);
    if(this.props.assignment.rootCategoryId !== newProps.assignment.rootCategoryId){
      console.log('opening dialog');
      this.setState(Object.assign({}, this.state, {
        openServicePicker: true,
        rootCategoryId:newProps.assignment.rootCategoryId 
      }));
    }

    if(this.props.webOrderDetail != newProps.webOrderDetail){
      // set state for root3 (if the original details is empty, some states will be empty.)
      const root3 = newProps.webOrderDetail.tmpOrder.rootServiceCategories.find(root => root.id === '3');
      this.setState({root3: root3});
      if(root3 && root3.details && root3.details.length) {

        // set currentStartZip & currentEndZip for dynamic price caculation.
        if(!this.state.currentStartZip || !this.state.currentEndZip) {
          this.setState({
            currentStartZip: root3.pickUp.startZip,
            currentEndZip: root3.pickUp.endZip
          });
        }
      }
    }
  };

  serviceDesc = (rootCategoryId) => {
    switch(rootCategoryId){
      case '1': return {
        name: '照顧服務',
        serviceDate: '計劃照顧時間',
      }
      case '2': return {
        name: '餐食服務',
        serviceDate: '計劃送餐時間',
      }
      case '3': return {
        name: '隨行服務',
        serviceDate: '計劃接送時間',
      }
    }
  }

  // handleAssignClick = (rootServiceId) => {
  //   console.log('assigning root service > ' + rootServiceId);
  //   this.props.selectRootService(rootServiceId);
  //   // this.props.history.push(`/order/${this.props.orderDetail.id}/assign`);
  //   this.props.history.push(`/order/${this.props.webOrderDetail.tmpOrder.id}/assign`);
  // }

  handleChangePrice = (root, companyServiceId, e) =>{
    // let nextTmpOrder = Object.assign({}, this.props.webOrderDetail.tmpOrder);
    const price = parseInt(e.target.value);
    root.details.find(detail => detail.companyServiceId === companyServiceId).price = price;
    caculateOrder(this.state.tmpOrder);
    this.setState({tmpOrder:this.state.tmpOrder});
  };

  handleChangeQty = (root, companyServiceId, e) =>{
    const qty = parseInt(e.target.value);
    root.details.find(detail => detail.companyServiceId === companyServiceId).qty = qty;
    if(root.id === '4') resetTotalCareMins(root);
    caculateOrder(this.state.tmpOrder);
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handlePickUpChange = (pickUpField, e) => {
    this.props.cacheTmpOrder(this.state.tmpOrder);
    let pickUp = this.state.root3.pickUp;

    let value = pickUpField === 'passengerNum' || pickUpField === 'wheelchairNum' ? parseInt(e.target.value) : e.target.value;

    // reset wheelchairNum
    if(pickUpField === 'passengerNum') pickUp.wheelchairNum = 0;

    pickUp[pickUpField] = value;
    this.setState({root3: this.state.root3});
    const serviceId = this.state.root3.details[0].companyServiceId;
    this.props.getFarePrice(this.state.tmpOrder.id, serviceId, pickUp.startZip, pickUp.endZip);
  };

  handleChangeHourPrice = (root, e) => {
    const hourPrice = parseInt(e.target.value);
    root.details.forEach(detail => detail.price = detail.careMins / 60 * hourPrice);
    caculateOrder(this.state.tmpOrder);
    this.setState({tmpOrder: this.state.tmpOrder});
  }

  handleChangeTotalCareMins = (root, e) => {
    const totalCareMins = parseInt(e.target.value);
    root.totalCareMins = totalCareMins;
    caculateOrder(this.state.tmpOrder);
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handleChangeCleanSize = (root, e) => {
    const cleanSize = e.target.value;
    const cleanMinsA = getCleanSizeMins(root.cleanSize);
    const cleanMinsB = getCleanSizeMins(cleanSize);
    root.cleanSize = cleanSize;
    root.totalCareMins += cleanMinsB - cleanMinsA;
    caculateOrder(this.state.tmpOrder);
    this.setState({tmpOrder: this.state.tmpOrder});
  }

  handleChangeCleanSupply = (root, e) => {
    const cleanSupply = e.target.value;
    root.cleanSupply = cleanSupply;
    caculateOrder(this.state.tmpOrder);
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handleCareMemberChange = (field, e) => {
    this.state.tmpOrder.careMember[field] = e.target.value;
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handleServiceCheck = (serviceId, serviceName, e) => {
    console.log(`${serviceName} checked: ${e.target.checked}`);
    this._checkServices.find(service => service.id === serviceId).checked = e.target.checked;
  }

  handleRemarkChange = (e) => {
    this.state.tmpOrder.remark = e.target.value;
    this.setState({tmpOrder: this.state.tmpOrder});
  }

  handleHealthStatusesCheck = (disablilityId, e) => {
    let healthStatuses = this.state.tmpOrder.careMember.healthStatuses;
    const checked = e.target.checked;
    if(checked)
      healthStatuses.push(disablilityId);
    else
      healthStatuses.splice(healthStatuses.indexOf(disablilityId), 1);
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handleHealthRecordsCheck = (diseaseId, e) => {
    let healthRecords = this.state.tmpOrder.careMember.healthRecords;
    const checked = e.target.checked;
    if(checked)
      healthRecords.push(diseaseId);
    else
      healthRecords.splice(healthRecords.indexOf(diseaseId), 1);
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  saveTempOrder = () => {
    this.showTip('暫存中 ..');
    this.props.saveTempOrder(this.state.tmpOrder);
  };

  confirmOrder = () => {
    const emptyRoot = this.state.tmpOrder.rootServiceCategories.find(root => root.details.length === 0);
    const orderStatus = this.props.webOrderDetail.order.orderStatus ;
    console.log(orderStatus) ;
    if(emptyRoot){
      this.showTip('確認失敗，尚有管家未派案，請先完成派案。');
    } else if(orderStatus === '2' || orderStatus === '4'){
      ////console.log(this.state) ;
    } else {
      if(confirm('確認送出派案報告?')) {
          this.showTip('確認中 ..');
          this.props.webOrderDetail.order.orderStatus = 2 ;
          this.props.confirmOrder(this.state.tmpOrder);
      }
      //console.log(this.state) ;
    }
  };

  saveOrder = () => {
    this.showTip('確認變更中 ..');
    this.state.tmpOrder.rootServiceCategories.forEach(root => root.details.forEach(detail => detail.serviceId = detail.companyServiceId));
    this.props.updateActiveOrder(this.state.tmpOrder);
  };

  handleServiceDateChange = (rootCategory, e, date) => {
    const newServiceDateStr = moment(date).format("YYYY-MM-DD") + ' ' + moment(rootCategory.serviceDate).format('HH:mm:ss');
    rootCategory.serviceDate = newServiceDateStr;
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handleServiceTimeChange = (rootCategory, err, time) => {
    const newServiceDateStr = moment(rootCategory.serviceDate).format("YYYY-MM-DD") + ' ' + moment(time).format('HH:mm') + ':00';
    rootCategory.serviceDate = newServiceDateStr;
    // this.refs[`serviceTime_${rootCategory.id}`].setTime(time);
    this.setState({tmpOrder: this.state.tmpOrder});
  };

  handleCancelOrder = (orderId) => {
  	  this.showTip('取消中 ..');
      if(confirm("確定取消此筆訂單？")){
          this.props.cancelOrder(orderId); 
      }   
  }

  serviceDatePicker = (rootCategory) => {
    const style = {width: 150};
    const serviceDate = moment(rootCategory.serviceDate).toDate();
    return <DatePicker id={`root_${rootCategory.id}_service_date`} disabled={this.isDisabled('root.serviceDate')} style={style} value={serviceDate} onChange={this.handleServiceDateChange.bind(this, rootCategory)} />
  };

  serviceTimePicker = (rootCategory) => {
    const style = {width: 100};
    const serviceDate = moment(rootCategory.serviceDate).toDate();
    return <TimePicker id={`root_${rootCategory.id}_service_time`} disabled={this.isDisabled('root.serviceDate')} style={style} value={serviceDate} format="24hr"hintText="服務時間"onChange={this.handleServiceTimeChange.bind(this, rootCategory)} />;
  };

  showTip = (message) => {
    this.setState({snackbarOpen:true, snackMessage:message});
  };

  isNewService = (root) => {
      // console.log(root.serviceIsChange) ;
      if(root.serviceIsChange) {
          return (<span style={{color:'red'}}> (新增) </span>);
      } else {
          return ("");
      }
  }; 

  getServiceDate = (root) => {
      if(root.dateIsChange || root.timeIsChange) {
          return (<span style={{color:'red'}}>{root.serviceDate}</span>);
      } else { 
          return (<span>{root.serviceDate}</span>);
      }
  }; 

  generateRoot1View = (root) => {
    root = root || {id:"1"};
    if(!root || !root.details || !root.details.length) {
    return (
        <tag>

          <FloatingActionButton disabled={this.isDisabled('btnCreateService')} mini={true} secondary={true} onTouchTap={this.openPicker.bind(this,root.id)}>
            <ContentAdd />
          </FloatingActionButton>

          <table className="right">
              {
                root.serviceDate && root.details.length > 0?
                <tr>
                  <th>計畫照顧時間</th>
                  <td className="change">
                    {this.serviceDatePicker(root)}
                    {this.serviceTimePicker(root)}
                  </td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>:
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              }
          </table>

        </tag>
      )
    }

    const self = this;
    const desc = this.serviceDesc(root.id);
    const grouped = _.groupBy(root.details, detail => detail.categoryName)
    const numberInputStyle = {
      width: 80
    }
    return (
      <tag>

        <RaisedButton label="指派服務" disabled={self.isDisabled('btnCreateService')} secondary={true} onTouchTap={this.openPicker.bind(this,root.id)} />

        <table className="right">
          <tbody key={"service"}>
            <tr>
              <th>服務提供</th>
              <td><span className="icon1">企</span> {root.companyName}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th width="100">計畫時間</th>
              <td className="change" colSpan="4">
                {this.serviceDatePicker(root)}
                {this.serviceTimePicker(root)}
              </td>
            </tr>
            <tr>
              <th className="subTTL">類別</th>
              <th className="subTTL">名稱</th>
              <th className="subTTL" width="60">時間</th>
              <th className="subTTL" width="60">單價</th>
              <th className="subTTL" width="60">金額</th>
            </tr>
            {
              Object.getOwnPropertyNames(grouped).map(function(categoryName){
                return grouped[categoryName].map(function(categoryItem, inner_index){
                  return (
                    <tr key={`${inner_index}_${categoryItem.categoryName}`}>
                      <td>{inner_index == 0 ? categoryName : ""}</td>
                      <td>{categoryItem.companyServiceName}</td>
                      <td className="time">{categoryItem.careMins} 分鐘</td>
                      <td className="cost">
                        <input disabled={self.isDisabled('root.detail.price')} type="number" min="0" style={numberInputStyle} onChange={self.handleChangePrice.bind(self, root, categoryItem.companyServiceId)} defaultValue={categoryItem.price} title={`定價: ${categoryItem.definedPrice}`} />&nbsp;
                      </td>
                      <td className="cost">{categoryItem.price * categoryItem.qty} 元</td>
                  </tr>)
                })
              })
            }
              <tr>
                <th colSpan="5" className="costTotal text-right">小計：${root.subtotalPrice}</th>
              </tr>
          </tbody>
        </table>
      </tag>
    )
  };



  generateRoot1StaticView = (root) => {
    root = root || {id:"1"};
    if(!root || !root.details || !root.details.length) {return (
        <h3></h3>
      )
    }

    const self = this;
    const desc = this.serviceDesc(root.id);
    const grouped = _.groupBy(root.details, detail => detail.categoryName)
    const numberInputStyle = {
      width: 80
    }
    return (
      <tag>
        <table className="left">
          <tbody key={"static_service_1"}>
            <tr>
              <th>申請明細</th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th width="100">預約時間</th>
              <td>{this.getServiceDate(root)}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th className="subTTL">類別</th>
              <th className="subTTL">名稱</th>
              <th className="subTTL">時間</th>
              <th className="subTTL">單價</th>
              <th className="subTTL">金額</th>
            </tr>

            {
              Object.getOwnPropertyNames(grouped).map(function(categoryName){
                return grouped[categoryName].map(function(categoryItem, inner_index){
                  return (
                    <tr key={`${inner_index}_${categoryItem.categoryName}`}>
                      <td>{inner_index == 0 ? categoryName : ""}</td>
                      <td>{categoryItem.serviceDefName}</td>
                      <td className="time">{categoryItem.careMins} 分鐘</td>
                      <td className="cost">{categoryItem.price} 元</td>
                      <td className="cost">{categoryItem.price * categoryItem.qty} 元</td>
                  </tr>)
                })
              })
            }
            <tr>
              <th colSpan="5" className="costTotal">預估金額：${root.subtotalPrice}</th>
            </tr>
          </tbody>
        </table>
      </tag>
    )
  };

  generateRoot2View = (root) => {
    root = root || {id:"2"};
    if(!root || !root.details || !root.details.length) {return (
        <tag>

          <FloatingActionButton disabled={this.isDisabled('btnCreateService')} mini={true} secondary={true} onTouchTap={this.openPicker.bind(this,root.id)}>
            <ContentAdd />
          </FloatingActionButton>

          <table className="right">
              {
                root.serviceDate && root.details.length > 0?
                <tr>
                  <th>計畫送餐時間</th>
                  <td className="change">
                    {this.serviceDatePicker(root)}
                    {this.serviceTimePicker(root)}
                  </td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>:
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              }
          </table>

        </tag>
      )
    }
    const self = this;

    const numberInputStyle = {
      width: 80
    };
    return (

      <tag>

        <RaisedButton disabled={self.isDisabled('btnCreateService')} label="指派服務" secondary={true} onTouchTap={this.openPicker.bind(this,root.id)} />

        <table className="right">
          <tbody key={"service"}>
            <tr>
              <th>服務提供</th>
              <td><span className="icon1">企</span> {root.companyName}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th width="100">計劃時間</th>
              <td className="change" colSpan="4">
                {this.serviceDatePicker(root)}
                {this.serviceTimePicker(root)}
              </td>
            </tr>
            <tr>
              <th className="subTTL">餐食內容</th>
              <th className="subTTL" width="60">單價</th>
              <th className="subTTL" width="60">數量</th>
              <th className="subTTL" width="60">金額</th>
            </tr>
            {
              root.details.map(function(detail, index){
                return (
                  <tr key={`root2_item_${index}`}>
                    <td>{(detail.companyServiceName && detail.calorie) ? `${detail.companyServiceName}(${detail.calorie}卡)` : (detail.serviceDefName ? detail.serviceDefName + "(查無項目名稱)" : "(查無項目名稱)")}</td>
                    <td className="cost">
                      <input disabled={self.isDisabled('root.detail.price')} type="number" min="0" style={numberInputStyle} onChange={self.handleChangePrice.bind(self, root, detail.companyServiceId)} defaultValue={detail.price} title={`定價: ${detail.definedPrice}`} />
                    </td>
                    <td className="cost">
                      <input disabled={self.isDisabled('root.detail.qty')} type="number" min="1" style={numberInputStyle} onChange={self.handleChangeQty.bind(self, root, detail.companyServiceId)} defaultValue={detail.qty} />
                    </td>
                    <td className="cost">{detail.price * detail.qty} 元</td>
                </tr>)
              })
            }
              <tr>
                <th colSpan="5" className="costTotal text-right">小計：${root.subtotalPrice}</th>
              </tr>
          </tbody>
        </table>
      </tag>
    )
  };

  generateRoot2StaticView = (root) => {
    root = root || {id:"2"};
    if(!root || !root.details || !root.details.length) {return (
        <h3></h3>
      )
    }
    const self = this;

    const numberInputStyle = {
      width: 80
    }
    return (

      <tag>
        <table className="left">
          <tbody key={"service"}>
            <tr>
              <th>申請明細</th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th width="100">預約時間</th>
              <td>{this.getServiceDate(root)}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th className="subTTL">餐食內容</th>
              <th className="subTTL">單價</th>
              <th className="subTTL">數量</th>
              <th className="subTTL">金額</th>
            </tr>
            {
              root.details.map(function(detail, index){
                return (
                  <tr key={`root2_item_${index}`}>
                    <td>{detail.serviceDefName}</td>
                    <td className="cost">{detail.price}</td>
                    <td className="cost">{detail.qtyisChange? <span style={{color:'red'}}>{detail.qty}</span> : detail.qty }</td>
                    <td className="cost">{detail.price * detail.qty}</td>
                </tr>)
              })
            }
            <tr>
              <th colSpan="5" className="costTotal">預估金額：${root.subtotalPrice}</th>
            </tr>
          </tbody>
        </table>
      </tag>
    )
  };

  generateRoot3View = (root) => {
    root = root || {id:"3"};
    if(!root || !root.details || !root.details.length) {return (

        <tag>

          <FloatingActionButton disabled={this.isDisabled('btnCreateService')} mini={true} secondary={true} onTouchTap={this.openPicker.bind(this,root.id)}>
            <ContentAdd />
          </FloatingActionButton>

          <table className="right">
              {
                root.serviceDate && root.details.length > 0?
                <tr>
                  <th>計劃接送時間</th>
                  <td className="change">
                    {this.serviceDatePicker(root)}
                    {this.serviceTimePicker(root)}
                  </td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>:
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              }
          </table>

        </tag>
      )
    }

    const self = this;
    const detail = root.details[0];
    const startZips = _.flatten(detail.companyServiceInfo.startAreas.map(area => area.zips));
    const endZips = _.flatten(detail.companyServiceInfo.endAreas.map(area => area.zips));

    const currentStartZip = this.state.root3.pickUp.startZip;
    const currentEndZip = this.state.root3.pickUp.endZip;

    const carSpecs = carSpecMap[detail.serviceDefName];
    const passenger_wheelchairs = carSpecs.map(carSpecObj => {
      let wheelchairNums = [];
      for(var i=0; i<=carSpecObj.wheelchairNum; i++){
        wheelchairNums.push(i);
      }
      return {
        passengerNum: carSpecObj.passengerNum,
        wheelchairNums: wheelchairNums
      };
    });

    const passengers = passenger_wheelchairs.map(passenger_wheelchair => passenger_wheelchair.passengerNum);
    const wheelchairs = passenger_wheelchairs.find(obj => obj.passengerNum.toString() === this.state.root3.pickUp.passengerNum.toString()).wheelchairNums;

    let passengerSelect = (
    <select disabled={this.isDisabled('root.pickUp.passengerNum')} value={this.state.root3.pickUp.passengerNum} onChange={this.handlePickUpChange.bind(this, 'passengerNum')} >
      {passengers.map(num => <option key={`pessenger_opt_${num}`} value={num} >{num}</option>)}
    </select>);

    let wheelchairSelect = (
    <select disabled={this.isDisabled('root.pickUp.wheelchairNum')} value={this.state.root3.pickUp.wheelchairNum} onChange={this.handlePickUpChange.bind(this, 'wheelchairNum')} >
      {wheelchairs.map(num => <option key={`wheelchair_opt_${num}`} value={num} >{num}</option>)}
    </select>);

    let startZipSelect = (
    <select disabled={this.isDisabled('root.pickUp.startZip')} value={currentStartZip} onChange={this.handlePickUpChange.bind(this, 'startZip')} >
      {
        startZips.map(
        startZip => <option key={`start_zip_opt_${startZip.id}`} value={startZip.id} >{startZip.name}</option>)
      }
    </select>);

    let endZipSelect = (
    <select disabled={this.isDisabled('root.pickUp.endZip')} value={currentEndZip} onChange={this.handlePickUpChange.bind(this, 'endZip')}>
      {
        endZips.map(
        endZip => <option key={`end_zip_opt_${endZip.id}`} value={endZip.id} >{endZip.name}</option> )
      }
    </select>);

    return (

      <tag>
        <RaisedButton disabled={this.isDisabled('btnCreateService')} label="指派服務" secondary={true} onTouchTap={this.openPicker.bind(this,root.id)} />

        <table className="right">
          <tbody key={"service"}>
            <tr>
              <th>服務提供</th>
              <td><span className="icon1">企</span> {root.companyName}</td>
            </tr>
            <tr>
              <th width="100">計劃時間</th>
              <td className="change">
                {this.serviceDatePicker(root)}
                {this.serviceTimePicker(root)}
              </td>
            </tr>
            <tr>
              <th>接送區域</th>
              <td>{startZipSelect}</td>
            </tr>
            <tr>
              <th>接送地址</th>
              <td><input disabled={this.isDisabled('root.pickUp.startAddress')} placeholder="* 請填寫接送地址" defaultValue={this.state.root3.pickUp.startAddress} onChange={this.handlePickUpChange.bind(this, 'startAddress')}/></td>
            </tr>
            <tr>
              <th>目的區域</th>
              <td>{endZipSelect}</td>
            </tr>
            <tr>
              <th>目地地址</th>
              <td><input disabled={this.isDisabled('root.pickUp.endAddress')} placeholder="* 請填寫目的地址" defaultValue={this.state.root3.pickUp.endAddress} onChange={this.handlePickUpChange.bind(this, 'endAddress')}/></td>
            </tr>
            <tr>
              <th>總人數</th>
              <td>{passengerSelect}</td>
            </tr>
            <tr>
              <th>含輪椅乘客</th>
              <td>{wheelchairSelect}</td>
            </tr>
            <tr>
              <th>車輛</th>
              <td>{detail.companyServiceName || detail.serviceDefName}</td>
            </tr>
            <tr>
              <th colSpan="2" className="costTotal">小計：${root.subtotalPrice}</th>
            </tr>
          </tbody>
        </table>
      </tag>

    )
  };

  generateRoot3StaticView = (root) => {
    root = root || {id:"3"};
    if(!root || !root.details || !root.details.length) {return (
        <h3></h3>
    )}

    return (
      <tag>
        <table className="left">
          <tbody key={"service"}>
            <tr>
              <th>申請明細</th>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th width="100">計劃時間</th>
              <td className="change">{this.getServiceDate(root)}</td>
            </tr>
            <tr>
              <th>接送區域</th>
              <td>{root.pickUp.startZipIsChange ? <span style={{color:'red'}}>{zipsMap[root.pickUp.startZip].name}</span> : zipsMap[root.pickUp.startZip].name }</td>
            </tr>
            <tr>
              <th>接送地址</th>
              <td>{root.pickUp.startAddressIsChange ? <span style={{color:'red'}}>{root.pickUp.startAddress}</span> : root.pickUp.startAddress }</td>
            </tr>
            <tr>
              <th>目的區域</th>
              <td>{ root.pickUp.endZipIsChange ? <span style={{color:'red'}}>{zipsMap[root.pickUp.endZip].name}</span> : zipsMap[root.pickUp.endZip].name }</td>
            </tr>
            <tr>
              <th>目地地址</th>
              <td>{root.pickUp.endAddressIsChange ? <span style={{color:'red'}}>{ root.pickUp.endAddress } </span> : root.pickUp.endAddress }</td>
            </tr>
            <tr>
              <th>總人數</th>
              <td>{root.pickUp.passengerNumIsChange ? <span style={{color:'red'}}>{ root.pickUp.passengerNum}</span>: root.pickUp.passengerNum }</td>
            </tr>
            <tr>
              <th>含輪椅乘客</th>
              <td>{root.pickUp.wheelchairNumIsChange ? <span style={{color:'red'}}>{ root.pickUp.wheelchairNum}</span>: root.pickUp.wheelchairNum }</td>
            </tr>
            <tr>
              <th>車輛</th>
              <td>{root.details[0].companyServiceName || root.details[0].serviceDefName}</td>
            </tr>
            <tr>
              <th colSpan="2" className="costTotal">預估金額：${root.subtotalPrice}</th>
            </tr>
          </tbody>
        </table>
      </tag>

    )
  };

  generateRoot4StaticView = (root) => {
    root = root || {id:"4"};
    if(!root || !root.details || !root.details.length) {return (
        <h3></h3>
      )
    }

    const self = this;
    const desc = this.serviceDesc(root.id);
    const grouped = _.groupBy(root.details, detail => detail.serviceDefName)
    const numberInputStyle = {
      width: 80
    }
    return (

      <tag>
        <table className="left">
          <tbody key={"static_service_1"}>
            <tr>
              <th>申請明細</th>
              <td colSpan="5">&nbsp;</td>
            </tr>
            <tr>
              <th>預約清潔時間</th>
              <td colSpan="5">{this.getServiceDate(root)}</td>
            </tr>
            <tr>
              <th>類別</th>
              <td>名稱</td>
              <td>單位</td>
              <td>單價</td>
              <td>時間</td>
              <td>金額</td>
            </tr>
            {
              Object.getOwnPropertyNames(grouped).map(function(serviceDefName){
                return grouped[serviceDefName].map(function(item, inner_index){
                  return (
                    <tr key={`${inner_index}_${item.serviceDefName}`}>
                      <th>{inner_index == 0 ? serviceDefName : ""}</th>
                      <td>{item.serviceDefName}</td>
                      <td>{item.careMins}</td>
                      <td>{item.price}</td>
                      <td>{item.qtyisChange?<span style={{color:'red'}}>{item.qty}</span>: item.qty}</td>
                      <td>{item.price * item.qty}</td>
                  </tr>)
                })
              })
            }
            <tr>
              <th>清潔坪數</th>
              <td colSpan="5">{root.cleanSize?`${root.cleanSize}0~${parseInt(root.cleanSize)+1}0坪`:'無'}</td>
            </tr>
            <tr>
              <th>清潔用品</th>
              <td colSpan="5">{root.cleanSupply === '1' ? '家中已有慣用用品' :  root.cleanSupply === '2' ? '請清潔服務員準備' : '無'}</td>
            </tr>
            <tr>
              <th>清潔時數</th>
              <td colSpan="5">{root.totalCareMins/60}</td>
            </tr>
            <tr>
              <td colSpan="6" className="costTotal">預估金額：${root.subtotalPrice} 元</td>
            </tr>
          </tbody>
        </table>
      </tag>

    )
  };

  generateRoot4View = (root) => {
    root = root || {id:"4"};
    if(!root || !root.details || !root.details.length) {
      return (

        <tag>

          <FloatingActionButton disabled={this.isDisabled('btnCreateService')} mini={true} secondary={true} onTouchTap={this.openPicker.bind(this,root.id)}>
            <ContentAdd />
          </FloatingActionButton>

          <table className="right">
            <tbody>
                {
                  root.serviceDate && root.details.length > 0?
                  <tr>
                    <th width="100">計畫時間</th>
                    <td className="change">
                      {this.serviceDatePicker(root)}
                      {this.serviceTimePicker(root)}
                    </td>
                  </tr>:
                  <tr>
                    <th></th>
                    <td></td>
                  </tr>
                }
            </tbody>
          </table>

        </tag>
      )
    }

    const self = this;
    const grouped = _.groupBy(root.details, detail => detail.serviceDefName)
    const numberInputStyle = {
      width: 80
    }
    return (
      <tag>

        <RaisedButton label="指派服務" disabled={self.isDisabled('btnCreateService')} secondary={true} onTouchTap={this.openPicker.bind(this,root.id)} />

       <table className="right">
          <tbody key={"service"}>
            <tr>
              <th>服務提供</th>
              <td colSpan="3">{root.companyName}</td>
            </tr>
            <tr>
              <th>計畫時間</th>
              <td colSpan="3" className="change">{this.serviceDatePicker(root)}{this.serviceTimePicker(root)}</td>
            </tr>
            <tr>
              <th>類別</th>
              <td>名稱</td>
              <td>時間</td>
              <td>金額</td>
            </tr>
            {
              Object.getOwnPropertyNames(grouped).map(function(serviceDefName){
                return grouped[serviceDefName].map(function(item, inner_index){
                  return (
                    <tr key={`${inner_index}_${item.serviceDefName}`}>
                      <th>{inner_index == 0 ? serviceDefName : ""}</th>
                      <td>{item.companyServiceName}</td>
                      <td><input disabled={self.isDisabled('root.detail.qty')} type="number" min="1" style={numberInputStyle} onChange={self.handleChangeQty.bind(self, root, item.companyServiceId)} defaultValue={item.qty} /></td>
                      <td>{item.price * item.qty}</td>
                  </tr>)
                })
              })
            }
            <tr>
              <th>清潔坪數</th>
              <td colSpan="3">
                <select style={numberInputStyle} disabled={self.isDisabled('root.cleanSize')} value={root.cleanSize} onChange={self.handleChangeCleanSize.bind(self, root)} defaultValue={root.cleanSize} >
                {[1,2,3,4,5,6,7,8,9].map(S => <option key={`size_${S}`} value={S} >{`${S}0~${S+1}0坪`}</option>) }
                </select>
              </td>
            </tr>
            <tr>
              <th>清潔用品</th>
              <td colSpan="3">
                <select disabled={self.isDisabled('root.cleanSupply')} onChange={self.handleChangeCleanSupply.bind(self, root)} defaultValue={root.cleanSupply || '1'} >
                  <option value={'1'} >家中已有慣用用品</option>
                  <option value={'2'} >請清潔服務員準備</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>清潔時數</th>
              <td colSpan="3">
                <select style={numberInputStyle} disabled={self.isDisabled('root.detail.totalCareMins')} value={root.totalCareMins.toString()} onChange={self.handleChangeTotalCareMins.bind(self, root)} defaultValue={root.totalCareMins.toString()} >
                  {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8].map(hour => <option key={hour} value={hour*60} >{hour}</option>) }
                </select>
              </td>
            </tr>
            <tr>
              <th>鐘點費</th>
              <td colSpan="3">
                <input disabled={self.isDisabled('root.detail.hourPrice')} type="number" min="0" style={numberInputStyle} onChange={self.handleChangeHourPrice.bind(self, root)} defaultValue={60 / root.details[0].careMins * root.details[0].price} />
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="costTotal">小計：${root.subtotalPrice} 元</td>
            </tr>
          </tbody>
        </table>

      </tag>
    )
  };

  generageCareMemberView = careMember => {
    const zipIds = Object.getOwnPropertyNames(zipsMap);
    const checkboxStyle = {float: 'left', width: 'auto', whiteSpace: 'nowrap'};

    let zipSelect = (
    <select disabled={this.isDisabled('careMember')} value={careMember.zipId} onChange={this.handleCareMemberChange.bind(this, 'zipId')}>
      {zipIds.map(zipId => <option key={`careMember_zip_${zipId}`} value={zipId} >{zipsMap[zipId].name}</option> )}
    </select>);

      const disablilityIds = Object.getOwnPropertyNames(disablilitiesMap);
      let disablilitySelect =
        disablilityIds.map(disablilityId => 
          <tag>
          <input type="checkbox" value="" id={`disability_${disablilityId}`} 
              disabled={this.isDisabled('careMember')}
              name={disablilitiesMap[disablilityId].name}
              defaultChecked={careMember.healthStatuses.indexOf(disablilityId) >= 0} 
              onClick={this.handleHealthStatusesCheck.bind(this, disablilityId)} />
          <label htmlFor={`disability_${disablilityId}`} style={(careMember.healthStatusesIsChange && careMember.healthStatusesChangeList.indexOf(disablilityId) >= 0) ? {color:"red"} : null }>{disablilitiesMap[disablilityId].name}</label><br/>
          </tag>
        );
          // <Checkbox disabled={this.isDisabled('careMember')} key={`disability_${disablilityId}`} label={disablilitiesMap[disablilityId].name} defaultChecked={careMember.healthStatuses.indexOf(disablilityId) >= 0} onCheck={this.handleHealthStatusesCheck.bind(this, disablilityId)} />);

      const diseaseIds = Object.getOwnPropertyNames(diseasesMap);
      let diseaseSelect =
        diseaseIds.map(diseaseId => 
          <tag>
          <input type="checkbox" value="" id={`disease_${diseaseId}`} 
              disabled={this.isDisabled('careMember')}
              name={diseasesMap[diseaseId].name} 
              defaultChecked={careMember.healthRecords.indexOf(diseaseId) >= 0} 
              onClick={this.handleHealthRecordsCheck.bind(this, diseaseId)} />
          <label htmlFor={`disease_${diseaseId}`} style={(careMember.healthRecordsIsChange && careMember.healthRecordsChangeList.indexOf(diseaseId) >= 0) ? {color:"red"} : null }>{diseasesMap[diseaseId].name}</label>
        </tag>
      );
          // <Checkbox disabled={this.isDisabled('careMember')} key={`disease_${diseaseId}`} style={checkboxStyle} label={diseasesMap[diseaseId].name} defaultChecked={careMember.healthRecords.indexOf(diseaseId) >= 0} onCheck={this.handleHealthRecordsCheck.bind(this, diseaseId)} />);

    return(
    <tag>

      <table className="right">
        <tbody key={`careMember_${careMember.id}`}>
          <tr>
            <th width="130">被服務者姓名</th>
            <td>{careMember.name}</td>
          </tr>
          <tr>
            <th>性別</th>
            <td>{sexNameMap[careMember.sex]}</td>
          </tr>
          <tr>
            <th>行動電話</th>
            <td>{careMember.cellphone}</td>
          </tr>
          <tr>
            <th>家用電話</th>
            <td><input disabled={this.isDisabled('careMember')} type="number" value={careMember.homeTel} onChange={this.handleCareMemberChange.bind(this, 'homeTel')} /></td>
          </tr>
          <tr>
            <th>被服務者區域</th>
            <td>{zipSelect}</td>
          </tr>
          <tr>
            <th>被服務者地址</th>
            <td><input disabled={this.isDisabled('careMember')} type="text" value={careMember.address} onChange={this.handleCareMemberChange.bind(this, 'address')} /></td>
          </tr>
          <tr>
            <th>身心障礙身份</th>
            <td>{disablilitySelect}</td>
          </tr>
          <tr>
            <th>健康狀況</th>
            <td>{diseaseSelect}</td>
          </tr>
        </tbody>
      </table>

    </tag>
    );
  };

  render() {
    const self = this;
    console.log('set state open > ' + this.state.openServicePicker);
    const {reqOrder, order} = this.props.webOrderDetail;
    const tmpOrder = this.state.tmpOrder;
    const historyNumbers = this.state.historyNumbers;
    // if(!tmpOrder || !tmpOrder.rootServiceCategories) return (<div></div>)
    const applyStatus = reqOrder.applyStatus;

    if(!tmpOrder || !tmpOrder.rootServiceCategories) return (<div></div>);

    let {root_1, root_2, root_3, root_4} = _.groupBy(tmpOrder.rootServiceCategories, root => `root_${root.id}`)
    let {root_r1, root_r2, root_r3, root_r4} = _.groupBy(reqOrder.rootServiceCategories, root => `root_r${root.id}`)

    const opBtnStyle = {margin: 4};
    return (
      <div id="portal">

        <div className="location wrap">首頁 > 訂單 > 照顧經理派案申請單 > 申請單明細</div>

        <div className="content list wrap">

          <div className="title"><h1>申請單明細</h1></div>

          <div className="listBack"><Link to={`${config.webContext}senior/admin/passiveOrders`}>回照顧經理派案申請單列表</Link></div>

          <div className="listTitle">
            {order.paymentStatus === '0'?
            (<div>
               { (this.props.webOrderDetail.order.orderStatus !== '2' && this.props.webOrderDetail.order.orderStatus !=='4') && applyStatus !== '7' ?
                <a href="javascript:void(0);" className="btn-default btn-primary float-right" disabled={this.isDisabled('btnCancel')} onTouchTap={this.confirmOrder} >確認派案</a>
                   :  <a href="javascript:void(0);" className="btn-default btn-disable float-right" disabled={this.isDisabled('btnCancel')}>確認派案</a> }
              {  applyStatus === '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')}>儲存修改</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')} onTouchTap={this.saveTempOrder}>儲存修改</a> }
              {  applyStatus === '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-dark float-right" disabled={this.isDisabled('btnCancel')}>取消申請</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-dark float-right" disabled={this.isDisabled('btnCancel')} onTouchTap={this.handleCancelOrder.bind(this, order.id)}>取消申請</a> }
            </div>) :
            (<div>
              {  applyStatus === '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')}>儲存修改</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')} onTouchTap={this.saveTempOrder}>儲存修改</a> }
            </div>)
            }
            訂單編號：{reqOrder.id}
          </div>

          <div className="listDate">
            <div className="float-right" style={{"line-height":20+"px"}}>
            計畫最後修改時間：{reqOrder.updateDate} {this.isCancel(order.orderStatus)}<br/>
            最後修改時間: {tmpOrder.updateDate}
            </div>
            下單時間：{reqOrder.orderDate}　
            下單者姓名：{order.orderOwnerName}　
            聯絡電話：{order.orderOwnerCellphone}　
            E-mail：{order.orderOwnerEmail}
          </div>
          { order.rejects.length > 0 ?
            <div className="listBox topNote">
              <div className="serviceTTL">不符合原因</div>
              <div className="box">
                <ul> {order.rejects.map((msg, index) => <li key={`reject_${index}`}>{msg}</li>)} </ul>
              </div>
            </div> 
          : <div></div>
          }
          {
            order.payments.length > 0 ? 
              <div className="listBox topNote">
                <div className="serviceTTL">付款明細</div>
                <div className="box">
                  <ul>{order.payments.map((obj,index) => <li key={`payment_${index}`}>付款方式:{obj.paymentType==1?"信用卡":"其它"},回應代碼:{obj.responseCode},回應訊息:{obj.responseMsg},付款時間:{obj._transDate}</li>)} </ul>
                </div>
              </div>
            : <div></div>
          }

          <div className="listBox manager">
            <div className="serviceTTL">照顧服務</div>
            <div className="box">

              {this.generateRoot1StaticView(root_r1 && root_r1[0])}

              {this.generateRoot1View(root_1 && root_1[0])}

              <div style={{clear:"both"}}></div>

            </div>
          </div>

          <div className="listBox manager">
            <div className="serviceTTL">餐食服務</div>
            <div className="box">

              {this.generateRoot2StaticView(root_r2 && root_r2[0])}

              {this.generateRoot2View(root_2 && root_2[0])}

              <div style={{clear:"both"}}></div>

            </div>
          </div>

          <div className="listBox manager">
            <div className="serviceTTL">隨行服務</div>
            <div className="box">

              {this.generateRoot3StaticView(root_r3 && root_r3[0])}

              {this.generateRoot3View(root_3 && root_3[0])}

              <div style={{clear:"both"}}></div>

            </div>
          </div>

          <div className="listBox manager">
            <div className="serviceTTL">家事服務</div>
            <div className="box">

              {this.generateRoot4StaticView(root_r4 && root_r4[0])}

              {this.generateRoot4View(root_4 && root_4[0])}

              <div style={{clear:"both"}}></div>

            </div>
          </div>

          <div className="allCostTotal">總金額：${order.orderStatus === '0' ? reqOrder.totalPrice : tmpOrder.totalPrice} 元</div>

          <div className="listBox manager">
            <div className="serviceTTL">被服務者資料</div>
            <div className="box">

              <table className="left">
                <tbody key={`careMember_${reqOrder.careMember.id}`}>
                  <tr>
                    <th>被服務者姓名</th>
                    <td>{reqOrder.careMember.name}</td>
                  </tr>
                  <tr>
                    <th>性別</th>
                    <td>{sexNameMap[reqOrder.careMember.sex]}</td>
                  </tr>
                  <tr>
                    <th>行動電話</th>
                    <td>{reqOrder.careMember.cellphone}</td>
                  </tr>
                  <tr>
                    <th>家用電話</th>
                    <td>{reqOrder.careMember.homeTelIsChange ? <span style={{color:'red'}}>{reqOrder.careMember.homeTel}</span>:reqOrder.careMember.homeTel}</td>
                  </tr>
                  <tr>
                    <th>被服務者區域</th>
                    <td>{reqOrder.careMember.zipIdIsChange ? <span style={{color:'red'}}>{zipsMap[reqOrder.careMember.zipId].name}</span> : zipsMap[reqOrder.careMember.zipId].name}</td>
                  </tr>
                  <tr>
                    <th>被服務者地址</th>
                    <td>{reqOrder.careMember.addressIsChange ? <span style={{color:'red'}}>{reqOrder.careMember.address}</span>:reqOrder.careMember.address}</td>
                  </tr>
                  <tr>
                    <th>身心障礙身份</th>
                    <td>{reqOrder.careMember.healthStatusesIsChange ? <span style={{color:'red'}}>{reqOrder.careMember.healthStatuses.map(id => disablilitiesMap[id].name).join('、')}</span> : reqOrder.careMember.healthStatuses.map(id => disablilitiesMap[id].name).join('、') }</td>
                  </tr>
                  <tr>
                    <th>健康狀況</th>
                    <td>{reqOrder.careMember.healthRecordsIsChange ? <span style={{color:'red'}}>{reqOrder.careMember.healthRecords.map(id => diseasesMap[id].name).join('、')}</span> : reqOrder.careMember.healthRecords.map(id => diseasesMap[id].name).join('、')}</td>
                  </tr>
                </tbody>
              </table>

              {this.generageCareMemberView(tmpOrder.careMember)}

            </div>
          </div>

          <div className="listBox manager">
            <div className="serviceTTL">訂單備註</div>
            <div className="box note">

              <table className="left">
                <tr>
                  <th>申請明細</th>
                </tr>
                <tr>
                  <th>{reqOrder.remarkIsChange? <span style={{color:'red'}}>{reqOrder.remark === undefined ? "無" : reqOrder.remark}</span>:reqOrder.remark === undefined ? "無" : reqOrder.remark }</th>
                </tr>
              </table>

              <table className="right">
                <tr>
                  <th>&nbsp;</th>
                </tr>
                <tr>
                  <th className="change">
                    <textarea disabled={this.isDisabled('remark')} value={tmpOrder.remark} onChange={this.handleRemarkChange} style={{width:510+"px",height:100+"px"}} />
                  </th>
                </tr>
              </table>

            </div>
          </div>

          <div className="listBox">
            <div className="serviceTTL">修改紀錄</div>
            <div className="box">
                {
                  reqOrder.history.map(function(historyTemp, index){

                    if (index < historyNumbers - 1 ) {
                    return (
                                <div className="historyList">
                                  <h3>{historyTemp.createDate} {historyTemp.updateMemberName}</h3>
                                  <div className="old"><Link to={`${config.webContext}senior/admin/order/${reqOrder.id}/history/passive/${index}`}>與前筆資料差異</Link></div>
                                  <div className="new"> </div>
                                </div>
                           )
                    }
                    /*
                    else {
                      return (
                      <div className="historyList">
                      <h3>{historyTemp.createDate} {historyTemp.updateMemberName}</h3>
                      </div>
                      )
                    }*/
                  })
                }
            </div>
          </div>

          <div className="listTitle">
            {order.paymentStatus === '0'?
            (<div>
              { (this.props.webOrderDetail.order.orderStatus !== '2' && this.props.webOrderDetail.order.orderStatus !=='4') && applyStatus !== '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-primary float-right" disabled={this.isDisabled('btnCancel')} onTouchTap={this.confirmOrder} >確認派案</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-disable float-right" disabled={this.isDisabled('btnCancel')}>確認派案</a> }
              {  applyStatus === '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')}>儲存修改</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')} onTouchTap={this.saveTempOrder}>儲存修改</a> }
              {  applyStatus === '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-dark float-right" disabled={this.isDisabled('btnCancel')}>取消申請</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-dark float-right" disabled={this.isDisabled('btnCancel')} onTouchTap={this.handleCancelOrder.bind(this, order.id)}>取消申請</a> }
            </div>) :
            (<div>
              {  applyStatus === '7' ?
                  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')}>儲存修改</a>
                  :  <a href="javascript:void(0);" className="btn-default btn-warning float-right" disabled={this.isDisabled('btnSaveTmp')} onTouchTap={this.saveTempOrder}>儲存修改</a> }
            </div>)
            }
          </div>

          {this.props.assignment.companyCandidates?
          <CompanyServicePicker open={this.state.openServicePicker} onConfirm={this.handleCompanyServicesPicked.bind(this)} companyCandidates={this.props.assignment.companyCandidates} onRequestClose={this.closeServicePicker} 
            rootServiceCategory={this.state.tmpOrder.rootServiceCategories.find(root => root.id === this.props.assignment.rootCategoryId) || {id:this.props.assignment.rootCategoryId, details:[]}}
            careManager={this.props.auth.careManager}
            reqRootServiceCategory={this.props.webOrderDetail.reqOrder.rootServiceCategories.find(root => root.id === this.props.assignment.rootCategoryId) || {id:this.props.assignment.rootCategoryId, details:[]}} />
          :''}

          <Snackbar open={this.state.snackbarOpen} message={this.state.snackMessage} autoHideDuration={1000} onRequestClose={() => this.setState({snackbarOpen:false})}/>
        </div>
      </div>
    )
  }
}

export default connect(state => ({webOrderDetail: state.senior.webOrderDetail, assignment: state.senior.assignment}), {...OrderActions})(PositiveOrderDetail)