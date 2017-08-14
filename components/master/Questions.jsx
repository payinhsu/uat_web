import React, { PropTypes } from 'react';
import {Link} from 'react-router';
var config = require('config-prod');

export default class Questions extends React.Component {

    componentDidMount() {
        this.props.getQuestions({});
    };

    render() {
	    let childProps = Object.assign({}, this.props);
	    delete childProps.children;
	    return (
	      	<div id="questions-view">
	      		<h4>問卷管理</h4>
				<Link to={`${config.webContext}master/admin/newQuestion`}>新增問題</Link>
				<table className={"order-list"}>
		          	<thead>
		            	<tr>
		              		<th>NO</th>
		              		<th>問卷編號</th>
				            <th>問題類別</th>
				            <th>是否必填</th>
				            <th>問題階段</th>
				            <th>問題標題</th>
				        </tr>
				    </thead>
			        <tbody>
				        {this.props.master.questions.map( (question, index) => (
				        	<tr key={`question_${index}`}>
				        		<td>{index}</td>
				        		<td><Link to={`${config.webContext}master/admin/question/${question.id}`}>{question.no}</Link></td>
				        		<td>{question.category}</td>
				        		<td>{question.answerAtrribute}</td>
				        		<td>{question.necessaryAttribute}</td>
				        		<td>{question.content}</td>
				        	</tr>
				        ))}
		         	</tbody>
		        </table>
		        {this.props.children && React.cloneElement(this.props.children, childProps)}
		    </div>
	    );
    }
}