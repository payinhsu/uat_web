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
import {caculateOrder} from 'lib/OrderUtil';
import moment from 'moment';
import {requireAuth} from 'auth';
import $ from 'jquery'
var config = require('config-prod');

import {carSpecMap, applyStatusMap, sexNameMap, zipsMap, diseasesMap, disablilitiesMap} from 'mapping';


class ActiveOrderDetail extends Component {

  constructor(props) {
    super(props);
    props.senior.query.type = ActiveOrderDetail.orderType;
    this.state = {
      orderDetail: props.orderDetail,
      historyNumbers: props.orderDetail.historyNumbers,
      snackbarOpen: false,
      snackMessage: ''
    };

    /** 隨行管家初始化 */
    const root3 = props.orderDetail.rootServiceCategories.find(root => root.id === '3');
    if(root3) this.state.root3 = root3;
  }

  static orderType = 'I';
  
  static needs = [
    OrderActions.getOrderDetailFromPath
  ];

  /** fields edit control **/
  isDisabled = (field) => {
      const editableFields = [
        'btnCancel'
      ];
      const order = this.props.orderDetail;
      if(order.orderStatus === '9'){  // || order.paymentStatus !== '0' disabled={this.isDisabled('careMember')}  
          return true ;
      } else {
          return false ;
      }
  }

  static onEnter(store){
    return (nextState, replace, callback) => {
      new api(store.getState().auth).getOrderDetail(nextState.params.orderId).then( orderDetail => {
        store.dispatch(OrderActions.receiveOrderDetail(orderDetail));
        callback();
      });
    }
  }

  componentDidMount() {
  	console.log("do did mount") ;
    $(".gototop a").click(function()
    {
      $('html,body').animate({scrollTop: 0}, 500);
    });
  };

  handleCareMemberChange = (field, e) => {
    this.state.orderDetail.careMember[field] = e.target.value;
    this.setState({orderDetail: this.state.orderDetail});
  };

  handleRemarkChange = (e) => {
    this.state.orderDetail.remark = e.target.value;
    this.setState({orderDetail: this.state.orderDetail});
  }

  showTip = (message) => {
    this.setState({snackbarOpen:true, snackMessage:message});
  };

  saveOrder = () => {
    this.showTip('確認變更中 ..');
    this.props.updateActiveOrder(this.state.orderDetail);
  };

  handleHealthStatusesCheck = (disablilityId, e) => {
    let healthStatuses = this.state.orderDetail.careMember.healthStatuses;
    const checked = e.target.checked;
    if(checked)
      healthStatuses.push(disablilityId);
    else
      healthStatuses.splice(healthStatuses.indexOf(disablilityId), 1);
    this.setState({orderDetail: this.state.orderDetail});
    console.log(this.state.orderDetail.careMember.healthStatuses);
  };

  handleHealthRecordsCheck = (diseaseId, e) => {
    let healthRecords = this.state.orderDetail.careMember.healthRecords;
    const checked = e.target.checked;
    if(checked)
      healthRecords.push(diseaseId);
    else
      healthRecords.splice(healthRecords.indexOf(diseaseId), 1);
    this.setState({orderDetail: this.state.orderDetail});
    console.log(this.state.orderDetail.careMember.healthRecords);
  };

  handleCancelOrder = (orderId) => {
      this.showTip('取消中 ..');
      if(confirm("確定取消此筆訂單？")){
          this.props.cancelOrder(orderId);
      }
  }

  handleServiceDateChange = (rootCategory, e, date) => {
    const newServiceDateStr = moment(date).format("YYYY-MM-DD") + ' ' + moment(rootCategory.serviceDate).format('HH:mm:ss');
    // console.log( moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf() ) ;
    // rootCategory.serviceDate = newServiceDateStr;
    rootCategory.serviceDate = moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf()
    this.setState({orderDetail: this.state.orderDetail});
  };

  handleServiceTimeChange = (rootCategory, err, time) => {
    const newServiceDateStr = moment(rootCategory.serviceDate).format("YYYY-MM-DD") + ' ' + moment(time).format('HH:mm') + ':00';
    // console.log( moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf() ) ;
    // rootCategory.serviceDate = newServiceDateStr;
    rootCategory.serviceDate = moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf()
    this.setState({orderDetail: this.state.orderDetail});
  };

