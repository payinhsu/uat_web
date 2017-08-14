import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import * as CourseActions from 'actions/master/CourseActions';
import * as DefinitionActions from 'actions/master/DefinitionActions';
var config = require('config-prod');

import CoursePaidUploadView from 'components/master/CoursePaidUploadView';
import CoursePaidUpload from 'components/master/CoursePaidUpload';
import CourseRefundUploadView from 'components/master/CourseRefundUploadView';
import CourseRefundUpload from 'components/master/CourseRefundUpload';
import moment from 'moment';

export default class CourseOrderMembers extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		// insert model 所勾選的項目
    		checkList: [], 
    		members : props.master.members,
			memberName: '',
    		phone: '',
    		status: '',
    		courseId: props.params.courseId, 
    		openCoursePaidUploadView : false,     	// default not open 
    		openCoursePaidUpload : false,     		// default not open 
    		openCourseRefundUploadView : false,     // default not open 
    		openCourseRefundUpload : false,     	// default not open 
    		paidUploadMember: [],
    		refundUploadMember: [],
    	};

    	// console.log(this.state.courseId) ;
	}

	componentWillReceiveProps = newProps => {
        this.setState({
            // dialog control

            // insert model
            members : newProps.master.members,
            //paidUploadMember: [],
            //refundUploadMember: [],
      });
    };

	static onEnter(store){
		let paidUploadModel = {member: {id:'', familyName:'', firstName:''},courseName:'', paidRecords:[{paidDate:moment().format("YYYY-MM-DD"),uploadDate:moment().format("YYYY-MM-DD"),uploadAuthor:'', fileKey:''}]} ;	
		let refundUploadModel = {member: {id:'', familyName:'', firstName:''},courseName:'', refundRecords:[{bankCode:'',bankName:'',branch:'',accountNum:'',refundDate:moment().format("YYYY-MM-DD"),uploadDate:moment().format("YYYY-MM-DD"),fileKey:''}]};

	    return (nextState, replace, callback) => {
	        if(nextState.params && nextState.params.courseId){
				DefinitionActions.getDefinitions()(store.dispatch, store.getState).then(() => {
					CourseActions.getCourseOrderMembers(nextState.params.courseId,null)(store.dispatch, store.getState).then(() => {
						CourseActions.getCourse(nextState.params.courseId)(store.dispatch, store.getState).then(() => {
							store.dispatch( CourseActions.setEmptyPaidUpload(paidUploadModel));
							store.dispatch( CourseActions.setEmptyRefundUpload(refundUploadModel));
						    callback();
						})
					})
				});
	        }
	        else callback();
	    }
	}

  	onClosePicker = () => {
      	this.setState({
        	openCoursePaidUploadView:false,
        	openCoursePaidUpload:false,
        	openCourseRefundUploadView:false,
        	openCourseRefundUpload:false
      	});
    };

    handleCoursePaidUploadView = (memberId, e) => {
        e.preventDefault();
        this.props.getCoursePaidUpload( this.state.courseId, memberId) ;
        this.setState({openCoursePaidUploadView:true});
    };

    handleCourseRefundUploadView = (memberId, e) => {
        e.preventDefault();
        this.props.getCourseRefundUpload( this.state.courseId, memberId) ;
        this.setState({openCourseRefundUploadView:true});
    };

	handleMemberCheck = (itemValue, e) => {
		console.log(`${itemValue} checked: ${e.target.checked}`);
		let checkList = this.state.checkList;
    	const checked = e.target.checked;
    	if(checked)
      		checkList.push(itemValue);
    	else
      		checkList.splice(checkList.indexOf(itemValue), 1);

    	this.setState({checkList: this.state.checkList});
    	console.log(JSON.stringify(this.state.checkList));
  	};

  	handleMemberAllCheck = (e) => {
  		//console.log(`All checked: ${e.target.checked}`);
		let checkList = this.state.checkList;
		let members = this.state.members ;
		const checked = e.target.checked;
    	if(checked) {
    		members.map ( member =>  {
    			checkList.splice(checkList.indexOf(member.orderId), 1);

    		});
    		members.map ( member =>  {
    			checkList.push(member.orderId);

    		});
    	} else {
    		members.map ( member =>  {
    			checkList.splice(checkList.indexOf(member.orderId), 1);

    		});
      	}
      	
    	this.setState({checkList: this.state.checkList});
    	//console.log(JSON.stringify(this.state.checkList));
  	};

  	handlePaymentStatus = (paymentStatus, e) => {
  		//console.log(paymentStatus);
  		let checkList = this.state.checkList;
  		let members = this.state.members;
		let orders = this.toApiModel(checkList, paymentStatus) ;
		//console.log(JSON.stringify(orders));
		//console.log(this.props.master.course.id);
		//validate 0->1 and 1 -> 1
		let errorMsg = '' ;
		let no = [] ;
		if(paymentStatus == 1) {
			members.map ( (member, index) => { 
				if(member.paymentStatus != 0 && member.paymentStatus != 1 && checkList.find(li => li == member.orderId)) {
					no.push( index ) ; 
				} 
			})
			if(no.length != 0) {
				errorMsg =  '編號 ' + no + ' 非待付款報名資料無法執行確認付款功能，請重新指定資料。' ;
			}
		}

		if(paymentStatus == 2) {
			members.map ( (member, index) => { 
				if(member.paymentStatus != 0 && checkList.find(li => li == member.orderId)) {
					no.push( index ) ; 
				} 
			})
			if(no.length != 0) {
				errorMsg =  '編號 ' + no + ' 非待付款報名資料無法執行取消報名功能，請重新指定資料。';
			}
		}

		if(paymentStatus == 3) {
			members.map ( (member, index) => { 
				if(member.paymentStatus != 1 && member.paymentStatus != 3 && checkList.find(li => li == member.orderId)) {
					no.push( index ) ; 
				} 
			})
			if(no.length != 0) {
				errorMsg =  '編號 ' + no + ' 非已付款報名資料無法執行退款功能，請重新指定資料。';
			}
		}

		if(errorMsg != '') {
			alert(errorMsg) ;	
		} else {
			this.props.updateOrderPaymentStatus(orders, this.props.master.course.id);
			let paidUploadMember = this.toUploadModelPaid(checkList, members) ;
			let refundUploadMember = this.toUploadModelRefund(checkList, members) ;
			this.setState({refundUploadMember: refundUploadMember, paidUploadMember: paidUploadMember}) ;

			if(paymentStatus == 1 && paidUploadMember.length != 0) {
				//console.log(this.state.paidUploadMember) ;
				this.setState({openCoursePaidUpload:true}); 
			} else if(paymentStatus == 3 && refundUploadMember.length != 0) {
				//console.log(this.state.refundUploadMember) ;
				this.setState({openCourseRefundUpload:true}); 
			}
		}
  	};

    toApiModel = (checkList,paymentStatus) => {
     	let result = []
	     checkList.map(li => {
	    	result.push({id:li, paymentStatus:paymentStatus});
	    })
	    return {orders:result}
    } ;
    
    toUploadModelPaid = (checkList, members) => {
    	let result = [];
    	checkList.map(li => {
    		let member = members.filter(member => member.orderId == li)[0] ;
    		result.push({id: member.id,
    			         firstName:member.firstName, 
    			         familyName:member.familyName, 
    			         paidDate:moment().format("YYYY-MM-DD"), 
    			         fileKey:''
    			        }) ;
    	})
    	//console.log("result : " + result) ;
    	return result ;
    } ;

    toUploadModelRefund = (checkList, members) => {
    	let result = [];
    	checkList.map(li => {
    		let member = members.filter(member => member.orderId == li)[0] ;
    		result.push({id: member.id,
    			         firstName:member.firstName, 
    			         familyName:member.familyName, 
    			         refundDate:moment().format("YYYY-MM-DD"), 
    			         fileKey:'', 
    			         account: {
    			         	bankCode: '',
    			         	bankName: '',
    			         	branch: '',
    			         	accountNum:''	
    			         }
    			        }) ;
    	})
    	//console.log("result : " + result) ;
    	return result ;
    } ;

    handleSelectCourseOrderMembers = (name,phone, status,e) => {
		e.preventDefault();
		let memberName,cellPhone,paymemtStatus;
		if(name.length > 0){
			memberName = name.trim();
		}else{
			memberName = '';
		}
		if(phone.length > 0){
			cellPhone = phone.trim();
		}else{
			cellPhone = '';
		}
		if(status.length > 0){
			paymemtStatus = status.trim();
		}else{
			paymemtStatus = '';
		}

		let query = {
			memberName:memberName,cellphone:cellPhone,paymentStatus:paymemtStatus
		};
		this.props.getCourseOrderMembers(this.state.courseId,query);
    };

	changeOrderMembersPaymemtStatus(field, e){
		e.preventDefault();
		e.stopPropagation();
		this.state.status = e.target.value;
		this.setState({satus: this.state.status});
	}

	handleChangeMemberName = ( field, e) => {
		this.state.memberName = e.target.value;
		this.setState({memberName: this.state.memberName});
	};

	handleChangePhone = ( field, e) => {
		this.state.phone = e.target.value;
		this.setState({phone: this.state.phone});
	};
   
	render() {
    	let childProps = Object.assign({}, this.props);
    	let query ={memberName:this.state.memberName,cellphone:this.state.cellPhone,paymentStatus:this.state.status} ;
	    delete childProps.children;
	    return (
	    <div id="course-members-view">
	      	<h4>課程開班資訊-已報名學員資料 </h4><Link to={`${config.webContext}master/admin/courseDefs`}>關閉</Link>
	      	<h5>上課時間 {this.props.master.course.minStartDate} - {this.props.master.course.maxEndDate}</h5>
	      	<h5>課程名稱 : {this.props.master.course.name}</h5>
	      	<form id="selectForm">
				<div>
					姓名 : <input type="text" value={this.state.memberName} onChange={this.handleChangeMemberName.bind(this,'memberName')}/> &nbsp;
					手機 : <input type="number" value={this.state.phone} onChange={this.handleChangePhone.bind(this,'phone')}/> &nbsp;
					狀態 : <select value={this.state.status} onChange={this.changeOrderMembersPaymemtStatus.bind(this,'status')}>
						<option value="">全部</option>
						<option value="0">待付款</option>
						<option value="1">確認付款</option>
						<option value="2">取消報名</option>
						<option value="3">退款</option>
					</select> &nbsp;
					<button onClick={this.handleSelectCourseOrderMembers.bind(this, this.state.memberName, this.state.phone, this.state.status)}>查詢</button>
				</div>
			</form>
	      	<table className={"order-list"}>
		        <thead>
		          	<tr>
		          		<th><input id="all" type="checkbox" onChange={this.handleMemberAllCheck}/>全選</th>
			            <th>NO</th>
			            <th>學員姓名</th>
			            <th>性別</th>
			            <th>手機</th>
			            <th>所在區域</th>
			            <th>E-Mail</th>
			            <th>已報名班級</th>
			            <th>已付款班級</th>
			            <th>狀態</th>	
			            <th>取消報名日期</th>
						<th>付款日期</th>
						<th>退款日期</th>	    
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.state.members.map( (member, index) => (
		              <tr key={`course_signup_member_${index}`}>
		                <td><input type="checkbox" onChange={this.handleMemberCheck.bind(this, member.orderId)} checked={this.state.checkList.indexOf(member.orderId) >= 0} /></td>
		                <td>{index}</td>
		                <td>{member.familyName}{member.firstName}</td>
		                <td>{member.sex == 1 ? '男' : '女'}</td>
		                <td>{member.cellphone}</td>
		                <td>{member.zipName}</td>
		                <td>{member.email}</td>
		                <td>{member.orderCount}</td>
		                <td>{member.paidCount}</td>
		                <td>{member.paymentStatus == 0 ? '待付款' : member.paymentStatus == 1 ? '已付款' : member.paymentStatus == 2 ? '取消報名' : '已退款'}</td>
		                <td>{member.cancelDate}</td>
		                <td><a onClick={this.handleCoursePaidUploadView.bind(this, member.id)}>{member.paidDate}</a></td>
		                <td><a onClick={this.handleCourseRefundUploadView.bind(this, member.id)}>{member.refundDate}</a></td>
		              </tr>
		            ))}
		        </tbody>
        	</table>
	      	<button onClick = {this.handlePaymentStatus.bind(this, "1")}>確認付款</button>&nbsp;
	      	<button onClick = {this.handlePaymentStatus.bind(this, "2")}>取消報名</button>&nbsp;
	      	<button onClick = {this.handlePaymentStatus.bind(this, "3")}>退款</button>&nbsp;

	      	<CoursePaidUpload query={query} createCoursePaidUpload={this.props.createCoursePaidUpload} courseId={this.state.courseId} open={this.state.openCoursePaidUpload} paidUploadMember={this.state.paidUploadMember} onRequestClose={this.onClosePicker}  auth={this.props.auth} />

	      	<CoursePaidUploadView query={query} createCoursePaidUpload={this.props.createCoursePaidUpload} courseId={this.state.courseId} open={this.state.openCoursePaidUploadView} memberCoursePaidUploadRecord={this.props.master.memberCoursePaidUploadRecord} onRequestClose={this.onClosePicker}  auth={this.props.auth} />
	  		
	      	<CourseRefundUpload query={query} banksMapping={this.props.master.definition.banks} createCourseRefundUpload={this.props.createCourseRefundUpload} courseId={this.state.courseId} open={this.state.openCourseRefundUpload} refundUploadMember={this.state.refundUploadMember} onRequestClose={this.onClosePicker}  auth={this.props.auth} />

	      	<CourseRefundUploadView query={query} banksMapping={this.props.master.definition.banks} createCourseRefundUpload={this.props.createCourseRefundUpload} courseId={this.state.courseId} open={this.state.openCourseRefundUploadView} memberCourseRefundUploadRecord={this.props.master.memberCourseRefundUploadRecord} onRequestClose={this.onClosePicker}  auth={this.props.auth} />
       		{this.props.children && React.cloneElement(this.props.children, childProps)}
      	</div>
    );
  }
}