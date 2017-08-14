import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import * as CourseAction from 'actions/master/CourseActions';
import * as DefinitionActions from 'actions/master/DefinitionActions'

export default class ExamQuestions extends React.Component {

    static onEnter(store){
	    return (nextState, replace, callback) => {
	    	DefinitionActions.getDefinitions()(store.dispatch, store.getState).then(() => {
	      		CourseAction.getExamQuestions()(store.dispatch, store.getState).then(() => callback());
	      	});
	    }
	} 

    render() {
	    let childProps = Object.assign({}, this.props);
	    delete childProps.children;
	    return (
	      	<div id="questions-view">
	      		<h4>題庫管理</h4>
				<Link to={`/master/admin/examQuestion`}>新增考題</Link>        
				<table className={"order-list"}>
		          	<thead>
		            	<tr>
		              		<th>NO</th>
		              		<th>考題編號</th>
				            <th>考題答案</th>
				            <th>課程單元</th>
				            <th>考題標題</th>
				        </tr>
				    </thead>
			        <tbody>
				        {this.props.master.examQuestions.map( (examQuestion, index) => (
				        	<tr key={`examQuestion_${index}`}>
				        		<td>{index}</td>
				        		<td><Link to={`/master/admin/examQuestion/${examQuestion.id}`}>{examQuestion.id}</Link></td>
				        		<td>{examQuestion.answers}</td>
				        		<td>{this.props.master.definition.chapters.find(chapter => chapter.id === examQuestion.chapterId).name}</td>
				        		<td>{examQuestion.content}</td>
				        	</tr>
				        ))}
		         	</tbody>
		        </table>
		        {this.props.children && React.cloneElement(this.props.children, childProps)}
		    </div>
	    );
    }
}