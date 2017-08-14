import React from 'react';
import {Link} from 'react-router';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
var config = require('config-prod');

export default class StudentChapterScoresView extends React.Component {

	constructor(props) {
  	    super(props);
  	    this.state = {
  	        open: props.open,
            chapterScoresView: props.chapterScoresView,
  	    };
  	}

  	componentWillReceiveProps = newProps => {
  	    let nextState = {
  	      open: newProps.open, 
          chapterScoresView: newProps.chapterScoresView,
  	    };
  	    this.setState(nextState);
  	};

    handleClose = () => {
        this.setState({open: false});
        this.props.onRequestClose();
    };
    
  	render() {
    	const actions = [
	      <FlatButton
	        label="關閉視窗"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	    ];

    	return (
        <Dialog
          title="課程開班資訊 - 已付款學員資料-成績明細頁"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <Divider />
            學員姓名 : {this.state.chapterScoresView.member.familyName}{this.state.chapterScoresView.member.firstName} &nbsp; 班級名稱 : {this.state.chapterScoresView.courseName}
            <table className="chapter-scores-total-table">
		        <thead>
		          	<tr>
			              <th>總成績</th>
			              <th>計算人員</th>
                    <th>計算日期</th>
			       	</tr>
		        </thead>
	          	  <tbody>
		                <tr key={`chapter_scores_total`}>
    		                <td>{ parseFloat(this.state.chapterScoresView.totalScore).toFixed(2)}</td>
    		                <td>{this.state.chapterScoresView.totalScoreUploadAuthor}</td>
                        <td>{this.state.chapterScoresView.totalScoreUploadDate}</td>
		                </tr>
		            </tbody>
        	  </table>
            <p></p>
            <table className="order-list">
                <thead>
                    <tr>
                      <th>課程單元</th>
                      <th>佔比</th>
                      <th>成績</th>
                      <th>登記人員</th>
                      <th>登記日期</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.chapterScoresView.chapters.map( (chapter, index) => (
                      <tr key={`chapter_score_${index}`}>
                          <td>{chapter.name}</td>
                          <td>{chapter.propotion}</td>
                          <td>{chapter.score}</td>
                          <td>{chapter.updateAuthor}</td>
                          <td>{chapter.updateDate}</td>
                      </tr>
                  ))}
                </tbody>
            </table>
        </Dialog>
        );
    }
}