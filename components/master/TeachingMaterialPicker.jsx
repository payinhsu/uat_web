import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
var config = require('config-prod');

export default class TeachingMaterialPicker extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      open: props.open,
	      checkTMList: []
	    };
	    
	}

	componentWillReceiveProps = newProps => {
	    let nextState = {
	      open: newProps.open
	    };
	    nextState.teachingMaterials = newProps.teachingMaterials;
	    
	    this.setState(nextState);
	};

	handleTeachingMaterialsCheck = (itemValue, e) => {
		console.log(`${itemValue} checked: ${e.target.checked}`);
		let checkTMList = this.state.checkTMList;
    	const checked = e.target.checked;
    	if(checked)
      		checkTMList.push(itemValue);
    	else
      		checkTMList.splice(checkTMList.indexOf(itemValue), 1);
    	
    	this.setState({checkTMList: this.state.checkTMList});
    	console.log(JSON.stringify(this.state.checkTMList));
  	};

  	handleTeachingMaterialsAllCheck = (e) => {
  		console.log(`All checked: ${e.target.checked}`);
		let checkTMList = this.state.checkTMList;
		let teachingMaterials = this.state.teachingMaterials ;
		const checked = e.target.checked;
    	if(checked) {
    		teachingMaterials.map ( teachingMaterial =>  {
    			checkTMList.splice(checkTMList.indexOf(teachingMaterial.id), 1);
    		});
    		teachingMaterials.map ( teachingMaterial =>  {
    			checkTMList.push(teachingMaterial.id);
    		});
    	} else {
    		teachingMaterials.map ( teachingMaterial =>  {
    			checkTMList.splice(checkTMList.indexOf(teachingMaterial.id), 1);
    		});	
      	}
      	
    	this.setState({checkTMList: this.state.checkTMList});
    	console.log(JSON.stringify(this.state.checkTMList));
  	};

  	handleClose = () => {
	    this.setState({open: false});
	    this.props.onRequestClose();
	};

	handleConfirm = () => {
	    console.log('teachingMaterials confirm > ' + JSON.stringify(this.state.teachingMaterials));
	    this.props.onConfirm(this.state.teachingMaterials, this.state.checkTMList);
	    this.handleClose();
	    this.resetState();
	};

	resetState(){
        this.setState({checkTMList: []});
    }

	render() {
    	const actions = [
	      <FlatButton
	        label="取消"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	      <FlatButton
	        label="確認"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handleConfirm}
	      />,
	    ];

    	return (
        <Dialog
          title="選擇教材"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
          
          <form>
            <table className="schedule-edit-table">
		        <thead>
		          	<tr>
		          		<th><input id="all" type="checkbox" onChange={this.handleTeachingMaterialsAllCheck}/>全選</th>
			            <th>教材編號</th>
			            <th>教材名稱</th>
			            <th>教材作者</th>
			            <th>課程分類</th>	    
                        <th>格式</th>
                        <th>更新日期</th>
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.props.teachingMaterials.map( (teachingMaterial, index) => (
		              <tr key={`activity_teachingMaterial_${index}`}>
		                <td><input type="checkbox" onChange={this.handleTeachingMaterialsCheck.bind(this, teachingMaterial.id)} checked={this.state.checkTMList.indexOf(teachingMaterial.id) >= 0} /></td>
		                <td>{teachingMaterial.no}</td>
		                <td>{teachingMaterial.name}</td>
		                <td>{teachingMaterial.author}</td>
		                <td>{teachingMaterial.category}</td>
                        <td>{teachingMaterial.fileFormat}</td>
                        <td>{teachingMaterial.updateDate}</td>
		              </tr>
		            ))}
		        </tbody>
        	</table>
          </form>
        </Dialog>
        );
    }
}