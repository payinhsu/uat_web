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

export default class CourseRefundUpload extends React.Component {

	  constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            refundUploadMember: props.refundUploadMember,
            courseId : props.courseId,
            createCourseRefundUpload: props.createCourseRefundUpload,
            query: props.query,
            banks: props.banksMapping
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          refundUploadMember: newProps.refundUploadMember,
          courseId : newProps.courseId,
          createCourseRefundUpload: newProps.createCourseRefundUpload,
          query: newProps.query,
          banks: newProps.banksMapping
  	    };
  	    this.setState(nextState);
  	};

    handleClose = () => {
        this.setState({open: false});
        this.props.onRequestClose();
    };

    handleChangeMemberUploadDate = (index, member, e, date ) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        let nextRefundUploadMember = this.state.refundUploadMember ;
        nextRefundUploadMember[index].refundDate = dateStr
        this.setState({refundUploadMember: nextRefundUploadMember}) ;
    };

    handleChangeMemberAccount = (index, field1, field2, e) => {
        let nextRefundUploadMember = this.state.refundUploadMember;
        nextRefundUploadMember[index].account[field1] = e.target.value;

        let banksJsonArray = this.state.banks;
        let banksMap = {};
        for (let i = 0; banksJsonArray.length > i; i += 1) {
            banksMap[banksJsonArray[i].bankCode] = banksJsonArray[i].name;
        }
        var matchBankName = function(code) {
            return banksMap[code];
        };

        let bankName = matchBankName(e.target.value);
        if(field2 != null) {
            if(bankName)
                nextRefundUploadMember[index].account[field2] = bankName;
            else
                nextRefundUploadMember[index].account[field2] = '無此銀行名稱';
        }
        
        this.setState({refundUploadMember:nextRefundUploadMember});
    } ;

    handleChangeMember = (index, field, e) => {
        let nextRefundUploadMember = this.state.refundUploadMember;
        nextRefundUploadMember[index][field] = e.target.value;
        this.setState({refundUploadMember:nextRefundUploadMember});
    };

    handleRefundUpload = () => {
        // let model = this.toApiModel(this.state.paidUploadMember) ;
        let members = this.toApiModel(this.state.refundUploadMember) ;
        // console.log(JSON.stringify(members) ) ;
        this.props.createCourseRefundUpload(this.state.courseId,members, this.state.query) ;
        this.handleClose() ;
    };

    handleUploadImage = (member, fileKey) => {
       //this.state.paidUploadMember.fileKey = fileKey;
       console.log(JSON.stringify(this.state.refundUploadMember));
       member.fileKey = fileKey
       this.setState({refundUploadMember: this.state.refundUploadMember});
       console.log(JSON.stringify(this.state.refundUploadMember));
    };

    toApiModel = (refundUploadMember) => {
        return {members : refundUploadMember} ;
    } ;


  	render() {
      console.log(JSON.stringify(this.state.refundUploadMember));
    	const actions = [
	      <FlatButton
	        label="關閉視窗"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	      <FlatButton
	        label="上傳退款資料"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handleRefundUpload}
	      />,
	    ];

    	return (
        <Dialog
          title="課程開班資訊 - 已付款學員資料-上傳退款資料"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            上傳圖檔僅限jpg, jpeg, bmp, gif, png, pdf等格式
            <table className="order-list">
		        <thead>
		          	<tr>
			            <th>NO</th>
			            <th>學員姓名</th>
                  <th>繳費憑證</th>
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.props.refundUploadMember.map( (member, index) => (
		            	<tr key={`RefundUploadMember_${index}`}>
		                	<td>{index}</td>
		                	<td>{member.familyName}{member.firstName}</td>
                      <td>
                          <table>
                          <tr>
                            <td>實際付款日</td>
                            <td> <DatePicker value={moment(member.refundDate).toDate()} onChange={this.handleChangeMemberUploadDate.bind(this, index, member)}/></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>銀行代碼</td>
                            <td> <input type="number" value={member.account.bankCode} onChange={this.handleChangeMemberAccount.bind(this, index, 'bankCode','bankName') } /> </td>
                            <td>銀行名稱</td>
                            <td><input type="text" value={member.account.bankName} disabled="true"/></td>
                          </tr>
                          <tr>
                            <td>分行名稱</td>
                            <td><input type="text" value={member.account.branch} onChange={this.handleChangeMemberAccount.bind(this, index, 'branch', null)}  /> 分行</td>
                            <td>帳號</td>
                            <td><input type="text" value={member.account.accountNum} onChange={this.handleChangeMemberAccount.bind(this, index, 'accountNum', null)} /></td>
                          </tr>
                          <tr>
                            <td>存摺影本</td>
                            <td><input type="text" value={member.fileKey} disabled="true" onChange={this.handleChangeMember.bind(this, index, 'fileKey')} /></td>
                            <td>
                              <Document
                                auth={this.props.auth} 
                                docType="refundImage"
                                convertType="course-image" 
                                onUpload={this.handleUploadImage.bind(this, member)}
                              />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <Document
                                auth={this.props.auth} 
                                docType="refundDoc"
                                convertType="course-application" 
                                onUpload={this.handleUploadImage.bind(this, member)}
                              /></td>
                            <td></td>
                          </tr>
                          </table>
                      </td>
		              	</tr>
		            ))}
		        </tbody>
        	</table>
        </Dialog>
        );
    }
}