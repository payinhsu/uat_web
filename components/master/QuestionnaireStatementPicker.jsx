import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';

export default class QuestionnaireStatementPicker extends React.Component {

  	constructor(props) {
  	    super(props);
  	    this.state = {
  	      open: props.open,
  	      question: props.question
  	    };
        console.log("robin question : " + JSON.stringify(this.state.question)) ;
  	}
	
  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open
  	    };
  	    nextState.question = newProps.question;
  	    this.setState(nextState);
  	};

  	handleClose = () => {
  	    this.setState({open: false});
  	    this.props.onRequestClose();
	  };

	  handleConfirm = () => {
  	    this.props.onConfirm();
  	    this.handleClose();
  	    this.resetState();
	  };

	  resetState(){

    }

    showView = (question) => {
        if(question.type == "T") {
            return (
                question.answerTextList.map( (answer, index) => (
                    <div>
                    <fieldset>
                        <p>{answer.familyName}{answer.firstName}  - {answer.date}</p>
                        <p>答覆 : {answer.content}</p> 
                    </fieldset>
                    </div>
                ))
            )
        }
    }

	render() {
    	const actions = [
	      <FlatButton
	        label="確認"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.handleConfirm}
	      />,
	    ];

    	return (
        <Dialog
          title={this.props.question.content}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
	      { this.showView(this.props.question) }
        </Dialog>
        );
    }
}