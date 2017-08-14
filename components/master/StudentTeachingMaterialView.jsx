import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
var config = require('config-prod');

export default class StudentTeachingMaterialView extends React.Component {

	  constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            teachingMaterialView: props.teachingMaterialView, 
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open,
          teachingMaterialView: newProps.teachingMaterialView, 
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
          title="課程開班資訊 - 已付款學員資料-教材下載紀錄頁"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            學員姓名 : {this.state.teachingMaterialView.member.familyName}{this.state.teachingMaterialView.member.firstName} &nbsp; 班級名稱 : {this.state.teachingMaterialView.courseName}
            <table className="order-list">
		        <thead>
		          	<tr>
			            <th>下載日期</th>
			            <th>教材名稱</th>
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.state.teachingMaterialView.teachingMaterials.map( (tm, index) => (
		            	<tr key={`teachingMaterialView_${index}`}>
		                	<td>{tm.viewDate}</td>
		                	<td>{tm.name}</td>
		              	</tr>
		            ))}
		        </tbody>
        	</table>
        </Dialog>
        );
    }
}