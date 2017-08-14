import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import TeachingMaterialPicker from 'components/master/TeachingMaterialPicker';
import QuestionPicker from 'components/master/QuestionPicker';

import * as CourseActions from 'actions/master/CourseActions';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import moment from 'moment';
var config = require('config-prod');

export default class NewActivity extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
    		// dialog control
      		openTeachingMaterialPicker:false,
      		openQuestionPicker : false,

    		// insert model 
    		course : props.master.course,
    		activity: props.params && props.params.activityId ? props.master.activity : this.emptyActivityModel(), 
        startDate: props.params && props.params.activityId ? props.master.activity.startDate : new Date()
    	};
      this.state.activity.teachingMaterialIds = this.state.activity.teachingMaterials.map ((tm, index) => tm.id) ;
      this.state.activity.teachingMaterialShowViews = this.state.activity.teachingMaterials.map ((tm, index) => tm.allowView) ;
    	//console.log(JSON.stringify(this.state.course));
    	console.log(JSON.stringify(this.state.activity));
    	console.log(this.state.activity.checkTMList);
	}

  componentWillReceiveProps = newProps => {
    //console.log(newProps.master.examQuestionId) ;
      //console.log(newProps.master.examQuestion) ;
      //console.log( newProps.params && newProps.params.examQuestionId ? newProps.params.examQuestionId : '') ;
      //console.log(newProps.params && newProps.params.examQuestionId ? newProps.master.examQuestion : this.emptyExamQuestionModel() ) ;
      this.setState({
          // dialog control
          openTeachingMaterialPicker:false,
          openQuestionPicker : false,

        // insert model 
        course : newProps.master.course,
        activity: newProps.params && newProps.params.activityId ? newProps.master.activity : this.emptyActivityModel()
      });

      this.state.activity.teachingMaterialIds = this.state.activity.teachingMaterials.map ((tm, index) => tm.id) ;
      this.state.activity.teachingMaterialShowViews = this.state.activity.teachingMaterials.map ((tm, index) => tm.allowView) ;
      console.log(JSON.stringify(this.state.activity)) ;
    };

  static onLeave(store){
      return () => {
          store.dispatch(CourseActions.setActivity(null));
      };
  }

	static onEnter(store){
	    return (nextState, replace, callback) => {
	        if(nextState.params && nextState.params.courseId){
	            CourseActions.getCourse(nextState.params.courseId)(store.dispatch, store.getState).then(() =>{
	            	CourseActions.getTeachingMaterials()(store.dispatch, store.getState).then(() => {
	            		CourseActions.getQuestions()(store.dispatch, store.getState).then(() => {
                    CourseActions.getExamQuestions()(store.dispatch, store.getState).then(() => {
                      if(nextState.params && nextState.params.activityId){
                          console.log("activity id : " + nextState.params.activityId) ;
                          CourseActions.getActivity(nextState.params.courseId, nextState.params.activityId)(store.dispatch, store.getState).then(() => callback());
                      } else {
                        callback();
                      } 
                    });
	            		})	
         				})
        			})
	        }
	        else callback();
	    }
	}

	emptyActivityModel = () => { 
		return {
	    	name : '',			// 活動名稱
	    	type : 'Q',			// 活動類型
		    questionnaireType : 'pre', // 問卷類型
		    status : '1',
		    startDate : moment().format("YYYY-MM-DD"),
		    endDate : moment().format("YYYY-MM-DD"),
		    description: '',
		    orderBy: 0,
		    questionIds : [], 
		    teachingMaterialIds:[], 
        teachingMaterialShowViews : [], 
        teachingMaterials : [] 
		}
	};

	  onCloseTeachingMaterialPicker = () => {
      this.setState({openTeachingMaterialPicker:false});
  	}

  	onCloseQuestionPicker = () => {
      this.setState({openQuestionPicker:false});
  	}

  	onConfirmTeachingMaterial = (teachingMaterials, teachingMaterialIds) => {
        console.log("teachingMaterialIds : " + teachingMaterialIds) ;
        this.onClosePicker();
        this.setState({teachingMaterials});
        this.setState({teachingMaterialIds});
        this.state.activity.teachingMaterialIds = teachingMaterialIds ;
    }

    onConfirmQuestion = (questions, questionIds) => {
        console.log("questionIds : " + questionIds) ;
        this.onClosePicker();
        this.setState({questions});
        this.setState({questionIds});
        this.state.activity.questionIds = questionIds ;
    }

    onClosePicker = () => {
      this.setState({
        openTeachingMaterialPicker:false,
        openQuestionPicker:false
      });
    };

	handleChangeActivityDate = (field, e, date) => {
	    const dateStr = moment(date).format("YYYY-MM-DD");
	    let nextActivity = Object.assign({}, this.state.activity);
	    nextActivity[field] = dateStr;
	    this.setState({activity:nextActivity});
	    console.log(JSON.stringify(this.state.activity));
	};

	changeActivity(field, e){
		console.log(e.target.value) ;
    	this.state.activity[field] = e.target.value;
    	if(field == "questionnaireType") {
    		this.state.activity.teachingMaterialIds = [];
    		this.state.activity.questionIds = [];
    	}

    	this.setState({activity:this.state.activity});
    	console.log(JSON.stringify(this.state.activity));
  	};

    handleCreateActivityDetail = (courseId, e) => {
        e.preventDefault();
        if(this.state.activity.questionnaireType == "t") {
        	this.setState({openTeachingMaterialPicker:true});
        	//this.props.history.push(`/master/admin/course/${courseId}/activityTeachingMaterial/detail`);
        } else {
        	this.defaultCheck() ;
        	this.setState({openQuestionPicker:true});
        	//this.props.history.push(`/master/admin/course/${courseId}/activityQuestion/detail`);	
        }
        
    };

    defaultCheck = () => {
        let necessary = "" ;
        this.state.activity.questionIds = [] ;
        let activity = this.state.activity ;
        this.props.master.questions.map( (question, index) => {
            necessary = this.switchQuestion(question) 
            if(necessary == "All") {
            	if(activity.questionIds.indexOf(question.id) == -1)
                	activity.questionIds.push(question.id) ;
            } else {
                if(this.state.activity.questionnaireType == necessary) {
                	if(activity.questionIds.indexOf(question.id) == -1)
                    	activity.questionIds.push(question.id) ;
                } else {
                    if(activity.questionIds.indexOf(question.id) >= 0)
                        activity.questionIds.splice(this.state.activity.questionIds.indexOf(question.id), 1) ;
                }
            }
            this.setState({activity:activity})
        }) ;
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

  	handleCreateActivity = (courseId) => {
  		this.toApiModel();
  		console.log("this.state.activity : "+JSON.stringify(this.state.activity));
  		console.log("this.state.course.id : "+ courseId);
      if(parseInt(this.state.activity.questionCount) > this.props.master.examQuestions.length) {
          alert("擁有的測驗題數小於輸入值") ;
      } else {
          this.props.createCourseActivity(courseId, this.state.activity);
          this.props.history.push(`${config.webContext}master/admin/course/${courseId}/activities`);  
      }
  		
  	}

    handleUpdateActivity = (courseId) => {
      this.toApiModel() ;
      console.log("this.state.activity : "+JSON.stringify(this.state.activity));
      console.log("this.state.course.id : "+ courseId);
      console.log("this.state.activity.id : "+this.state.activity.id);
      var nowTime = new Date();
      // nowTime = new Date(nowTime.getFullYear()+"-"+(nowTime.getMonth() + 1)+"-"+nowTime.getDate());
      var startDate = new Date(this.state.startDate);
      console.log(nowTime) ;
      console.log(startDate) ;
      console.log(nowTime > startDate) ;
      if(nowTime > startDate){
        window.alert("活動已開始，無法更新課程活動");
      }else{
          if(this.state.activity.questionCount > this.props.master.examQuestions.length) {
            alert("擁有的測驗題數小於輸入值") ;
          } else {
            this.props.updateCourseActivity(courseId, this.state.activity.id, this.state.activity);
            this.props.history.push(`${config.webContext}master/admin/course/${courseId}/activities`);
          }
      }
    }

  	toApiModel = () =>{
  		let activity = this.state.activity;
  			activity.orderBy = parseInt(activity.orderBy) ;
  			//console.log("activity.type : "+activity.type);
  			// console.log("activity.questionnaireType : "+activity.questionnaireType);
  			if(activity.questionnaireType == "t"){
  				activity.type = "T";
          activity.teachingMaterials = activity.teachingMaterialIds.map ((id, index) => {
              console.log(id);
              console.log(activity.teachingMaterialShowViews[index]);
              let allowView = activity.teachingMaterialShowViews[index] ;
              return { id, allowView } ;
            }
          );
          console.log("activity.teachingMaterials : " + JSON.stringify(activity.teachingMaterials));
  				//console.log("activity.questionnaireType AFTER: "+activity.questionnaireType);
  				//console.log("activity.type AFTER: "+activity.type);
  			}else if(activity.questionnaireType == "pre" || activity.questionnaireType == "post") {
  				activity.type = "Q";
  				//console.log("activity.questionnaireType AFTER: "+activity.questionnaireType);
  				//console.log("activity.type AFTER: "+activity.type);
  			} else if(activity.questionnaireType == "e") {
          activity.type = "E";
          activity.passScore = parseFloat(activity.passScore) ;
        }
  			//activity.questionIds = activity.checkQList;
		    //activity.teachingMaterialIds = activity.checkTMList;
  		
  		this.setState({activity:activity})
  	}

  	handleCancel = (courseId) => {
  		this.props.history.push(`${config.webContext}master/admin/course/${courseId}/activities`);
  	}

    changeTeachingMaterialShowViews(idx, e) {
      console.log(e.target.value) ;
      this.state.activity.teachingMaterialShowViews[idx] = (e.target.value == "true") ;

      this.setState({activity:this.state.activity});
      console.log(JSON.stringify(this.state.activity));
    } 

    generateView = (activity) => {
    	//console.log(JSON.stringify(activity));
    	if(activity.teachingMaterialIds.length == 0) {return (
	        <div></div>
	      )
    	}

    	let chooseTeachingMaterials = [] ;
    	this.props.master.teachingMaterials.map( (teachingMaterial) => {
    		if(activity.teachingMaterialIds.indexOf(teachingMaterial.id) >= 0) {
    			chooseTeachingMaterials.push(teachingMaterial) ;
        }
    	}) ;
    	// console.log(JSON.stringify(chooseTeachingMaterials));
    	return (
    		<div>
    		<fieldset>
	        	<table className={"order-list"}>
			        <thead>
			          	<tr>	
                    <th>NO</th>		
                    <th>設定</th>
				            <th>教材編號</th>
				            <th>教材名稱</th>
				            <th>教材作者</th>
				            <th>課程分類</th>	    
	                  <th>格式</th>
	                  <th>更新日期</th>
				       	</tr>
			        </thead>
		          	<tbody>
		            	{chooseTeachingMaterials.map( (teachingMaterial, index) => (
		            			<tr key={`activity_teachingMaterial_${index}`}>
                          <td>{index}</td>
                          <td><input type="radio" value={true} name={`test_${index}`} onChange={this.changeTeachingMaterialShowViews.bind(this, index)}  checked={this.state.activity.teachingMaterialShowViews[index] == true}/>提供下載<br/>
                              <input type="radio" value={false} name={`test_${index}`} onChange={this.changeTeachingMaterialShowViews.bind(this, index)}  checked={this.state.activity.teachingMaterialShowViews[index] == false}/>不提供下載
                          </td>
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
	        </fieldset>
	        </div>
    	)
    } ;

    generateView2 = (activity) => {
    	//console.log(JSON.stringify(activity));
    	if(activity.questionIds.length == 0) {return (
	        <div></div>
	      )
    	}

    	let chooseQuestions = [] ;
    	this.props.master.questions.map( (question) => {
    		if(activity.questionIds.indexOf(question.id) >= 0) 
    			chooseQuestions.push(question) ;
    	}) ;
    	//console.log(JSON.stringify(chooseQuestions));
    	return (
    		<div>
    		<fieldset>
	        	<table className={"order-list"}>
			        <thead>
			          	<tr>			
				            <th>NO</th>
				            <th>問題編號</th>
				            <th>問題類別</th>
				            <th>問題類型</th>
				            <th>問題標題</th>	    
				       	</tr>
			        </thead>
		          	<tbody>
		            	{chooseQuestions.map( (question, index) => (
		            			<tr key={`activity_teachingMaterial_${index}`}>
					                <td>{index}</td>
					                <td>{question.no}</td>
					                <td>{question.category}</td>
					                <td>{question.type}</td>
			                        <td>{question.content}</td>
					            </tr>		   
			            ))}
			        </tbody>
	        	</table>
	        </fieldset>
	        </div>
    	)
    } ;
    generateView3 = (activity) => {
        if(activity.questionnaireType != 'e') {return (
            <div></div>
          )
        }

        return (
        <div>
        <fieldset>
          <p/><label className="field">通過分數: </label> <input type="text" value={this.state.activity.passScore} onChange={this.changeActivity.bind(this, 'passScore')}/>
          <p/><label className="field">測驗題數: </label> <input type="text" value={this.state.activity.questionCount} onChange={this.changeActivity.bind(this, 'questionCount')}/>    
        </fieldset>
        </div>
      )
    } ;
	render() {
    	let childProps = Object.assign({}, this.props);
    	delete childProps.children;
    	const dateStyle = {width: 100};
      if(this.state.activity == null) {
        this.state.activity = this.emptyActivityModel() ;
      }
    	return (
        <div id="courseDefs-view">
        	<div>
	            <div className="component-title">
	            	<h4>{this.state.activity.id ? '編輯課程活動' : '新增課程活動'}</h4>
		        </div>
		        <div className="component-title-btns">
		        	<button disabled={this.state.activity.id} onClick={this.handleCreateActivity.bind(this, this.state.course.id)}>確認</button>
		        	<button disabled={!this.state.activity.id} onClick={this.handleUpdateActivity.bind(this, this.state.course.id)}>更新</button>
	            	<button onClick={this.handleCancel.bind(this,this.state.course.id)}>取消</button>
            	</div>
            	<br/><br/><br/>
            	<p>開班名稱 : {this.state.course.name}</p>
            	<p>報名日期 : {this.state.course.signUpStartDate} ~ {this.state.course.signUpEndDate}</p>
            	<p>上課日期 : {this.state.course.minStartDate} ~ {this.state.course.maxEndDate}</p>
            	<p>上課時數 : {this.state.course.totalTime.hours} 小時 {this.state.course.totalTime.mins} 分</p>
	        </div>
	        <form className="component-form">
	        	<fieldset>
	        	    <p/><label className="field">活動順序: </label> <input type="text" value={this.state.activity.orderBy} onChange={this.changeActivity.bind(this, 'orderBy')}/>
	        	    <p/><label className="field">活動名稱: </label> <input type="text" value={this.state.activity.name} onChange={this.changeActivity.bind(this, 'name')}/>
	        	    <p/><label className="field">活動狀態: </label> 
	        	    	<select value={this.state.activity.status} onChange={this.changeActivity.bind(this, 'status')}>
			                <option value="1" >啟用</option>
			                <option value="0" >停用</option>
			            </select>
	        	    <p/><label className="field">活動類型: </label> 
	        	    	<select value={this.state.activity.questionnaireType} onChange={this.changeActivity.bind(this, 'questionnaireType')}>
			                <option value="pre" >課前問卷</option>
			                <option value="post">課後問卷</option>
			                <option value="t">教材</option>
                      <option value="e">測驗</option>
			            </select>
			            &nbsp;{this.state.activity.questionnaireType === "e" ? '' : <button onClick={this.handleCreateActivityDetail.bind(this, this.props.params.courseId)}>挑選</button>}
	        	    <p/><label className="field">活動期間: </label><br/>
	        	    <table>

	        	    	<tr>
	        	    		<td>起</td>
	        	    		<td><DatePicker value={moment(this.state.activity.startDate).toDate()} style={dateStyle} onChange={this.handleChangeActivityDate.bind(this, 'startDate')} /></td>
	        	    		<td>~  </td>
	        	    		<td>  迄</td>
	        	    		<td><DatePicker value={moment(this.state.activity.endDate).toDate()} style={dateStyle} onChange={this.handleChangeActivityDate.bind(this, 'endDate')} /></td>
	        	    	</tr>
	        	    </table>
	        	    
	        	     
	        	    <p/><label className="field">說明:</label> <textarea value={this.state.activity.description} onChange={this.changeActivity.bind(this, 'description')}/>
	        	    
	        	</fieldset>
	        </form>
	        {this.generateView(this.state.activity)}

	        {this.generateView2(this.state.activity)}

          {this.generateView3(this.state.activity)}

	        <TeachingMaterialPicker open={this.state.openTeachingMaterialPicker} getTeachingMaterials={this.props.getTeachingMaterials} teachingMaterials={this.props.master.teachingMaterials} onConfirm={this.onConfirmTeachingMaterial} onRequestClose={this.onCloseTeachingMaterialPicker} />
	        <QuestionPicker open={this.state.openQuestionPicker} getQuestions={this.props.getQuestions} questions={this.props.master.questions} activity={this.state.activity} onConfirm={this.onConfirmQuestion} onRequestClose={this.onCloseQuestionPicker} />
    	    {this.props.children && React.cloneElement(this.props.children, childProps)}
        </div>
        );
    }
}