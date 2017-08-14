import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import * as CourseActions from 'actions/master/CourseActions';
import QuestionnaireStatementPicker from 'components/master/QuestionnaireStatementPicker';
var config = require('config-prod');

export default class ActivityStatistics extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        // dialog control
        openQuestionnaireStatementPicker : false,
        // insert model 
        questionnaire : props.params.type == "課前問卷" ? props.master.questionnaire[0] : props.master.questionnaire[1] ,
        question : "" 
      };

      // console.log(JSON.stringify(this.state.questionnaire));
  }

    /** load category & courseDef by courseDefId specified in path param */
    static onEnter(store){
        return (nextState, replace, callback) => {
            if(nextState.params && nextState.params.courseId){
              console.log("courseId id : " + nextState.params.courseId) ;
              CourseActions.getActivityStatistics(nextState.params.courseId)(store.dispatch, store.getState).then(() => callback());
            }
            else callback();
        }
    }

    handleCancel = (courseId) => {
        this.props.history.push(`${config.webContext}master/admin/course/${courseId}/activities`);
    }

    handleShowQuestionStatementDetail = (question) => {
        console.log("open...") ;
        this.state.question = question ;
        this.setState({openQuestionnaireStatementPicker:true});
    }

    statementView = (question) => {
        return (
            <div>
            <fieldset>
                <p> {question.content} </p> <button onClick={this.handleShowQuestionStatementDetail.bind(this, question)}>顯示詳細內容</button>
            </fieldset>
            </div>
        )
    } ;

    questionView = (question) => {
        //console.log(question.options) ;
        return (
            <div>
            <fieldset>
                <p> {question.content} </p>
                <table> 

                {question.options.map( option => {
                    //console.log(option) ;
                    return (<tr>
                              <td>{option.content}</td> 
                              <td>{option.percentage}</td>
                            </tr>
                    ) ;
                })}
                </table>
            </fieldset>
            </div>

        )
    } ;


    onCloseQuestionnaireStatementPicker = () => {
      this.setState({openQuestionnaireStatement:false});
    }

    onConfirmQuestionnaireStatement = () => {
        console.log("onConfirmQuestionnaireStatement : confirm") ;
        this.onClosePicker();
    }

    onClosePicker = () => {
      this.setState({
        openQuestionnaireStatementPicker:false
      });
    };

    render() {
        let childProps = Object.assign({}, this.props);
        delete childProps.children;
        return (
            <div id="courseDefs-view">
                <div>
                    <div className="component-title">
                      <h4>課程問卷結果 - {this.props.params.type}</h4>
                  </div>
                  <div className="component-title-btns">
                      <button onClick={this.handleCancel.bind(this,this.props.params.courseId)}>關閉</button>
                  </div>
                </div>
                <br/><br/><br/><br/>
                {this.state.questionnaire.questions.map( question => {
                    if(question.type == "T") {
                        return this.statementView(question);
                    } else {
                        return this.questionView(question);
                    }
                })} 

                <QuestionnaireStatementPicker open={this.state.openQuestionnaireStatementPicker} question={this.state.question} onConfirm={this.onConfirmQuestionnaireStatement} onRequestClose={this.onCloseQuestionnaireStatementPicker} />
                {this.props.children && React.cloneElement(this.props.children, childProps)}
            </div>
        );
    }
}