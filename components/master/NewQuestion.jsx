import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import tv4 from 'tv4';
import {SCHEMA_NEW_QUESTION} from 'lib/schema';
import {SCHEMA_NEW_QUESTION_OPTION} from 'lib/schema';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import * as CourseActions from 'actions/master/CourseActions';
var config = require('config-prod');

export default class NewQuestion extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		// insert model 
    		question: props.params && props.params.questionId ? props.master.question : this.emptyQuestionModel()

    	};

    	// this.state.question.answerAtrribute = "Y" ;				// TODO 帶欄位修正後 刪除此行
    	if(this.state.question.necessaryAttribute === "all" )
    		this.state.question.necessaryAttributesList = ["pre", "post"] ;
        else
        	if(this.state.question.necessaryAttribute !== undefined)
        		this.state.question.necessaryAttributesList = [this.state.question.necessaryAttribute] ;
            else 
            	this.state.question.necessaryAttributesList = [] ;
    	console.log(JSON.stringify(this.state.question));
	}

	/** load category & courseDef by courseDefId specified in path param */
	static onEnter(store){
	    return (nextState, replace, callback) => {
	        if(nextState.params && nextState.params.questionId){
	          console.log("question id : " + nextState.params.questionId) ;
	          CourseActions.getQuestion(nextState.params.questionId)(store.dispatch, store.getState).then(() => callback());
	        }
	        else callback();
	    }
	}

	static onLeave(store){
	    return () => {
	      	store.dispatch(CourseActions.setQuestion(null));
	    };
	}

	emptyQuestionModel = () => {
    	return {	no:'', 
    		category: 'N',
			type: 'S',
			answerAtrribute: 'Y',
			necessaryAttributesList:[],
			necessaryAttribute: undefined, 
  			option:[{content:'', isElse:false, orderBy: 0}]
  		}
	};

	createQuestion = () => {
		// 敘述題 不需要 option
		if(this.state.question.type == "T") {
	    	this.state.question.option = [];
	    }

	    const question = this.toApiModel(this.state.question);
	    let valid = tv4.validate(question, SCHEMA_NEW_QUESTION);
		if(tv4.error){
			if (tv4.error.message === 'no' || tv4.error.dataPath.indexOf('no') > -1 ) {
				window.alert( "問題編號項目為必填");
			}else if (tv4.error.message === 'category' || tv4.error.dataPath.indexOf('category') > -1) {
				window.alert( "問題類別項目為必填");
			}else if (tv4.error.message === 'necessaryAttribute' || tv4.error.dataPath.indexOf('necessaryAttribute') > -1) {
				window.alert( "問題階段項目為必填");
			}else if (tv4.error.message === 'type' || tv4.error.dataPath.indexOf('type') > -1) {
				window.alert( "問題類型項目為必填");
			}else if (tv4.error.message === 'answerAtrribute' || tv4.error.dataPath.indexOf('answerAtrribute') > -1) {
				window.alert( "問題設定項目為必填");
			}else if (tv4.error.message === 'content' || tv4.error.dataPath.indexOf('content') > -1) {
				window.alert( "題目敘述項目為必填");
			}
		}
	    // if(tv4.error){
	    //   	// window.alert(`${tv4.error.dataPath}: ${tv4.error.message}`);
			// console.log(tv4.error);
			// window.alert(`${tv4.error.message}`);
	    // }
	    else{
			if(this.state.question.type != "T") {
				if(this.state.question.option.length == 0 )
					window.alert("請新增題目選項/其他");
				else {
					let contentErrCount = 0;
					question.option.map((op, index) => {
						if (this.state.question.option[index].content == "") {
							window.alert("選項內容項目為必填");
							contentErrCount++;
						}
					});
					if(contentErrCount == 0) {;
						this.props.createQuestion(question);
						this.props.history.push(`${config.webContext}master/admin/questions`);
					}
				}
			} else {
				this.props.createQuestion(question);
				this.props.history.push(`${config.webContext}master/admin/questions`) ;
			}
	    }
	};

	updateQuestion = () => {
		// 敘述題 不需要 option
		if(this.state.question.type == "T") {
	    	this.state.question.option = [];
	    }

	    const question = this.toApiModel(this.state.question);
	    let valid = tv4.validate(question, SCHEMA_NEW_QUESTION);
		if(tv4.error){
			if (tv4.error.message === 'no' || tv4.error.dataPath.indexOf('no') > -1 ) {
				window.alert( "問題編號項目為必填");
			}else if (tv4.error.message === 'category' || tv4.error.dataPath.indexOf('category') > -1) {
				window.alert( "問題類別項目為必填");
			}else if (tv4.error.message === 'necessaryAttribute' || tv4.error.dataPath.indexOf('necessaryAttribute') > -1) {
				window.alert( "問題階段項目為必填");
			}else if (tv4.error.message === 'type' || tv4.error.dataPath.indexOf('type') > -1) {
				window.alert( "問題類型項目為必填");
			}else if (tv4.error.message === 'answerAtrribute' || tv4.error.dataPath.indexOf('answerAtrribute') > -1) {
				window.alert( "問題設定項目為必填");
			}else if (tv4.error.message === 'content' || tv4.error.dataPath.indexOf('content') > -1) {
				window.alert( "題目敘述項目為必填");
			}
		}
	    // if(tv4.error){
	    //   	// window.alert(`${tv4.error.dataPath}: ${tv4.error.message}`);
			// window.alert(`${tv4.error.message}`);
	    // }
	    else{
	    	if(this.state.question.type != "T") {
	    		if(this.state.question.option.length == 0 )
					window.alert("請新增題目選項/其他");
			    else {
					let contentErrCount = 0;
					question.option.map((op, index) => {
						if (this.state.question.option[index].content == "") {
							window.alert("選項內容項目為必填");
							contentErrCount++;
						}
					});
					if(contentErrCount == 0) {
						this.props.updateQuestion(question);
						this.props.history.push(`${config.webContext}master/admin/questions`);
					}
	    		}
	    	} else {
	    		this.props.updateQuestion(question);
	    		this.props.history.push(`${config.webContext}master/admin/questions`) ;	
	    	}	
	    }
	};

    /** view model to api model (for api access) */
    toApiModel = (question) =>{
	    return Object.assign({}, question,
		    {
		        no : question.no,
				category : question.category,
				necessaryAttribute : question.necessaryAttribute,
				type : question.type,	
				content : question.content,	
				option : question.option
		    }
	    )
    };

	handleNecessaryAttributeCheck = (itemValue, e) => {
		console.log(`${itemValue} checked: ${e.target.checked}`);
		let necessaryAttributesList = this.state.question.necessaryAttributesList;
    	const checked = e.target.checked;
    	if(checked)
      		necessaryAttributesList.push(itemValue);
    	else
      		necessaryAttributesList.splice(necessaryAttributesList.indexOf(itemValue), 1);

	    if(necessaryAttributesList.length == 2) {
      		this.state.question.necessaryAttribute = "all" ;
    	} else {
    		this.state.question.necessaryAttribute = necessaryAttributesList[0] ;
    	}
    	
    	this.setState({question: this.state.question});
    	console.log(JSON.stringify(this.state.question));
  	};

    changeQuestion(field, e){
    	this.state.question[field] = e.target.value;
    	this.setState({question:this.state.question});
    	//console.log(JSON.stringify(this.state.question));
  	}

  	changeQuestionOption = (index, e) => {
    	this.state.question.option[index].content = e.target.value ;
    	this.state.question.option[index].orderBy = index+1 ;
    	this.setState({question:this.state.question});
    	//console.log(JSON.stringify(this.state.question));
  	}

  	isDisabled = (e) => {
  		if(this.state.question.type == "T") {
  			return true ;
  		} else {
  			return false ;
  		}
  	}

  	isDisabledType = (e) => {
  		if(this.state.question.type=="S") {
  			this.state.question.answerAtrribute = 'Y'
  			return true ;
  		} else {
  			return false ;
  		}
  	}

  	isDisabledOnly = (e) => {
  		let isOnly = false ;
  		this.state.question.option.map(op => {
  			if(op.isElse) 
  				isOnly = true
  		}
  		)
  		return isOnly ;
  	}

  	handleAddOption = (e) => {			// 針對 button 要先 preventDefault, 不然會 reflash
        e.preventDefault();
        let inputsToOption = {content:'', isElse:false, orderBy: 0 };
        this.state.question.option.push(inputsToOption);
        this.setState({question:this.state.question});
    }

    handleAddOtherOption = (e) => {			// 針對 button 要先 preventDefault, 不然會 reflash
        e.preventDefault();
        let inputsToOption = {content:'', isElse:true, orderBy: 0 };
        this.state.question.option.push(inputsToOption);
        this.setState({question:this.state.question});
    }

    removeOption(index, e){
    	e.preventDefault();
	    this.state.question.option.splice(index, 1);
	    this.setState({question:this.state.question});
    }

	render() {
    	let childProps = Object.assign({}, this.props);
    	delete childProps.children;
    	return (
        <div id="courseDefs-view">
        	<div>
	            <div className="component-title">
	            	<h4>{this.state.question.id ? '編輯問題' : '新增問題'}</h4>
            		<div className="component-title-btns">
            			{this.state.question.id ? <button onClick={this.updateQuestion}>更新問題</button> : <button onClick={this.createQuestion}>建立問題</button>}
		                <button>取消</button>
		            </div>
		        </div>
	        </div>
	        <form className="component-form">
	        	<fieldset>
	        	    <p/><label className="field">*問題編號:</label> <input type="text" value={this.state.question.no} onChange={this.changeQuestion.bind(this, 'no')}/>
	        	    <p/> <label className="field">*問題類別:</label>
		            <select value={this.state.question.category} onChange={this.changeQuestion.bind(this, 'category')}>
		                <option value="N" >必問題</option>
		                <option value="O" >選擇性</option>
		            </select>

		            <label>*問題階段</label>
		            <input id="pre" type="checkbox" onChange={this.handleNecessaryAttributeCheck.bind(this, "pre")} defaultChecked={this.state.question.necessaryAttribute!==undefined && (this.state.question.necessaryAttribute.indexOf("pre") >= 0 || this.state.question.necessaryAttribute.indexOf("all") >= 0)}/>課前
		            <input id="post" type="checkbox" onChange={this.handleNecessaryAttributeCheck.bind(this, "post")} defaultChecked={this.state.question.necessaryAttribute!==undefined && (this.state.question.necessaryAttribute.indexOf("post") >= 0 || this.state.question.necessaryAttribute.indexOf("all") >= 0 )}/>課後

		            <p/><label>*問題類型</label>
		            <select value={this.state.question.type} onChange={this.changeQuestion.bind(this, 'type')}>
		                <option value="S" >單選</option>
		                <option value="M" >複選</option>
		                <option value="T" >敘述</option>
		            </select>

		            <p/><label>*問題設定</label>
		            <select disabled={this.isDisabledType()} value={this.state.question.answerAtrribute} onChange={this.changeQuestion.bind(this, 'answerAtrribute')}>
		                <option value="Y" >必填</option>
		                <option value="N" >非必填</option>
		            </select>

		            <p/><label className="field">*題目敘述:</label>
		            <textarea value={this.state.question.content} onChange={this.changeQuestion.bind(this, 'content')} />
		            <p/>
            		{this.state.question.option.map((op, index) => {	
            			if(op.isElse) {
            				return <p>其他 <textarea disabled={this.isDisabled()} value={op.content} onChange={this.changeQuestionOption.bind(this, index)} /><button disabled={this.isDisabled()} onClick={this.removeOption.bind(this, index)}>刪除</button></p>
            			} else {
	                    	return <p>選項 {index+1} <textarea disabled={this.isDisabled()} value={op.content} onChange={this.changeQuestionOption.bind(this, index)} /><button disabled={this.isDisabled()} onClick={this.removeOption.bind(this, index)}>刪除</button></p>
            			}
	                })}
	                <button disabled={this.isDisabled()} onClick={this.handleAddOption}>新增選項</button>
	                <button disabled={this.isDisabled() || this.isDisabledOnly()} onClick={this.handleAddOtherOption}>新增其他</button>
	        	</fieldset>
	        </form>
    	    {this.props.children && React.cloneElement(this.props.children, childProps)}
        </div>
        );
    }
}