  handleServiceTimeHHChange = (rootCategory, e ) => {
    //console.log(e.target.value);
    const newServiceDateStr = moment(rootCategory.serviceDate).format("YYYY-MM-DD") + ' ' + e.target.value+ ':' + moment(rootCategory.serviceDate).format("mm") + ':00';
    //console.log( newServiceDateStr ) ;
    //console.log( moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf() ) ;
    // rootCategory.serviceDate = newServiceDateStr;
    rootCategory._serviceDate = newServiceDateStr ;
    rootCategory.serviceDate = moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf() ;
    this.setState({orderDetail: this.state.orderDetail});
  };

  handleServiceTimeMIChange = (rootCategory, e ) => {
    //console.log(e.target.value) ;
    const newServiceDateStr = moment(rootCategory.serviceDate).format("YYYY-MM-DD") + ' ' + moment(rootCategory.serviceDate).format("HH") + ':' + e.target.value + ':00';
    //console.log( newServiceDateStr ) ;
    //console.log( moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf() ) ;
    // rootCategory.serviceDate = newServiceDateStr;
    rootCategory._serviceDate = newServiceDateStr ;
    rootCategory.serviceDate = moment(newServiceDateStr, "YYYY-MM-DD HH:mm:ss").valueOf()
    this.setState({orderDetail: this.state.orderDetail});
  };

  handlePickUpChange = (pickUpField, e) => {
    // this.props.cacheTmpOrder(this.state.tmpOrder);
    let pickUp = this.state.root3.pickUp;

    let value = pickUpField === 'passengerNum' || pickUpField === 'wheelchairNum' ? parseInt(e.target.value) : e.target.value;

    // reset wheelchairNum
    if(pickUpField === 'passengerNum') pickUp.wheelchairNum = 0;

    pickUp[pickUpField] = value;
    this.setState({root3: this.state.root3});
    // const serviceId = this.state.root3.details[0].companyServiceId;
    // this.props.getFarePrice(this.state.tmpOrder.id, serviceId, pickUp.startZip, pickUp.endZip);
  };

  serviceDatePicker = (rootCategory, isUpdate) => {
    const style = {width: 150};
    const style2 = {color:'red'};
    const serviceDate = moment(rootCategory.serviceDate).toDate();
    if(isUpdate) {
        // console.log('isUpdate ' + isUpdate)
        return <DatePicker id={`root_${rootCategory.id}_service_date`} disabled={this.isDisabled('root.serviceDate')} style={style} inputStyle={style2} value={serviceDate} onChange={this.handleServiceDateChange.bind(this, rootCategory)} />
    } else {
        return <DatePicker id={`root_${rootCategory.id}_service_date`} disabled={this.isDisabled('root.serviceDate')} style={style} value={serviceDate} onChange={this.handleServiceDateChange.bind(this, rootCategory)} />
    }
    
    
  };

  serviceTimePicker = (rootCategory, isUpdate) => {
    const style = {width: 100};
    const style2 = {color:'red'};
    const serviceDate = moment(rootCategory.serviceDate).toDate();
    if(isUpdate) {
        // console.log('isUpdate ' + isUpdate)
        return <TimePicker id={`root_${rootCategory.id}_service_time`} disabled={this.isDisabled('root.serviceDate')} style={style} inputStyle={style2} value={serviceDate} format="24hr"hintText="服務時間"onChange={this.handleServiceTimeChange.bind(this, rootCategory)} />;
    } else {
        return <TimePicker id={`root_${rootCategory.id}_service_time`} disabled={this.isDisabled('root.serviceDate')} style={style} value={serviceDate} format="24hr"hintText="服務時間"onChange={this.handleServiceTimeChange.bind(this, rootCategory)} />;
    }
    
  };

  isCancel = (orderStatus) => {
      console.log('orderStatus : ' + orderStatus) ;
      const style = {color: 'red'};
      if(orderStatus === '9'){
          console.log(orderStatus) ;
          return (<span style={style}> (訂單取消) </span>);
      } 
  } ;

  getStartAddress = (root) => {
      const style = {color: 'red'};
      if(root.pickUp.startAddressIsChange) {
          return (<input disabled={this.isDisabled('root.pickUp.startAddress')} style={style} placeholder="* 請填寫接送地址" defaultValue={this.state.root3.pickUp.startAddress} onChange={this.handlePickUpChange.bind(this, 'startAddress')}/>) ;
      } else {
          return (<input disabled={this.isDisabled('root.pickUp.startAddress')} placeholder="* 請填寫接送地址" defaultValue={this.state.root3.pickUp.startAddress} onChange={this.handlePickUpChange.bind(this, 'startAddress')}/>) ;
      }
  } ;
  
