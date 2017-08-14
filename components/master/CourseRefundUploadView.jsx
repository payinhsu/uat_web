import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import moment from 'moment';
import Document from 'components/Document';
var config = require('config-prod');

export default class CourseRefundUploadView extends React.Component {

	  constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            memberCourseRefundUploadRecord: props.memberCourseRefundUploadRecord, 
            createCourseRefundUpload : props.createCourseRefundUpload,
            courseId : props.courseId,
            query: props.query, 
            member : {id: props.memberCourseRefundUploadRecord.member.id,
                      refundDate:props.memberCourseRefundUploadRecord.refundRecords.length >0 ? moment(props.memberCourseRefundUploadRecord.refundRecords[0].refundDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"), 
                      fileKey:'', 
                      account: {
                        bankCode: '',
                        bankName: '',
                        branch: '',
                        accountNum : ''     
                      }
                     },
            banks: props.banksMapping

  	    };

        console.log("construct :  " + JSON.stringify(this.state.member)) ;
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          memberCourseRefundUploadRecord: newProps.memberCourseRefundUploadRecord, 
          createCourseRefundUpload : newProps.createCourseRefundUpload,
          query: newProps.query,
          courseId : newProps.courseId,
           member : {id: newProps.memberCourseRefundUploadRecord.member.id,
                      refundDate:newProps.memberCourseRefundUploadRecord.refundRecords.length >0 ? moment(newProps.memberCourseRefundUploadRecord.refundRecords[0].refundDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"), 
                      fileKey:'', 
                      account: {
                        bankCode: '',
                        bankName: '',
                        branch: '',
                        accountNum : ''     
                      }
                     },
            banks: newProps.banksMapping
  	    };
  	    this.setState(nextState);
  	};

    handleClose = () => {
        this.setState({open: false});
        this.props.onRequestClose();
    };

    handleChangeMemberUploadDateRecord = ( e, date ) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        let nextMember = this.state.member ;
        nextMember.refundDate = dateStr;
        this.setState({member: nextMember}) ;
    } ;

    handleChangeMemberAccount = ( field,field2, e) => {
        let nextMember = this.state.member;
        let banksJsonArray = this.state.banks;
        let banksMap = {};
        for (let i = 0; banksJsonArray.length > i; i += 1) {
            banksMap[banksJsonArray[i].bankCode] = banksJsonArray[i].name;
        }
        var matchBankName = function(code) {
            return banksMap[code];
        };
        if(field2 != null) {
            let bankName = matchBankName(e.target.value);
            if(bankName)
                nextMember.account[field2] = bankName;
            else
                nextMember.account[field2] = '無此銀行名稱';  
        }
        
        nextMember.account[field] = e.target.value;
        this.setState({member:nextMember});
    } ;

    handleChangeMember = ( field, e) => {
        let nextMember = this.state.member;
        nextMember[field] = e.target.value;
        this.setState({member:nextMember});
    };

    handleRefundUpload = () => {
        // let model = this.toApiModel(this.state.paidUploadMember) ;
        let members = this.toApiModel(this.state.member) ;
        //console.log("Robin test " + JSON.stringify(members) ) ;
        this.props.createCourseRefundUpload(this.state.courseId,members, this.state.query) ;
    };

    handleUploadImage = (fileKey,fileName) => {
       this.state.member.fileKey = fileKey;
       this.setState({member: this.state.member});
       console.log(JSON.stringify(this.state));
    };

    toApiModel = (member) => {
        let members = [] ;
        members.push(member) ;
        return {members:members} ;
    }

  	render() {
      console.log(JSON.stringify(this.state.member)) ;
    	const actions = [
	      <FlatButton
	        label="關閉視窗"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	    ];

    	return (
        <Dialog
          title="課程開班資訊 - 已付款學員資料-退款資料預覽頁"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            學員姓名 : {this.state.memberCourseRefundUploadRecord.member.familyName}{this.state.memberCourseRefundUploadRecord.member.firstName} &nbsp; 班級名稱 : {this.state.memberCourseRefundUploadRecord.courseName}
            <div>
                <table>
                  <tr>
                    <td>實際退款日</td>
                    <td><DatePicker value={moment(this.state.member.refundDate).toDate()} onChange={this.handleChangeMemberUploadDateRecord}/></td>
                  </tr>
                  <tr>
                    <td>銀行代碼</td>
                    <td> <input type="number" value={this.state.member.account.bankCode} onChange={this.handleChangeMemberAccount.bind(this, 'bankCode','bankName')}/> </td>
                    <td>銀行名稱</td>
                    <td><input type="text" value={this.state.member.account.bankName} disabled="true"/></td>
                  </tr>
                  <tr>
                    <td>分行名稱</td>
                    <td><input type="text" value={this.state.member.account.branch} onChange={this.handleChangeMemberAccount.bind(this, 'branch', null)}/> 分行</td>
                    <td>帳號</td>
                    <td><input type="text" value={this.state.member.account.accountNum} onChange={this.handleChangeMemberAccount.bind(this, 'accountNum', null)}/></td>
                  </tr>
                  <tr>
                    <td>存摺影本</td>
                    <td><input type="text" value={this.state.member.fileKey} disabled="true" onChange={this.handleChangeMember.bind(this, 'fileKey')}/></td>
                      <td><Document
                          auth={this.props.auth} 
                          docType="refundImage"
                          convertType="course-image" 
                          onUpload={this.handleUploadImage.bind(this)}
                        />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Document
                          auth={this.props.auth} 
                          docType="refundDoc"
                          convertType="course-application" 
                          onUpload={this.handleUploadImage.bind(this)}
                        /></td>
                    <td><button onClick={this.handleRefundUpload}>新增退款資料</button></td>
                  </tr>
                </table>
            </div>

            <table className="order-list">
		        <thead>
		          	<tr>
			            <th>實際退款日</th>
			            <th>退款銀行</th>
                  <th>分行</th>
                  <th>退款帳號</th>
                  <th>上傳日期</th>
                  <th>上傳人員</th>
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.state.memberCourseRefundUploadRecord.refundRecords.map( (refundRecord, index) => {
		            	return (<tr key={`memberCourseRefundUploadRecord_${index}`}>
		                	<td>{refundRecord.fileKey === ''? refundRecord.refundDate : (<a href={refundRecord.filePath} target="_blank">{refundRecord.refundDate}</a>)}</td>
		                	<td>{refundRecord.bankCode}{refundRecord.bankName}</td>
                      <td>{refundRecord.branch}</td>
                      <td>{refundRecord.accountNum}</td>
                      <td>{refundRecord.uploadDate}</td>
                      <td>{refundRecord.uploadAuthor}</td>
		              	</tr>);
                })}
		        </tbody>
        	</table>
        </Dialog>
        );
    }
}