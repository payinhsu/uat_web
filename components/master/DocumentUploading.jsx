import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import Document from 'components/Document';
import * as CourseActions from 'actions/master/CourseActions'
var config = require('config-prod');

export default class DoucmentUploading extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			teachingMaterial : props.master.teachingMaterial || this.emptyTeachingMaterialModel()
		};
	}

	static onEnter(store){
	    return (nextState, replace, callback) => {
	          console.log("teachingMaterial id : " + nextState.params.teachingMaterialId) ;
	          CourseActions.getTeachingMaterial(nextState.params.teachingMaterialId)(store.dispatch, store.getState).then(() => callback());
	    }
	}

	handleUploadImage = (fileKey) => {
	    this.state.teachingMaterial.fileKey = fileKey;
	    this.setState({teachingMaterial: this.state.teachingMaterial});
	    console.log('state after upload image > ' + JSON.stringify(this.state));
  	};


  	handleUpdateTeachingMaterial = (teachingMaterialId) => {

  		const teachingMaterial = this.toApiModel(this.state.teachingMaterial);
    	this.props.updateTeachingMaterial(teachingMaterialId, teachingMaterial);
    };

  	/** view model to api model (for api access) */
    toApiModel = (teachingMaterial) => {
    	return Object.assign({}, teachingMaterial,
	    	{
				name: teachingMaterial.name,
				author: teachingMaterial.author, 
				categoryId: teachingMaterial.categoryId,
				fileKey: teachingMaterial.fileKey,
				fileFormat: teachingMaterial.fileFormat,
				orderBy: teachingMaterial.orderBy
	    	}
    	)
    };

  	//for new teaching material
  	emptyTeachingMaterialModel = () => {
  		return {
  			name:"No data input"
  		}
  	}

	render() {
		return(
			<form className="component-form">
				<table>
					<tbody>
						<tr>
							<td>教材名稱 : </td>
							<td>{this.state.teachingMaterial.name}</td>
						</tr>
						<tr>
							<td>選擇檔案 : </td>	
							<td>
								<Document
				                    auth={this.props.auth}
				                    docType="refundDoc"
				                    convertType="forum-application"
				                    onUpload={this.handleUploadImage}
				                 />{this.state.teachingMaterial.fileKey}
							</td>
						</tr>
						<tr>
							<td>
								<button onClick={this.handleUpdateTeachingMaterial.bind(this, this.props.params.teachingMaterialId)}>更新教材</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		);
	}
}