  getEndAddress = (root) => {
      const style = {color: 'red'};
      if(root.pickUp.endAddressIsChange) {
          return (<input disabled={this.isDisabled('root.pickUp.endAddress')} style={style} placeholder="* 請填寫目的地址" defaultValue={this.state.root3.pickUp.endAddress} onChange={this.handlePickUpChange.bind(this, 'endAddress')}/>) ;
      } else {
          return (<input disabled={this.isDisabled('root.pickUp.endAddress')} placeholder="* 請填寫目的地址" defaultValue={this.state.root3.pickUp.endAddress} onChange={this.handlePickUpChange.bind(this, 'endAddress')}/>) ;
      }
  } ;

  timeSelect =(from, end, step, value, onChange, isUpdate) => {
    const style = {width: 100};
    const style2 = {color:'red'};
    var options = [];
    // const from=8, end=18;
    for(var num=from; num<=end; num+=step){
      options.push(<option value={_.padStart(num,2,'0')} key={num}>{_.padStart(num,2,'0')}</option>);
    }
    return <select value={value} onChange={onChange} style={isUpdate? style2: null} disabled={this.isDisabled('root.serviceDate')}> {options} </select> ;
  }


  generateRoot1View = (root) => {
    root = root || {id:"1"};
    if(!root || !root.details || !root.details.length) {return (
        <div></div>
      )
    }

    const self = this;
    const desc = this.serviceDesc(root.id);
    const grouped = _.groupBy(root.details, detail => detail.categoryName)
    const numberInputStyle = {
      width: 80
    }
    return (

      <div className="listBox">
        <div className="serviceTTL">照顧服務 ({root.companyName})</div>
        <div className="box">
          <table>
            <tbody key={"service"}>
              <tr>
                <th>預約照顧時間</th>
                <td>
                <table>
                  <tr>
                    <td>{this.serviceDatePicker(root,root.dateIsChange)}</td>
                    <td>
                      {this.timeSelect(8, 17, 1, root._serviceDate.split(' ')[1].split(':')[0], this.handleServiceTimeHHChange.bind(this, root), root.timeIsChange)} 時
                      {this.timeSelect(0, 59, 10, root._serviceDate.split(' ')[1].split(':')[1], this.handleServiceTimeMIChange.bind(this, root), root.timeIsChange)} 分
                    </td>
                  </tr>
                </table>
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th className="subTTL">項目類別</th>
                <th className="subTTL">項目名稱</th>
                <th className="subTTL">時間</th>
                <th className="subTTL">單價</th>
                <th className="subTTL">金額</th>
              </tr>
              {
                Object.getOwnPropertyNames(grouped).map(function(categoryName){
                  return grouped[categoryName].map(function(categoryItem, inner_index){
                    return (
                      <tr key={`${inner_index}_${categoryItem.categoryName}`}>
                        <th>{inner_index == 0 ? categoryName : ""}</th>
                        <td>{categoryItem.serviceDefName}</td>
                        <td className="time">{categoryItem.careMins} 分鐘</td>
                        <td className="cost">{categoryItem.price} 元</td>
                        <td className="cost">{categoryItem.price * categoryItem.qty} 元</td>
                    </tr>)
                  })
                })
              }
            </tbody>
          </table>
        </div>
        <div className="costTotal">小計 ${root.subtotalPrice} 元</div>
      </div>

    )
  };

