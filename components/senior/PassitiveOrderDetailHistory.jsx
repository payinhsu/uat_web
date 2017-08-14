import React, { Component , PropTypes }   from 'react';
import { connect }            from 'react-redux';
import * as OrderActions       from 'actions/senior/OrderActions';
import {Link} from 'react-router';
import _ from 'lodash';
import api from 'api/SeniorAPI';
import {sexNameMap, zipsMap, diseasesMap, disablilitiesMap} from 'mapping';

var config = require('config-prod');


class PassitiveOrderDetailHistory extends Component {

    constructor(props) {
        super(props);
        props.senior.query.type = PassitiveOrderDetailHistory.orderType;
        this.state = {
            rootCategoryId: undefined,
            oldOrderHistory: props.historys.oldOrderHistory,
            latestOrderHistory: props.historys.latestOrderHistory,
            historyNumbers: props.historys.historyNumbers,
            historyIndex: props.params.index
        };
    }

    static orderType = 'P';

    static onEnter(store){
        return (nextState, replace, callback) => {
            new api(store.getState().auth).getDifferentHistoryOrders(nextState.params.orderId,nextState.params.index).then(historys => {
                store.dispatch(OrderActions.receiveDiffHistory(nextState.params.orderId,historys));
                callback();
            });
        }

    }

    componentDidMount() {
        $('html,body').animate({scrollTop: 0}, 500);
    } ;

