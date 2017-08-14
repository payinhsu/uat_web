import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
var config = require('config-prod');

export default class StudentAttendDateView extends React.Component {

	constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            attendDateView: props.attendDateView
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          attendDateView: newProps.attendDateView
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
          title="課程開班資訊 - 已付款學員資料-出席紀錄頁"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            學員姓名 : {this.state.attendDateView.member.familyName}{this.state.attendDateView.member.firstName} &nbsp; 班級名稱 : {this.state.attendDateView.courseName}
            <table className="order-list">
    		        <thead>
    		          	<tr>
    			            <th>出席日期</th>
    			            <th>登記人員</th>
                      <th>登記日期</th>
    			       	</tr>
    		        </thead>
    	          <tbody>
    	            	{this.state.attendDateView.attendances.map( (attend, index) => (
    		                <tr key={`attendDateView_${index}`}>
    		                    <td>{attend.attendDate}</td>
    		                    <td>{attend.updateAuthor}</td>
                            <td>{attend.recordDate}</td>
    		                </tr>
    		            ))}
    		        </tbody>
        	  </table>
        </Dialog>
        );
    }
}