  generateRoot2View = (root) => {
    root = root || {id:"2"};
    if(!root || !root.details || !root.details.length) {return (
        <div></div>
      )
    }
    const self = this;

    const numberInputStyle = {
      width: 80
    }
    return (

      <div className="listBox">
        <div className="serviceTTL">餐食服務 ({root.companyName})</div>
        <div className="box">
          <table>
            <tbody key={"service"}>
              <tr>
                <th>預約送餐時間</th>
                <td>
                  <table>
                    <tr>
                      <td>{this.serviceDatePicker(root,root.dateIsChange)}</td>
                      <td>
                        {this.timeSelect(8, 17, 1, root._serviceDate.split(' ')[1].split(':')[0], this.handleServiceTimeHHChange.bind(this, root), root.timeIsChange)} 時
                        {this.timeSelect(0, 59, 10, root._serviceDate.split(' ')[1].split(':')[1], this.handleServiceTimeMIChange.bind(this, root), root.timeIsChange)} 分
                      </td>
                    </tr>
                  </table>
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th className="subTTL"></th>
                <th className="subTTL">餐食內容</th>
                <th className="subTTL">單價</th>
                <th className="subTTL">數量</th>
                <th className="subTTL">金額</th>
              </tr>
              {
                root.details.map(function(detail, index){
                  return (
                    <tr key={`root2_item_${index}`}>
                      <th>餐食內容</th>
                      <td>{`${detail.companyServiceName}(${detail.calorie}卡)`}</td>
                      <td className="cost">{detail.price}</td>
                      <td className="time">{detail.qty}</td>
                      <td className="cost">{detail.price * detail.qty}</td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
        <div className="costTotal">小計 ${root.subtotalPrice} 元</div>
      </div>

    )
  };


  generateRoot3View = (root) => {
    root = root || {id:"3"};
    if(!root || !root.details || !root.details.length) {return (
        <div></div>
      )
    }

    const self = this;
    const detail = root.details[0];

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
        <select disabled={this.isDisabled('root.pickUp.passengerNum')} style={root.pickUp.passengerNumIsChange? {color:'red'}:null } value={this.state.root3.pickUp.passengerNum} onChange={this.handlePickUpChange.bind(this, 'passengerNum')} >
          {passengers.map(num => <option key={`pessenger_opt_${num}`} value={num} >{num}</option>)}
        </select>

    );

    let wheelchairSelect = (
    <select disabled={this.isDisabled('root.pickUp.wheelchairNum')} style={root.pickUp.wheelchairNumIsChange? {color:'red'}:null } value={this.state.root3.pickUp.wheelchairNum} onChange={this.handlePickUpChange.bind(this, 'wheelchairNum')} >
      {wheelchairs.map(num => <option key={`wheelchair_opt_${num}`} value={num} >{num}</option>)}
    </select>);

    return (

      <div className="listBox">
        <div className="serviceTTL">隨行服務 ({root.companyName})</div>
        <div className="box">
          <table>
            <tbody key={"service"}>
              <tr>
                <th>預約接送時間</th>
                <td>
                  <table>
                    <tr>
                      <td>{this.serviceDatePicker(root,root.dateIsChange)}</td>
                      <td>
                        {this.timeSelect(8, 17, 1, root._serviceDate.split(' ')[1].split(':')[0], this.handleServiceTimeHHChange.bind(this, root), root.timeIsChange)} 時
                        {this.timeSelect(0, 59, 10, root._serviceDate.split(' ')[1].split(':')[1], this.handleServiceTimeMIChange.bind(this, root), root.timeIsChange)} 分
                      </td>
                    </tr>
                  </table>
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th>接送區域</th>
                <td>{zipsMap[root.pickUp.startZip].name}</td>
              </tr>
              <tr>
                <th>接送地址</th>
                <td>{this.getStartAddress(root)}</td>
              </tr>
              <tr>
                <th>目的區域</th>
                <td>{zipsMap[root.pickUp.endZip].name}</td>
              </tr>
              <tr>
                <th>目的地址</th>
                <td>{this.getEndAddress(root)}</td>
              </tr>
              <tr>
                <th>車輛種類</th>
                <td>{detail.companyServiceName || detail.serviceDefName}</td>
              </tr>
              <tr>
                <th>總人數</th>
                <td>{passengerSelect}</td>
              </tr>
              <tr>
                <th>含輪椅乘客</th>
                <td>{wheelchairSelect}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="costTotal">試算金額 ${root.subtotalPrice} 元</div>
      </div>

    )
  };

  generateRoot4View = (root) => {
    root = root || {id:"4"};
    if(!root || !root.details || !root.details.length) {return (
        <div></div>
      )
    }

    const self = this;
    const grouped = _.groupBy(root.details, detail => detail.serviceDefName)
    const numberInputStyle = {
      width: 80
    }
    return (

      <div className="listBox">
        <div className="serviceTTL">家事服務 ({root.companyName})</div>
        <div className="box">
          <table>
            <tbody key={"service"}>
              <tr>
                <th>預約清潔時間</th>
                <td>
                  <table>
                    <tr>
                      <td>{this.serviceDatePicker(root,root.dateIsChange)}</td>
                      <td>
                        {this.timeSelect(8, 17, 1, root._serviceDate.split(' ')[1].split(':')[0], this.handleServiceTimeHHChange.bind(this, root), root.timeIsChange)} 時
                        {this.timeSelect(0, 59, 10, root._serviceDate.split(' ')[1].split(':')[1], this.handleServiceTimeMIChange.bind(this, root), root.timeIsChange)} 分
                      </td>
                    </tr>
                  </table> 
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th className="subTTL">項目類別</th>
                <th className="subTTL">項目名稱</th>
                <th className="subTTL">單位時間</th>
                <th className="subTTL">數量(間/件)</th>
              </tr>
              {
                Object.getOwnPropertyNames(grouped).map(function(serviceDefName){
                  return grouped[serviceDefName].map(function(item, inner_index){
                    return (
                      <tr key={`${inner_index}_${item.serviceDefName}`}>
                        <th>{inner_index == 0 ? serviceDefName : ""}</th>
                        <td>{item.companyServiceName}</td>
                        <td>{item.careMins}</td>
                        <td>{item.qtyIschange? <span style={{color:'red'}}>{item.qty}</span>:item.qty }</td>
                    </tr>)
                  })
                })
              }
              <tr>
                <th>清潔坪數</th>
                <td>{root.cleanSize?`${root.cleanSize}0~${parseInt(root.cleanSize)+1}0坪`:'無'}</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th>清潔用品</th>
                <td>{root.cleanSupply === '1' ? '家中已有慣用用品' :  root.cleanSupply === '2' ? '請清潔服務員準備' : '無'}</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th>清潔時數</th>
                <td>{root.totalCareMins/60}</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="costTotal">小計 ${root.subtotalPrice} 元</div>
      </div>

    )
  };
  
  generageCareMemberView = careMember => {
    const zipIds = Object.getOwnPropertyNames(zipsMap);
    const checkboxStyle = {float: 'left', width: 'auto', whiteSpace: 'nowrap'};

    // , 
    // , 
    let zipSelect = (
    <select disabled={this.isDisabled('careMember')} style={careMember.zipIdIsChange? {color:'red'}:null } value={careMember.zipId} onChange={this.handleCareMemberChange.bind(this, 'zipId')}>
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
        //<Checkbox disabled={this.isDisabled('careMember')} 
        //          key={`disability_${disablilityId}`} 
        //          style={checkboxStyle} 
        //          labelStyle={(careMember.healthStatusesIsChange && careMember.healthStatusesChangeList.indexOf(disablilityId) >= 0) ? {color:'red'}:null} 
        //          label={disablilitiesMap[disablilityId].name} 
        //          defaultChecked={careMember.healthStatuses.indexOf(disablilityId) >= 0} 
        //          onCheck={this.handleHealthStatusesCheck.bind(this, disablilityId)} />);

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
        //<Checkbox disabled={this.isDisabled('careMember')} 
        //          key={`disease_${diseaseId}`}
        //          style={checkboxStyle} 
        //          labelStyle={(careMember.healthRecordsIsChange && careMember.healthRecordsChangeList.indexOf(diseaseId) >= 0) ? {color:'red'}:null} 
        //          label={diseasesMap[diseaseId].name} 
        //          defaultChecked={careMember.healthRecords.indexOf(diseaseId) >= 0} 
        //          onCheck={this.handleHealthRecordsCheck.bind(this, diseaseId)} />);

    return(

      <div className="listBox">
        <div className="serviceTTL">被服務者資料</div>
        <div className="box">
          <table>
            <tbody key={`careMember_${careMember.id}`}>
              <tr>
                <th width="200">被服務者姓名</th>
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
                <td><input disabled={this.isDisabled('careMember')} type="number" style={careMember.homeTelIsChange? {color:'red'}:null } value={careMember.homeTel} onChange={this.handleCareMemberChange.bind(this, 'homeTel')} /></td>
              </tr>
              <tr>
                <th>被服務者區域</th>
                <td>{zipSelect}</td>
              </tr>
              <tr>
                <th>被服務者地址</th>
                <td><input disabled={this.isDisabled('careMember')} type="text" style={careMember.addressIsChange? {color:'red'}:null } value={careMember.address} onChange={this.handleCareMemberChange.bind(this, 'address')} style={{width:280+"px"}}/></td>
              </tr>
              <tr>
                <th>身心障礙身份</th>
                <td>{disablilitySelect}</td>
              </tr>
              <tr>
                <th>健康狀況</th>
                <td><div className="healthstatus">{diseaseSelect}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    );
  };


  componentWillReceiveProps = newProps => {

    if(this.props.orderDetail != newProps.orderDetail){
      // set state for root3 (if the original details is empty, some states will be empty.)
      const root3 = newProps.orderDetail.rootServiceCategories.find(root => root.id === '3');
      this.setState({
        orderDetail: newProps.orderDetail,
        root3: root3
      });
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

  serviceDesc = (rootServiceId) => {
    switch(rootServiceId){
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
  };

  render() {
    const self = this;
    const orderDetail = this.state.orderDetail;
    const historyNumbers = this.state.historyNumbers;

    var {root_1, root_2, root_3, root_4} = _.groupBy(orderDetail.rootServiceCategories, root => `root_${root.id}`)

    const opBtnStyle = {margin: 4};

    if(!orderDetail || !orderDetail.rootServiceCategories) return (<div></div>);

    return(
      <div id="portal">

        <div className="location wrap">首頁 > 訂單 > 主動預約訂單 > 訂單明細</div>

        <div className="content list wrap">

          <div className="title"><h1>訂單明細</h1></div>

          <div className="listBack"><Link to={`${config.webContext}senior/admin/activeOrders`}>回主動預約訂單</Link></div>

          <ul>{orderDetail.payments.map((obj,index) => <li key={`payment_${index}`}>付款方式:{obj.paymentType==1?"信用卡":"其它"},回應代碼:{obj.responseCode},回應訊息:{obj.responseMsg},付款時間:{obj._transDate}</li>)} </ul>

          <div className="listTitle">
            <a href="javascript:alert('儲存成功！');" className="btn-default btn-warning float-right" onTouchTap={this.saveOrder}>儲存修改</a>
            <a href="javascript:void(0);" className="btn-default btn-dark float-right" onTouchTap={this.handleCancelOrder.bind(this, orderDetail.id)}>取消訂單</a>
            訂單編號：{orderDetail.id} 　服務提供者：{orderDetail.rootServiceCategories[0].companyName} 
          </div>

          <div className="listDate">
            下單時間：{orderDetail._orderDate}　
            下單者姓名：{orderDetail.orderOwnerName}　
            聯絡電話：{orderDetail.orderOwnerCellphone}　
            E-mail：{orderDetail.orderOwnerEmail}　
            最後修改時間：{orderDetail._updateDate} {this.isCancel(orderDetail.orderStatus)}
          </div>


          {this.generateRoot1View(root_1 && root_1[0])}

          {this.generateRoot2View(root_2 && root_2[0])}

          {this.generateRoot3View(root_3 && root_3[0])}

          {this.generateRoot4View(root_4 && root_4[0])}

          <div className="allCostTotal">總金額：${orderDetail.totalPrice} 元</div>

          {this.generageCareMemberView(orderDetail.careMember)}

          <div className="listBox">
            <div className="serviceTTL">訂單備註</div>
            <div className="box note">
              <textarea value={orderDetail.remark} inputStyle={ orderDetail.remarkIsChange?{color:'red'}:null } style={{width:100+'%',height:100+'px'}} onChange={this.handleRemarkChange} />
            </div>
          </div>

          <div className="listBox">
            <div className="serviceTTL">修改紀錄</div>
            <div className="box">

              {
                orderDetail.history.map(function(historyTemp, index){
                  if (index < historyNumbers - 1) {
                    return (
                        <div className="historyList">
                          <h3>{historyTemp.createDate} {historyTemp.updateMemberName}</h3>
                          <div className="old"><Link to={`${config.webContext}senior/admin/order/${orderDetail.id}/history/active/${index}`}>與前筆資料差異</Link></div>
                          <div className="new"> </div>
                        </div>
                    )
                  } /*
                  else {
                    return (
                        <div className="historyList">
                          <h3>{historyTemp.updateDate} {historyTemp.updateMemberName}</h3>
                        </div>
                    )
                  } */
                })
              }

            </div>
          </div>

          <Snackbar open={this.state.snackbarOpen} message={this.state.snackMessage} autoHideDuration={1000} onRequestClose={() => this.setState({snackbarOpen:false})} />
      </div>
    </div>
  	)
  }
}

export default connect(state => ({ orderDetail: state.senior.selectedOrderDetail }), {...OrderActions})(ActiveOrderDetail)
