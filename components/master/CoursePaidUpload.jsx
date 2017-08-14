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

export default class CoursePaidUpload extends React.Component {

	  constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            paidUploadMember : props.paidUploadMember,
            courseId : props.courseId,
            createCoursePaidUpload : props.createCoursePaidUpload,
            query: props.query,
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          paidUploadMember : newProps.paidUploadMember,
          courseId : newProps.courseId,
          createCoursePaidUpload : newProps.createCoursePaidUpload,
          query: newProps.query,
  	    };
        //console.log("sub : " + JSON.stringify(this.state.paidUploadMember) );
  	    this.setState(nextState);
  	};

    handleClose = () => {
        this.setState({open: false});
        this.props.onRequestClose();
    };

    handleChangeMemberUploadDate = (index, member, e, date ) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        let nextPaidUploadMember = this.state.paidUploadMember ;
        nextPaidUploadMember[index].paidDate = dateStr
        this.setState({paidUploadMember: nextPaidUploadMember}) ;
    };

    handlePaidUpload = () => {
        // let model = this.toApiModel(this.state.paidUploadMember) ;
        let members = this.toApiModel(this.state.paidUploadMember) ;
        // console.log(JSON.stringify(members) ) ;
        this.props.createCoursePaidUpload(this.state.courseId,members, this.state.query) ;
        this.handleClose() ;
    };

    handleUploadImage = (member, fileKey) => {
       //this.state.paidUploadMember.fileKey = fileKey;
       member.fileKey = fileKey
       this.setState({paidUploadMember: this.state.paidUploadMember});
       console.log(JSON.stringify(this.state));
    };

    toApiModel = (paidUploadMember) => {
        return {members : paidUploadMember} ;
    }

    handleChangeMember = (index, field, e) => {
        let nextPaidUploadMember = this.state.paidUploadMember;
        nextPaidUploadMember[index][field] = e.target.value;
        this.setState({paidUploadMember:nextPaidUploadMember});
    };

  	render() {
      console.log("sub : " + JSON.stringify(this.state.paidUploadMember)) ;   
    	const actions = [
	      <FlatButton
	        label="關閉視窗"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	      <FlatButton
	        label="上傳付款憑證"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handlePaidUpload}
	      />,
	    ];

    	return (
        <Dialog
          title="課程開班資訊 - 已付款學員資料-上傳付款憑證"
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
	            	{this.state.paidUploadMember.map( (member, index) => (
		            	<tr key={`PaidUploadMember_${index}`}>
		                	<td>{index}</td>
		                	<td>{member.familyName}{member.firstName}</td>
                      <td>
                        <table>
                        <tr>
                          <td>實際付款日</td>
                          <td> <DatePicker value={moment(member.paidDate).toDate()} onChange={this.handleChangeMemberUploadDate.bind(this, index, member)}/></td>
                        </tr>
                        <tr>
                          <td><input type="text" value={member.fileKey} onChange={this.handleChangeMember.bind(this, index, 'fileKey')} /></td>
                          <td><Document
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