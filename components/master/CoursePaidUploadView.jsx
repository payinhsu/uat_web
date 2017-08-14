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

export default class CoursePaidUploadView extends React.Component {

	  constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
  	        memberCoursePaidUploadRecord: props.memberCoursePaidUploadRecord, 
            createCoursePaidUpload : props.createCoursePaidUpload,
            courseId : props.courseId,
            query: props.query,
            member : {id: props.memberCoursePaidUploadRecord.member.id,
                      paidDate:props.memberCoursePaidUploadRecord.paidRecords.length >0 ? moment(props.memberCoursePaidUploadRecord.paidRecords[0].paidDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD") , 
                      fileKey:''}    
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          memberCoursePaidUploadRecord: newProps.memberCoursePaidUploadRecord, 
          createCoursePaidUpload : newProps.createCoursePaidUpload,
          courseId : newProps.courseId,
          query: newProps.query,
          member : {id: newProps.memberCoursePaidUploadRecord.member.id,
                      paidDate:newProps.memberCoursePaidUploadRecord.paidRecords.length >0 ? moment(newProps.memberCoursePaidUploadRecord.paidRecords[0].paidDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"), 
                      fileKey:''}
  	    };
  	    this.setState(nextState);
  	};

    handleClose = () => {
        this.setState({open: false});
        this.props.onRequestClose();
    };

    handleChangeMemberUploadDate = ( e, date ) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        let nextMember = this.state.member ;
        nextMember.paidDate = dateStr;
        this.setState({member: nextMember}) ;
    } ;

    handleChangeMember = ( field, e ) => {
        let nextPaidUploadMember = this.state.member;
        nextPaidUploadMember[field] = e.target.value;
        this.setState({member:nextPaidUploadMember});
    } ;

    handlePaidUpload = () => {
        // let model = this.toApiModel(this.state.paidUploadMember) ;
        let members = this.toApiModel(this.state.member) ;
        //console.log("Robin test " + JSON.stringify(members) ) ;
        this.props.createCoursePaidUpload(this.state.courseId,members, this.state.query) ;
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
          title="課程開班資訊 - 已付款學員資料-付款憑證預覽頁"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            學員姓名 : {this.state.memberCoursePaidUploadRecord.member.familyName}{this.state.memberCoursePaidUploadRecord.member.firstName} &nbsp; 班級名稱 : {this.state.memberCoursePaidUploadRecord.courseName}
            <div>
                <table>
                    <tr>
                      <td>實際付款日</td>
                      <td><DatePicker value={moment(this.state.member.paidDate).toDate()} onChange={this.handleChangeMemberUploadDate}/></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><input type="text" value={this.state.member.fileKey} onChange={this.handleChangeMember.bind(this,'fileKey')} /></td>
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
                      <td> <button onClick={this.handlePaidUpload}>新增付款憑證</button></td>
                    </tr>
                </table>
            </div>

            <table className="order-list">
		        <thead>
		          	<tr>
			            <th>實際付款日</th>
			            <th>上傳日期</th>
                  <th>上傳人員</th>
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.state.memberCoursePaidUploadRecord.paidRecords.map( (record, index) => {
                 return (<tr key={`memberCoursePaidUploadRecord_${index}`}>
		                	<td>{record.fileKey === ''? record.paidDate : (<a href={record.filePath} target="_blank">{record.paidDate}</a>)}</td>
		                	<td>{record.uploadDate}</td>
                      <td>{record.uploadAuthor}</td>
		              	</tr>);
                })}
		        </tbody>
        	</table>
        </Dialog>
        );
    }
}