import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
var config = require('config-prod');

export default class QuestionPicker extends React.Component {

  	constructor(props) {
  	    super(props);
  	    this.state = {
  	      open: props.open,
  	      activity: props.activity
  	    };
  	}
	
  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open
  	    };
  	    nextState.questions = newProps.questions;
  	    nextState.activity = newProps.activity;
  	    this.setState(nextState);
  	};

	  handleQuestionCheck = (itemValue, e) => {
		    console.log(`${itemValue} checked: ${e.target.checked}`);
		    let activity = this.state.activity;
    	  const checked = e.target.checked;
    	  if(checked)
      	  	activity.questionIds.push(itemValue);
    	  else
      		  activity.questionIds.splice(activity.questionIds.indexOf(itemValue), 1);
    	
    	  this.setState({activity: this.state.activity});
    	  console.log(JSON.stringify(this.state.activity.questionIds));
  	};

  	handleQuestionAllCheck = (e) => {
  		  console.log(`All checked: ${e.target.checked}`);
    		let activity = this.state.activity;
    		let questions = this.state.questions ;
    		const checked = e.target.checked;
    	  if(checked) {
    		  questions.map ( question =>  {
    		  		let necessary = this.switchQuestion(question) ;
        			if(!necessary == "All" && !(necessary == this.state.activity.questionnaireType)) {
        				  activity.questionIds.splice(activity.questionIds.indexOf(question.id), 1);
        			}
    		  });
    		  questions.map ( question =>  {
    		  		if(activity.questionIds.indexOf(question.id) == -1)
    		  		    activity.questionIds.push(question.id);
    		  });
    	  } else {
        		questions.map ( question =>  {
        			let necessary = this.switchQuestion(question) ;
        			if(!(necessary == "All") && !(necessary == this.state.activity.questionnaireType)) {
        				  activity.questionIds.splice(activity.questionIds.indexOf(question.id), 1);
        			}
        		});	
      	}
      	
    	this.setState({activity: this.state.activity});
    	console.log(JSON.stringify(this.state.activity.questionIds));
  	};

  	handleClose = () => {
  	    this.setState({open: false});
  	    this.props.onRequestClose();
	  };

	  handleConfirm = () => {
  	    //console.log('questions confirm > ' + JSON.stringify(this.state.questions));
  	    this.props.onConfirm(this.state.questions, this.state.activity.questionIds);
  	    this.handleClose();
  	    this.resetState();
	  };

	  resetState(){
        // this.state.activity.questionIds = [] ;
        // this.setState({activity: this.state.activity});
    }

  	isDisabled = (question, e) => {
        let necessary = this.switchQuestion(question) ;
        if(necessary == "All") 
            return true ;
        else if (necessary == this.state.activity.questionnaireType)
            return true ;
        else 
            return false ; 		 	
  	};

  	switchQuestion = (question) => {
    		switch (question.necessaryAttribute) {
    			case "課前/課後" :
    				return "All"
     			case "課前" :
     				return "pre"
     			case "課後" :
     				return "post"
    			default :
    				"x"; 				 				
    		}
  	};

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
          <Link to={`${config.webContext}master/admin/newQuestion`}>新增問題</Link>  
          <form>
            <table className="schedule-edit-table">
		        <thead>
		          	<tr>
		          		<th><input id="all" type="checkbox" onChange={this.handleQuestionAllCheck}/>全選</th>
			            <th>問題編號</th>
			            <th>問題類別</th>
			            <th>問題類型</th>
			            <th>問題標題</th>	    
			       	</tr>
		        </thead>
	          	<tbody>
	            	{this.props.questions.map( (question, index) => (
		              <tr key={`activity_question_${index}`}>
		                <td><input type="checkbox" onChange={this.handleQuestionCheck.bind(this, question.id)} disabled={this.isDisabled(question)} checked={this.state.activity.questionIds.indexOf(question.id) >= 0} /> </td>
		                <td>{question.no}</td>
		                <td>{question.category}</td>
		                <td>{question.type}</td>
		                <td>{question.content}</td>
		              </tr>
		            ))}
		        </tbody>
        	</table>
    	  </form>
        </Dialog>
        );
    }
}