    render() {
        const oldOrderHistory = this.state.oldOrderHistory;
        const latestOrderHistory = this.state.latestOrderHistory;
        const historyIndex = this.state.historyIndex;
        const historyNumbers = this.state.historyNumbers;

        if(!oldOrderHistory || !oldOrderHistory.rootServiceCategories) return (<div></div>);

        let {current_root_1, current_root_2, current_root_3, current_root_4} = _.groupBy(oldOrderHistory.rootServiceCategories, root => `current_root_${root.id}`)
        let {last_root_1, last_root_2, last_root_3, last_root_4} = _.groupBy(latestOrderHistory.rootServiceCategories, root => `last_root_${root.id}`)

        return (
            <div id="portal">

                <div className="location wrap">首頁 > 訂單 > 照顧經理派案申請單 > 申請單明細 > 修改紀錄比較</div>

                <div className="content list wrap">

                    <div className="title"><h1>修改紀錄訂單明細</h1></div>

                    <div className="listBack"><Link to={`${config.webContext}senior/admin/order/${oldOrderHistory.id}/passive`}>回申請單明細</Link></div>

                    <div className="listTitle">
                        訂單編號：{oldOrderHistory.id}
                    </div>

                    <div className="listDate">
                        計畫最後修改時間：{oldOrderHistory.updateDate} {oldOrderHistory.orderStatus}<br/>
                        下單時間：{oldOrderHistory.orderDate}<br/>
                        下單者姓名：{oldOrderHistory.orderOwnerName}<br/>
                        聯絡電話：{oldOrderHistory.orderOwnerCellphone}<br/>
                        E-mail：{oldOrderHistory.orderOwnerEmail}
                    </div>
                    {
                        oldOrderHistory.rejects.length > 0 ?
                            <div className="listBox topNote">
                                <div className="serviceTTL">不符合原因</div>
                                <div className="box">
                                    <ul> {oldOrderHistory.rejects.map((msg, index) => <li key={`reject_${index}`}>{msg}</li>)} </ul>
                                </div>
                            </div>
                            : <div></div>
                    }

                    <div className="listBox manager">
                        <div className="serviceTTL">照顧服務</div>
                        <div className="box">
                            <tag>
                                <table className="left">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯前訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td><span className="icon1">企</span>{(!(current_root_1 && current_root_1[0] || {id:"1"}) || !(current_root_1 && current_root_1[0] || {id:"1"}).details || !(current_root_1 && current_root_1[0] || {id:"1"}).details.length) ? '' : ((current_root_1 && current_root_1[0] || {id:"1"}).companyNameIsChange ? <span style={{color:'red'}}>{(current_root_1 && current_root_1[0] || {id:"1"}).companyName}</span>:(current_root_1 && current_root_1[0] || {id:"1"}).companyName)}</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <th width="100">計劃時間</th>
                                        <td colSpan="4">
                                            {(!(current_root_1 && current_root_1[0] || {id:"1"}) || !(current_root_1 && current_root_1[0] || {id:"1"}).details || !(current_root_1 && current_root_1[0] || {id:"1"}).details.length) ? '' : (current_root_1 && current_root_1[0] || {id:"1"}).dateIsChange ? <span style={{color:'red'}}>{(current_root_1 && current_root_1[0] || {id:"1"}).serviceDate}</span>:(current_root_1 && current_root_1[0] || {id:"1"}).serviceDate}
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
                                        (!(current_root_1 && current_root_1[0] || {id:"1"}) || !(current_root_1 && current_root_1[0] || {id:"1"}).details || !(current_root_1 && current_root_1[0] || {id:"1"}).details.length) ?
                                            <div></div>
                                            :
                                            Object.getOwnPropertyNames(_.groupBy((current_root_1 && current_root_1[0] || {id:"1"}).details, detail => detail.categoryName)).map(function(categoryName){
                                                return _.groupBy((current_root_1 && current_root_1[0] || {id:"1"}).details, detail => detail.categoryName)[categoryName].map(function(categoryItem, inner_index){
                                                    return (
                                                        <tr key={`${inner_index}_${categoryItem.categoryName}`}>
                                                            <td>{inner_index == 0 ? categoryName : ""}</td>
                                                            <td>{!categoryItem.companyServiceName ? categoryItem.serviceDefName : categoryItem.companyServiceName}</td>
                                                            <td className="time">{categoryItem.careMinsIsChange ? <span style={{color:'red'}}>{categoryItem.careMins}</span>:categoryItem.careMins} 分鐘</td>
                                                            <td className="cost">{categoryItem.priceIsChange ? <span style={{color:'red'}}>{categoryItem.price}</span>:categoryItem.price}</td>
                                                            <td className="cost">{categoryItem.priceMutipleQtyIsChange ? <span style={{color:'red'}}>{categoryItem.price * categoryItem.qty}</span>:(categoryItem.price * categoryItem.qty)} 元</td>
                                                        </tr>)
                                                })
                                            })
                                    }
                                    <tr>
                                        <th colSpan="5" className="costTotal text-right">小計：${(!(current_root_1 && current_root_1[0] || {id:"1"}) || !(current_root_1 && current_root_1[0] || {id:"1"}).details || !(current_root_1 && current_root_1[0] || {id:"1"}).details.length) ? '' : ((current_root_1 && current_root_1[0] || {id:"1"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(current_root_1 && current_root_1[0] || {id:"1"}).subtotalPrice}</span>:(current_root_1 && current_root_1[0] || {id:"1"}).subtotalPrice)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </tag>
                            <tag>
                                <table className="right">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯後訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td><span className="icon1">企</span>{(!(last_root_1 && last_root_1[0] || {id:"1"}) || !(last_root_1 && last_root_1[0] || {id:"1"}).details || !(last_root_1 && last_root_1[0] || {id:"1"}).details.length) ? '' : (last_root_1 && last_root_1[0] || {id:"1"}).companyNameIsChange ? <span style={{color:'red'}}>{(last_root_1 && last_root_1[0] || {id:"1"}).companyName}</span>:(last_root_1 && last_root_1[0] || {id:"1"}).companyName}</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <th width="100">計劃時間</th>
                                        <td colSpan="4">
                                            {(!(last_root_1 && last_root_1[0] || {id:"1"}) || !(last_root_1 && last_root_1[0] || {id:"1"}).details || !(last_root_1 && last_root_1[0] || {id:"1"}).details.length) ? '' : (last_root_1 && last_root_1[0] || {id:"1"}).dateIsChange ? <span style={{color:'red'}}>{(last_root_1 && last_root_1[0] || {id:"1"}).serviceDate}</span>:(last_root_1 && last_root_1[0] || {id:"1"}).serviceDate}
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
                                        (!(last_root_1 && last_root_1[0] || {id:"1"}) || !(last_root_1 && last_root_1[0] || {id:"1"}).details || !(last_root_1 && last_root_1[0] || {id:"1"}).details.length) ?
                                            <div></div>
                                            :
                                            Object.getOwnPropertyNames(_.groupBy((last_root_1 && last_root_1[0] || {id:"1"}).details, detail => detail.categoryName)).map(function(categoryName){
                                                return _.groupBy((last_root_1 && last_root_1[0] || {id:"1"}).details, detail => detail.categoryName)[categoryName].map(function(categoryItem, inner_index){
                                                    return (
                                                        <tr key={`${inner_index}_${categoryItem.categoryName}`}>
                                                            <td>{inner_index == 0 ? categoryName : ""}</td>
                                                            <td>{!categoryItem.companyServiceName ? categoryItem.serviceDefName : categoryItem.companyServiceName}</td>
                                                            <td className="time">{categoryItem.careMinsIsChange ? <span style={{color:'red'}}>{categoryItem.careMins}</span>:categoryItem.careMins} 分鐘</td>
                                                            <td className="cost">{categoryItem.priceIsChange ? <span style={{color:'red'}}>{categoryItem.price}</span>:categoryItem.price}</td>
                                                            <td className="cost">{categoryItem.priceMutipleQtyIsChange ? <span style={{color:'red'}}>{categoryItem.price * categoryItem.qty}</span>:(categoryItem.price * categoryItem.qty)} 元</td>
                                                        </tr>)
                                                })
                                            })
                                    }
                                    <tr>
                                        <th colSpan="5" className="costTotal text-right">小計：${(!(last_root_1 && last_root_1[0] || {id:"1"}) || !(last_root_1 && last_root_1[0] || {id:"1"}).details || !(last_root_1 && last_root_1[0] || {id:"1"}).details.length) ? '' : ((last_root_1 && last_root_1[0] || {id:"1"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(last_root_1 && last_root_1[0] || {id:"1"}).subtotalPrice}</span>:(last_root_1 && last_root_1[0] || {id:"1"}).subtotalPrice)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </tag>
                            <div style={{clear:"both"}}></div>

                        </div>
                    </div>

                    <div className="listBox manager">
                        <div className="serviceTTL">餐食服務</div>
                        <div className="box">
                            <tag>
                                <table className="left">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯前訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td><span className="icon1">企</span>{(!(current_root_2 && current_root_2[0] || {id:"2"}) || !(current_root_2 && current_root_2[0] || {id:"2"}).details || !(current_root_2 && current_root_2[0] || {id:"2"}).details.length) ? '' : ((current_root_2 && current_root_2[0] || {id:"2"}).companyNameIsChange ? <span style={{color:'red'}}>{(current_root_2 && current_root_2[0] || {id:"2"}).companyName}</span>:(current_root_2 && current_root_2[0] || {id:"2"}).companyName)}</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <th width="100">計劃時間</th>
                                        <td colSpan="4">
                                            {(!(current_root_2 && current_root_2[0] || {id:"2"}) || !(current_root_2 && current_root_2[0] || {id:"2"}).details || !(current_root_2 && current_root_2[0] || {id:"2"}).details.length) ? '' : (current_root_2 && current_root_2[0] || {id:"2"}).dateIsChange ? <span style={{color:'red'}}>{(current_root_2 && current_root_2[0] || {id:"2"}).serviceDate}</span>:(current_root_2 && current_root_2[0] || {id:"2"}).serviceDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="subTTL">餐食內容</th>
                                        <th className="subTTL" width="60">單價</th>
                                        <th className="subTTL" width="60">數量</th>
                                        <th className="subTTL" width="60">金額</th>
                                    </tr>
                                    {
                                        (!(current_root_2 && current_root_2[0] || {id:"2"}) || !(current_root_2 && current_root_2[0] || {id:"2"}).details || !(current_root_2 && current_root_2[0] || {id:"2"}).details.length) ? <div></div> :
                                            (current_root_2 && current_root_2[0] || {id:"2"}).details.map(function(detail, index){
                                                return (
                                                    <tr key={`root2_item_${index}`}>
                                                        <td>{`${!detail.companyServiceName ? detail.serviceDefName : detail.companyServiceName}(${detail.calorie?detail.calorie:''}卡)`}</td>
                                                        <td className="cost">
                                                            ${detail.priceIsChange ? <span style={{color:'red'}}>{detail.price}</span>:detail.price}
                                                        </td>
                                                        <td className="cost">
                                                            ${detail.qtyIsChange ? <span style={{color:'red'}}>{detail.qty}</span>:detail.qty}
                                                        </td>
                                                        <td className="cost">{detail.priceMutipleQtyIsChange ? <span style={{color:'red'}}>{detail.price * detail.qty}</span>:(detail.price * detail.qty)} 元</td>
                                                    </tr>)
                                            })
                                    }
                                    <tr>
                                        <th colSpan="5" className="costTotal text-right">小計：${(!(current_root_2 && current_root_2[0] || {id:"2"}) || !(current_root_2 && current_root_2[0] || {id:"2"}).details || !(current_root_2 && current_root_2[0] || {id:"2"}).details.length) ? '' : ((current_root_2 && current_root_2[0] || {id:"2"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(current_root_2 && current_root_2[0] || {id:"2"}).subtotalPrice}</span>:(current_root_2 && current_root_2[0] || {id:"2"}).subtotalPrice)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </tag>
                            <tag>
                                <table className="right">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯後訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td><span className="icon1">企</span>{(!(last_root_2 && last_root_2[0] || {id:"2"}) || !(last_root_2 && last_root_2[0] || {id:"2"}).details || !(last_root_2 && last_root_2[0] || {id:"2"}).details.length) ? '' : (last_root_2 && last_root_2[0] || {id:"2"}).companyNameIsChange ? <span style={{color:'red'}}>{(last_root_2 && last_root_2[0] || {id:"2"}).companyName}</span>:(last_root_2 && last_root_2[0] || {id:"2"}).companyName}</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <th width="100">計劃時間</th>
                                        <td colSpan="4">
                                            {(!(last_root_2 && last_root_2[0] || {id:"2"}) || !(last_root_2 && last_root_2[0] || {id:"2"}).details || !(last_root_2 && last_root_2[0] || {id:"2"}).details.length) ? '' : (last_root_2 && last_root_2[0] || {id:"2"}).dateIsChange ? <span style={{color:'red'}}>{(last_root_2 && last_root_2[0] || {id:"2"}).serviceDate}</span>:(last_root_2 && last_root_2[0] || {id:"2"}).serviceDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="subTTL">餐食內容</th>
                                        <th className="subTTL" width="60">單價</th>
                                        <th className="subTTL" width="60">數量</th>
                                        <th className="subTTL" width="60">金額</th>
                                    </tr>
                                    {
                                        (!(last_root_2 && last_root_2[0] || {id:"2"}) || !(last_root_2 && last_root_2[0] || {id:"2"}).details || !(last_root_2 && last_root_2[0] || {id:"2"}).details.length) ? <div></div> :
                                            (last_root_2 && last_root_2[0] || {id:"2"}).details.map(function(detail, index){
                                                return (
                                                    <tr key={`root2_item_${index}`}>
                                                        <td>{`${!detail.companyServiceName ? detail.serviceDefName : detail.companyServiceName}(${detail.calorie?detail.calorie:''}卡)`}</td>
                                                        <td className="cost">
                                                            ${detail.priceIsChange ? <span style={{color:'red'}}>{detail.price}</span>:detail.price}
                                                        </td>
                                                        <td className="cost">
                                                            ${detail.qtyIsChange ? <span style={{color:'red'}}>{detail.qty}</span>:detail.qty}
                                                        </td>
                                                        <td className="cost">{detail.priceMutipleQtyIsChange ? <span style={{color:'red'}}>{detail.price * detail.qty}</span>:(detail.price * detail.qty)} 元</td>
                                                    </tr>)
                                            })
                                    }
                                    <tr>
                                        <th colSpan="5" className="costTotal text-right">小計：${(!(last_root_2 && last_root_2[0] || {id:"2"}) || !(last_root_2 && last_root_2[0] || {id:"2"}).details || !(last_root_2 && last_root_2[0] || {id:"2"}).details.length) ? '' : ((last_root_2 && last_root_2[0] || {id:"2"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(last_root_2 && last_root_2[0] || {id:"2"}).subtotalPrice}</span>:(last_root_2 && last_root_2[0] || {id:"2"}).subtotalPrice)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </tag>
                            <div style={{clear:"both"}}></div>

                        </div>
                    </div>

                    <div className="listBox manager">
                        <div className="serviceTTL">隨行服務</div>
                        <div className="box">
                            <tag>
                                <table className="left">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯前訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td><span className="icon1">企</span>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : ((current_root_3 && current_root_3[0] || {id:"3"}).companyNameIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).companyName}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).companyName)}</td>
                                    </tr>
                                    <tr>
                                        <th width="100">計劃時間</th>
                                        <td>
                                            {(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).dateIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).serviceDate}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).serviceDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>接送區域</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).pickUp.startZipIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.startZip}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.startZip}</td>
                                    </tr>
                                    <tr>
                                        <th>接送地址</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).pickUp.startAddressIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.startAddress}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.startAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>目的區域</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).pickUp.endZipIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.endZip}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.endZip}</td>
                                    </tr>
                                    <tr>
                                        <th>目地地址</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).pickUp.endAddressIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.endAddress}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.endAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>總人數</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).pickUp.passengerNumIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.passengerNum}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.passengerNum}</td>
                                    </tr>
                                    <tr>
                                        <th>含輪椅乘客</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : (current_root_3 && current_root_3[0] || {id:"3"}).pickUp.wheelchairNumIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.wheelchairNum}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).pickUp.wheelchairNum}</td>
                                    </tr>
                                    <tr>
                                        <th>車輛</th>
                                        <td>{(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : ((current_root_3 && current_root_3[0] || {id:"3"}).details[0].companyServiceName || (current_root_3 && current_root_3[0] || {id:"3"}).details[0].serviceDefName)}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan="2" className="costTotal">小計：${(!(current_root_3 && current_root_3[0] || {id:"3"}) || !(current_root_3 && current_root_3[0] || {id:"3"}).details || !(current_root_3 && current_root_3[0] || {id:"3"}).details.length) ? '' : ((current_root_3 && current_root_3[0] || {id:"3"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(current_root_3 && current_root_3[0] || {id:"3"}).subtotalPrice}</span>:(current_root_3 && current_root_3[0] || {id:"3"}).subtotalPrice)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </tag>
                            <tag>
                                <table className="right">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯後訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td><span className="icon1">企</span>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).companyNameIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).companyName}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).companyName}</td>
                                    </tr>
                                    <tr>
                                        <th width="100">計劃時間</th>
                                        <td>
                                            {(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).dateIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).serviceDate}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).serviceDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>接送區域</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).pickUp.startZipIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.startZip}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.startZip}</td>
                                    </tr>
                                    <tr>
                                        <th>接送地址</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).pickUp.startAddressIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.startAddress}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.startAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>目的區域</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).pickUp.endZipIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.endZip}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.endZip}</td>
                                    </tr>
                                    <tr>
                                        <th>目地地址</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).pickUp.endAddressIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.endAddress}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.endAddress}</td>
                                    </tr>
                                    <tr>
                                        <th>總人數</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).pickUp.passengerNumIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.passengerNum}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.passengerNum}</td>
                                    </tr>
                                    <tr>
                                        <th>含輪椅乘客</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : (last_root_3 && last_root_3[0] || {id:"3"}).pickUp.wheelchairNumIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.wheelchairNum}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).pickUp.wheelchairNum}</td>
                                    </tr>
                                    <tr>
                                        <th>車輛</th>
                                        <td>{(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : ((last_root_3 && last_root_3[0] || {id:"3"}).details[0].companyServiceName || (last_root_3 && last_root_3[0] || {id:"3"}).details[0].serviceDefName)}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan="2" className="costTotal">小計：${(!(last_root_3 && last_root_3[0] || {id:"3"}) || !(last_root_3 && last_root_3[0] || {id:"3"}).details || !(last_root_3 && last_root_3[0] || {id:"3"}).details.length) ? '' : ((last_root_3 && last_root_3[0] || {id:"3"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(last_root_3 && last_root_3[0] || {id:"3"}).subtotalPrice}</span>:(last_root_3 && last_root_3[0] || {id:"3"}).subtotalPrice)}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </tag>
                            <div style={{clear:"both"}}></div>

                        </div>
                    </div>

                    <div className="listBox manager">
                        <div className="serviceTTL">家事服務</div>
                        <div className="box">
                            <tag>
                                <table className="left">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯前訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td colSpan="3">{(!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ? '' : ((current_root_4 && current_root_4[0] || {id:"4"}).companyNameIsChange ? <span style={{color:'red'}}>{(current_root_4 && current_root_4[0] || {id:"4"}).companyName}</span>:(current_root_4 && current_root_4[0] || {id:"4"}).companyName)}</td>
                                    </tr>
                                    <tr>
                                        <th>計劃時間</th>
                                        <td colSpan="3">{(!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ? '' : (current_root_4 && current_root_4[0] || {id:"4"}).dateIsChange ? <span style={{color:'red'}}>{(current_root_4 && current_root_4[0] || {id:"4"}).serviceDate}</span>:(current_root_4 && current_root_4[0] || {id:"4"}).serviceDate}</td>
                                    </tr>
                                    <tr>
                                        <th>類別</th>
                                        <td>名稱</td>
                                        <td>時間</td>
                                        <td>金額</td>
                                    </tr>
                                    {
                                        (!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ?
                                            <div></div>
                                            :
                                            Object.getOwnPropertyNames(_.groupBy((current_root_4 && current_root_4[0] || {id:"4"}).details, detail => detail.categoryName)).map(function(serviceDefName){
                                                return _.groupBy((current_root_4 && current_root_4[0] || {id:"4"}).details, detail => detail.categoryName)[serviceDefName].map(function(item, inner_index){
                                                    return (
                                                        <tr key={`${inner_index}_${item.serviceDefName}`}>
                                                            <th>{inner_index == 0 ? serviceDefName : ""}</th>
                                                            <td>{!item.companyServiceName ? item.serviceDefName : item.companyServiceName}</td>
                                                            <td>{item.careMins}</td>
                                                            <td>{item.qty}</td>
                                                        </tr>)
                                                })
                                            })
                                    }
                                    <tr>
                                        <th>清潔坪數</th>
                                        <td colSpan="3">{(!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ? '' : (current_root_4 && current_root_4[0] || {id:"4"}).cleanSize}</td>
                                    </tr>
                                    <tr>
                                        <th>清潔用品</th>
                                        <td colSpan="3">
                                            {(!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ? '' : (((current_root_4 && current_root_4[0] || {id:"4"}).cleanSupply === '1') ? ((current_root_4 && current_root_4[0] || {id:"4"}).cleanSupplyIsChange ? <span style={{color:'red'}}>{'家中已有慣用用品'}</span>:'家中已有慣用用品') : ((current_root_4 && current_root_4[0] || {id:"4"}).cleanSupplyIsChange ? <span style={{color:'red'}}>{'請清潔服務員準備'}</span>:'請清潔服務員準備') )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>清潔時數</th>
                                        <td colSpan="3">
                                            {(!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ? '' : ((current_root_4 && current_root_4[0] || {id:"4"}).totalCareMinsIsChange ? <span style={{color:'red'}}>{(current_root_4 && current_root_4[0] || {id:"4"}).totalCareMins.toString()}</span>:(current_root_4 && current_root_4[0] || {id:"4"}).totalCareMins.toString())}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="costTotal">小計：${(!(current_root_4 && current_root_4[0] || {id:"4"}) || !(current_root_4 && current_root_4[0] || {id:"4"}).details || !(current_root_4 && current_root_4[0] || {id:"4"}).details.length) ? '' : ((current_root_4 && current_root_4[0] || {id:"4"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(current_root_4 && current_root_4[0] || {id:"4"}).subtotalPrice}</span>:(current_root_4 && current_root_4[0] || {id:"4"}).subtotalPrice)} 元</td>
                                    </tr>
                                    </tbody>
                                </table>

                            </tag>
                            <tag>
                                <table className="right">
                                    <tbody key={"service"}>
                                    <tr><th className="subTTL">編輯後訂單</th></tr>
                                    <tr>
                                        <th>服務提供</th>
                                        <td colSpan="3">{(!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ? '' : (last_root_4 && last_root_4[0] || {id:"4"}).companyNameIsChange ? <span style={{color:'red'}}>{(last_root_4 && last_root_4[0] || {id:"4"}).companyName}</span>:(last_root_4 && last_root_4[0] || {id:"4"}).companyName}</td>
                                    </tr>
                                    <tr>
                                        <th>計劃時間</th>
                                        <td colSpan="3">
                                            {(!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ? '' : (last_root_4 && last_root_4[0] || {id:"4"}).dateIsChange ? <span style={{color:'red'}}>{(last_root_4 && last_root_4[0] || {id:"4"}).serviceDate}</span>:(last_root_4 && last_root_4[0] || {id:"4"}).serviceDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>類別</th>
                                        <td>名稱</td>
                                        <td>時間</td>
                                        <td>金額</td>
                                    </tr>
                                    {
                                        (!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ?
                                            <div></div>
                                            :
                                            Object.getOwnPropertyNames(_.groupBy((last_root_4 && last_root_4[0] || {id:"4"}).details, detail => detail.categoryName)).map(function(serviceDefName){
                                                return _.groupBy((last_root_4 && last_root_4[0] || {id:"4"}).details, detail => detail.categoryName)[serviceDefName].map(function(item, inner_index){
                                                    return (
                                                        <tr key={`${inner_index}_${item.serviceDefName}`}>
                                                            <th>{inner_index == 0 ? serviceDefName : ""}</th>
                                                            <td>{!item.companyServiceName ? item.serviceDefName : item.companyServiceName}</td>
                                                            <td>{item.careMins}</td>
                                                            <td>{item.qty}</td>
                                                        </tr>)
                                                })
                                            })
                                    }
                                    <tr>
                                        <th>清潔坪數</th>
                                        <td colSpan="3">{(!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ? '' : (last_root_4 && last_root_4[0] || {id:"4"}).cleanSizeIsChange ? <span style={{color:'red'}}>{(last_root_4 && last_root_4[0] || {id:"4"}).cleanSize}</span>:(last_root_4 && last_root_4[0] || {id:"4"}).cleanSize}</td>
                                    </tr>
                                    <tr>
                                        <th>清潔用品</th>
                                        <td colSpan="3">
                                            {(!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ? '' : (((last_root_4 && last_root_4[0] || {id:"4"}).cleanSupply === '1') ? ((last_root_4 && last_root_4[0] || {id:"4"}).cleanSupplyIsChange ? <span style={{color:'red'}}>{'家中已有慣用用品'}</span>:'家中已有慣用用品') : ((last_root_4 && last_root_4[0] || {id:"4"}).cleanSupplyIsChange ? <span style={{color:'red'}}>{'請清潔服務員準備'}</span>:'請清潔服務員準備') )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>清潔時數</th>
                                        <td colSpan="3">
                                            {(!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ? '' : ((last_root_4 && last_root_4[0] || {id:"4"}).totalCareMinsIsChange ? <span style={{color:'red'}}>{(last_root_4 && last_root_4[0] || {id:"4"}).totalCareMins.toString()}</span>:(last_root_4 && last_root_4[0] || {id:"4"}).totalCareMins.toString())}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="costTotal">小計：${(!(last_root_4 && last_root_4[0] || {id:"4"}) || !(last_root_4 && last_root_4[0] || {id:"4"}).details || !(last_root_4 && last_root_4[0] || {id:"4"}).details.length) ? '' : ((last_root_4 && last_root_4[0] || {id:"4"}).subtotalPriceIsChange ? <span style={{color:'red'}}>{(last_root_4 && last_root_4[0] || {id:"4"}).subtotalPrice}</span>:(last_root_4 && last_root_4[0] || {id:"4"}).subtotalPrice)} 元</td>
                                    </tr>
                                    </tbody>
                                </table>

                            </tag>
                            <div style={{clear:"both"}}></div>

                        </div>
                    </div>

                    <div className="listBox manager">
                        <div className="box">

                            <table className="left">
                                <tr><th className="subTTL">編輯前訂單</th></tr>
                                <tr><td>總金額：${oldOrderHistory.totalPriceIsChange ? <span style={{color:'red'}}>{oldOrderHistory.totalPrice}</span>:oldOrderHistory.totalPrice} 元</td></tr>
                            </table>
                            <table className="right">
                                <tr><th className="subTTL">編輯後訂單</th></tr>
                                <tr><td>總金額：${latestOrderHistory.totalPriceIsChange ? <span style={{color:'red'}}>{latestOrderHistory.totalPrice}</span>:latestOrderHistory.totalPrice} 元</td></tr>
                            </table>

                            <div style={{clear:"both"}}></div>

                        </div>
                    </div>

                    <div className="listBox manager">
                        <div className="serviceTTL">被服務者資料</div>
                        <div className="box">

                            <table className="left">
                                <tbody key={`careMember_${!(oldOrderHistory.careMember) ? '0' : oldOrderHistory.careMember.id}`}>
                                <tr><th className="subTTL">編輯前訂單</th></tr>
                                <tr>
                                    <th>被服務者姓名</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : oldOrderHistory.careMember.name}</td>
                                </tr>
                                <tr>
                                    <th>性別</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : sexNameMap[oldOrderHistory.careMember.sex]}</td>
                                </tr>
                                <tr>
                                    <th>行動電話</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : oldOrderHistory.careMember.cellphone}</td>
                                </tr>
                                <tr>
                                    <th>家用電話</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : (oldOrderHistory.careMember.homeTelIsChange ? <span style={{color:'red'}}>{oldOrderHistory.careMember.homeTel}</span>:oldOrderHistory.careMember.homeTel)}</td>
                                </tr>
                                <tr>
                                    <th>被服務者區域</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : (oldOrderHistory.careMember.zipIdIsChange ? <span style={{color:'red'}}>{zipsMap[oldOrderHistory.careMember.zipId].name}</span> : zipsMap[oldOrderHistory.careMember.zipId].name)}</td>
                                </tr>
                                <tr>
                                    <th>被服務者地址</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : (oldOrderHistory.careMember.addressIsChange ? <span style={{color:'red'}}>{oldOrderHistory.careMember.address}</span> : oldOrderHistory.careMember.address)}</td>
                                </tr>
                                <tr>
                                    <th>身心障礙身份</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : (oldOrderHistory.careMember.healthStatusesIsChange ? <span style={{color:'red'}}>{oldOrderHistory.careMember.healthStatuses.map(id => disablilitiesMap[id].name).join('、')}</span> : oldOrderHistory.careMember.healthStatuses.map(id => disablilitiesMap[id].name).join('、'))}</td>
                                </tr>
                                <tr>
                                    <th>健康狀況</th>
                                    <td>{!(oldOrderHistory.careMember) ? '' : (oldOrderHistory.careMember.healthRecordsIsChange ? <span style={{color:'red'}}>{oldOrderHistory.careMember.healthRecords.map(id => diseasesMap[id].name).join('、')}</span> : oldOrderHistory.careMember.healthRecords.map(id => diseasesMap[id].name).join('、'))}</td>
                                </tr>
                                </tbody>
                            </table>
                            <table className="right">
                                <tbody key={`careMember_${!(latestOrderHistory.careMember) ? '0' : latestOrderHistory.careMember.id}`}>
                                <tr><th className="subTTL">編輯後訂單</th></tr>
                                <tr>
                                    <th>被服務者姓名</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : latestOrderHistory.careMember.name}</td>
                                </tr>
                                <tr>
                                    <th>性別</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : sexNameMap[latestOrderHistory.careMember.sex]}</td>
                                </tr>
                                <tr>
                                    <th>行動電話</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : latestOrderHistory.careMember.cellphone}</td>
                                </tr>
                                <tr>
                                    <th>家用電話</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : (latestOrderHistory.careMember.homeTelIsChange ? <span style={{color:'red'}}>{latestOrderHistory.careMember.homeTel}</span>:latestOrderHistory.careMember.homeTel)}</td>
                                </tr>
                                <tr>
                                    <th>被服務者區域</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : (latestOrderHistory.careMember.zipIdIsChange ? <span style={{color:'red'}}>{zipsMap[latestOrderHistory.careMember.zipId].name}</span> : zipsMap[latestOrderHistory.careMember.zipId].name)}</td>
                                </tr>
                                <tr>
                                    <th>被服務者地址</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : (latestOrderHistory.careMember.addressIsChange ? <span style={{color:'red'}}>{latestOrderHistory.careMember.address}</span> : latestOrderHistory.careMember.address)}</td>
                                </tr>
                                <tr>
                                    <th>身心障礙身份</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : (latestOrderHistory.careMember.healthStatusesIsChange ? <span style={{color:'red'}}>{latestOrderHistory.careMember.healthStatuses.map(id => disablilitiesMap[id].name).join('、')}</span> : latestOrderHistory.careMember.healthStatuses.map(id => disablilitiesMap[id].name).join('、'))}</td>
                                </tr>
                                <tr>
                                    <th>健康狀況</th>
                                    <td>{!(latestOrderHistory.careMember) ? '' : (latestOrderHistory.careMember.healthRecordsIsChange ? <span style={{color:'red'}}>{latestOrderHistory.careMember.healthRecords.map(id => diseasesMap[id].name).join('、')}</span> : latestOrderHistory.careMember.healthRecords.map(id => diseasesMap[id].name).join('、'))}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="listBox manager">
                        <div className="serviceTTL">訂單備註</div>
                        <div className="box note">

                            <table className="left">
                                <tr><th className="subTTL">編輯前訂單</th></tr>
                                <tr>
                                    <th>申請明細</th>
                                </tr>
                                <tr>
                                    <th>
                                        {oldOrderHistory.remarkIsChange? <span style={{color:'red'}}>{oldOrderHistory.remark === undefined ? "無" : oldOrderHistory.remark}</span>:oldOrderHistory.remark === undefined ? "無" : oldOrderHistory.remark }
                                    </th>
                                </tr>
                            </table>

                            <table className="right">
                                <tr><th className="subTTL">編輯後訂單</th></tr>
                                <tr>
                                    <th>申請明細</th>
                                </tr>
                                <tr>
                                    <th>{latestOrderHistory.remarkIsChange? <span style={{color:'red'}}>{latestOrderHistory.remark === undefined ? "無" : latestOrderHistory.remark}</span>:latestOrderHistory.remark === undefined ? "無" : latestOrderHistory.remark }</th>
                                </tr>
                            </table>

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(state => ({historys: state.senior.historys}), {...OrderActions})(PassitiveOrderDetailHistory)