import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import * as CourseActions from 'actions/master/CourseActions';
import * as DefinitionActions from 'actions/master/DefinitionActions'
import tv4 from 'tv4';
import {SCHEMA_NEW_EXAM_QUESTION} from 'lib/schema';
var config = require('config-prod');

export default class ExamQuestion extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		// insert model 
    		examQuestionId : props.params && props.params.examQuestionId ? props.params.examQuestionId : '',
    		examQuestion: props.params && props.params.examQuestionId ? props.master.examQuestion : this.emptyExamQuestionModel()
    	};
    	console.log(this.state.examQuestionId);
	}

	/** load category & courseDef by courseDefId specified in path param */
	static onEnter(store){
	    return (nextState, replace, callback) => {
	    	DefinitionActions.getDefinitions()(store.dispatch, store.getState).then(() => {
	    		console.log("exam question id 2 : " + nextState.params.examQuestionId) ;
		        if(nextState.params && nextState.params.examQuestionId){
		            console.log("exam question id : " + nextState.params.examQuestionId) ;
	          		CourseActions.getExamQuestion(nextState.params.examQuestionId)(store.dispatch, store.getState).then(() => callback());
		        }
		        else callback();
		    });
	    }
	}

	componentDidMount() {
		this.state.examQuestion.option.map((op, index) => {
    		//console.log(index + ' : in : ' + ((index+1) == this.state.examQuestion.answer));
			if( this.state.examQuestion.option[index].isCorrect == true  )  {
				this.state.examQuestion.answer = (index+1) ;
			} 
			this.setState({examQuestion:this.state.examQuestion});
		});
        // console.log('I got answer : ' + this.state.examQuestion.answer) ;
    };

	emptyExamQuestionModel = () => {
	    return {answer: 1, 
		    content:'',
			chapterId: '1',
  			option:[{content:'', isCorrect:false, orderBy: 0}]
  		}
	};

	componentWillReceiveProps = newProps => {
		//console.log(newProps.master.examQuestionId) ;
	    //console.log(newProps.master.examQuestion) ;
	    //console.log( newProps.params && newProps.params.examQuestionId ? newProps.params.examQuestionId : '') ;
	    //console.log(newProps.params && newProps.params.examQuestionId ? newProps.master.examQuestion : this.emptyExamQuestionModel() ) ;
    	this.setState({
	      	examQuestionId : newProps.params && newProps.params.examQuestionId ? newProps.params.examQuestionId : '',
    		examQuestion: newProps.params && newProps.params.examQuestionId ? newProps.master.examQuestion : this.emptyExamQuestionModel() 
	    });

    };

	static onLeave(store){
	    return () => {
	      	store.dispatch(CourseActions.setExamQuestion(null));
	    };
	}

	createExamQuestion = () => {

	    const examQuestion = this.toApiModel(this.state.examQuestion);
	    console.log(JSON.stringify(this.state.examQuestion));
		let valid = tv4.validate(examQuestion, SCHEMA_NEW_EXAM_QUESTION);
		if(tv4.error){
			if (tv4.error.message === 'answer' || tv4.error.dataPath.indexOf('answer') > -1 ) {
				window.alert( "考題答案項目為必填");
			}else if (tv4.error.message === 'chapterId' || tv4.error.dataPath.indexOf('chapterId') > -1) {
				window.alert( "課程單元項目為必填");
			}else if (tv4.error.message === 'content' || tv4.error.dataPath.indexOf('content') > -1) {
				window.alert( "題目敘述項目為必填");
			}
		}
		// if(tv4.error){
		// 	tv4.setErrorReporter(function (error, data, SCHEMA_NEW_QUESTION) {
		// 		if (error.params.key === 'answer') {
		// 			return "問題編號項目為必填";
		// 		}else if (error.params.key === 'chapterId') {
		// 			return "問題類別項目為必填";
		// 		}else if (error.params.key === 'content') {
		// 			return "問題階段項目為必填";
		// 		}
		// 	});
		// 	// window.alert(`${tv4.error.dataPath}: ${tv4.error.message}`);
		// 	window.alert(`${tv4.error.message}`);
		// }
		else {
			let contentErrCount = 0;
			if (this.state.examQuestion.option.length == 0) {
				window.alert("請新增考題選項");
				contentErrCount++;
			}

			examQuestion.option.map((op, index) => {
				if (this.state.examQuestion.option[index].content == "") {
					window.alert("選項內容項目為必填");
					contentErrCount++;
				}
			});
			if(contentErrCount == 0) {
				this.props.createExamQuestion(examQuestion);
				this.props.history.push('/master/admin/examQuestions');
			}
		}
	};

	updateExamQuestion = () => {

	    const examQuestion = this.toApiModel(this.state.examQuestion);
	    console.log(JSON.stringify(this.state.examQuestion));
		let valid = tv4.validate(examQuestion, SCHEMA_NEW_EXAM_QUESTION);
		// if(tv4.error){
		// 	window.alert(`${tv4.error.dataPath}: ${tv4.error.message}`);
		// }
		if(tv4.error){
			if (tv4.error.message === 'answer' || tv4.error.dataPath.indexOf('answer') > -1 ) {
				window.alert( "考題答案項目為必填");
			}else if (tv4.error.message === 'chapterId' || tv4.error.dataPath.indexOf('chapterId') > -1) {
				window.alert( "課程單元項目為必填");
			}else if (tv4.error.message === 'content' || tv4.error.dataPath.indexOf('content') > -1) {
				window.alert( "題目敘述項目為必填");
			}
		}
		else {
			let contentErrCount = 0;
			if (this.state.examQuestion.option.length == 0) {
				window.alert("請新增考題選項");
				contentErrCount++;
			}
			examQuestion.option.map((op, index) => {
				if (this.state.examQuestion.option[index].content == "") {
					window.alert("選項內容項目為必填");
					contentErrCount++;
				}
			});
			if(contentErrCount == 0) {
				console.log("ready to update ... ");
				this.props.updateExamQuestion(examQuestion, this.state.examQuestionId);
				console.log("ready to leave ... ");
				this.props.history.push('/master/admin/examQuestions');
			}
		}
	};

	/** view model to api model (for api access) */
    toApiModel = (examQuestion) =>{
    	//console.log(examQuestion.option);
    	//console.log(this.state.examQuestion.answer) ;
    	examQuestion.option.map((op, index) => {
    		//console.log(index + ' : in : ' + ((index+1) == this.state.examQuestion.answer));
			if( (index+1) == this.state.examQuestion.answer )  {
				this.state.examQuestion.option[index].isCorrect = true ;
			} else {
				this.state.examQuestion.option[index].isCorrect = false ;
			}
			this.state.examQuestion.option[index].orderBy = index+1 ;
			this.setState({examQuestion:this.state.examQuestion});
		});
		
	    return Object.assign({}, examQuestion,
		    {
				chapterId : examQuestion.chapterId,
				content : examQuestion.content,	
				option : examQuestion.option
		    }
	    )
    };

	changeExamQuestion(field, e){
    	this.state.examQuestion[field] = e.target.value;
    	this.setState({examQuestion:this.state.examQuestion});
  	}

  	changeExamQuestionOption = (index, e) => {
    	this.state.examQuestion.option[index].content = e.target.value ;
    	this.setState({examQuestion:this.state.examQuestion});
  	}

  	handleAddOption = (e) => {			// 針對 button 要先 preventDefault, 不然會 reflash
        e.preventDefault();
        let inputsToOption = {content:'', isCorrect:false, orderBy: 0 };
        this.state.examQuestion.option.push(inputsToOption);
        this.setState({examQuestion:this.state.examQuestion});
    }

    removeOption(index, e){
    	e.preventDefault();
	    this.state.examQuestion.option.splice(index, 1);
	    // console.log(parseInt(this.state.examQuestion.answer)) ;
	    // console.log(index) ;
	    if(parseInt(this.state.examQuestion.answer) == (index+1)) {
	    	console.log('answer was del') ;
	    	this.state.examQuestion.answer = 1 ;
	    }
	    this.setState({examQuestion:this.state.examQuestion});
    }

    handleCancel = () => {
  		this.props.history.push(`${config.webContext}master/admin/examQuestions`);
  	}

	render() {
    	let childProps = Object.assign({}, this.props);
    	delete childProps.children;
    	if(this.state.examQuestion == null) {
    		this.state.examQuestion = this.emptyExamQuestionModel() ;
    	}
    	return (
        <div id="courseDefs-view">
        	<div>
	            <div className="component-title">
	            	<h4>{this.state.examQuestionId ? '編輯考題' : '新增考題'}</h4>
            		<div className="component-title-btns">
            			{this.state.examQuestionId ? <button onClick={this.updateExamQuestion}>更新考題</button> : <button onClick={this.createExamQuestion}>建立考題</button>}
		                <button onClick={this.handleCancel.bind()}>取消</button>
		            </div>
		        </div>
	        </div>
	        <form className="component-form">
	        	<fieldset>
	        	    <p/><label className="field">*考題編號:</label> <input type="text" value={this.state.examQuestionId} disabled="true"/>
	        	    <p/><label className="field">*考題答案:</label>
		            <select value={this.state.examQuestion.answer} onChange={this.changeExamQuestion.bind(this, 'answer')}>
		                {this.state.examQuestion.option.map((op, index) => {
		                	return <option value={index+1}>{index+1}</option>
		                })}
		            </select>
		            <p/><label>*課程單元:</label>
					<select value={this.state.examQuestion.chapterId} onChange={this.changeExamQuestion.bind(this, 'chapterId')}>
		                {this.props.master.definition.chapters.map((chapter, index) => {
		                	return <option value={chapter.id}>{chapter.name}</option>
		                })}
		            </select>
		            <p/><label className="field">*題目敘述:</label>
		            <textarea value={this.state.examQuestion.content} onChange={this.changeExamQuestion.bind(this, 'content')} />
		            <p/>
            		{this.state.examQuestion.option.map((op, index) => {	
            			
	                    return <p>選項 {index+1} <textarea value={op.content} onChange={this.changeExamQuestionOption.bind(this, index)} /><button onClick={this.removeOption.bind(this, index)}>刪除</button></p>
            			
	                })}
	                <button onClick={this.handleAddOption}>新增選項</button>
	        	</fieldset>
	        </form>
    	    {this.props.children && React.cloneElement(this.props.children, childProps)}
        </div>
        );
    }
}