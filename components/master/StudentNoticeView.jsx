import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
var config = require('config-prod');

export default class StudentNoticeView extends React.Component {

	constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            noticeView : props.noticeView,
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          noticeView: newProps.noticeView,
  	    };
  	    this.setState(nextState);
  	};

    handleClose = () => {
        this.setState({open: false});
        this.props.onRequestClose();
    };

  	render() {
    	const actions = [
	      <FlatButton
	        label="關閉視窗"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	    ];

    	return (
        <Dialog
          title="課程開班資訊 - 已付款學員資料-訊息讀取紀錄"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            學員姓名 : {this.state.noticeView.member.familyName}{this.state.noticeView.member.firstName} &nbsp; 班級名稱 : {this.state.noticeView.courseName} 
            <table className="order-list">
    		        <thead>
    		          	<tr>
      			            <th>訊息內容</th>
      			            <th>發布日期</th>
                        <th>發布人員</th>
                        <th>讀取日期</th>
    			       	  </tr>
    		        </thead>
    	          <tbody>
    	            	{this.state.noticeView.notices.map( (notice, index) => (
    		                <tr key={`notice_${index}`}>
    		                    <td>{notice.text}</td>
    		                    <td>{notice.postBy.createDate}</td>
                            <td>{notice.postBy.familyName}{notice.postBy.firstName}</td>
                            <td>{notice.readDate? notice.readDate: '---'}</td>
    		                </tr>
    		            ))}
    		        </tbody>
        	  </table>
        </Dialog>
        );
    }
}