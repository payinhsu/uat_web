import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import * as CourseActions from 'actions/master/CourseActions';
var config = require('config-prod');

export default class CourseActivities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          // insert model 所勾選的項目
          isUpdateOrder: false,
          activities : this.props.master.activities  
        };
    }

    static onEnter(store){
        return (nextState, replace, callback) => {
            CourseActions.getCourseActivities(nextState.params.courseId)(store.dispatch, store.getState).then(() => callback());
        }
    }

    // 當變數有變動時 redux state is change 觸發頁面更新
    componentWillReceiveProps = newProps => {
      this.setState({
        activities: newProps.master.activities
      });
    };

    changeActivitiesOrderBy = (index, e) => {
      this.state.activities[index].orderBy = e.target.value ;
      this.setState({activities:this.state.activities});
      console.log(JSON.stringify(this.state.activities));
    }

    isUpdateOrder = () => { 
        if(this.state.isUpdateOrder){
            this.state.isUpdateOrder = false ;
        } else {
            this.state.isUpdateOrder = true;
        }
        this.setState({activities: this.state.activities});
        console.log(JSON.stringify(this.state.isUpdateOrder));
    }

    handleCreateActivity = (courseId, e) => {
        e.preventDefault();
        this.props.master.activity = 
        this.props.history.push(`${config.webContext}master/admin/course/${courseId}/activity`);
    };

    updateActivitiesOrder = (courseId, e) => {
        const activityOrder = this.toApiModel(this.state.activities);
        // console.log(courseId) ;
        // console.log(activityOrder) ;
        this.props.updateActivitiesOrder(activityOrder, courseId);
        this.state.isUpdateOrder = false ;
    };

    toApiModel = (activities) => {
        let result = [] ;
        activities.map(activity => {
            result.push({id:activity.id, orderBy:parseInt(activity.orderBy)});
        })
        return {activityOrder:result}
    }

    render() {
      return (
          <div className="master-course-activitys-view">
              <h4>班級活動</h4>
              <div className="top-btns-bar">
                  <button onClick={this.handleCreateActivity.bind(this, this.props.params.courseId)}>新增</button>
                  <button onClick={this.isUpdateOrder} disabled={this.state.isUpdateOrder}>調整順序</button>
                  {this.state.isUpdateOrder? <button onClick={this.updateActivitiesOrder.bind(this, this.props.params.courseId)}>確認</button>: '' }
                  {this.state.isUpdateOrder? <button onClick={this.isUpdateOrder} >取消</button>: '' }
              </div>
              <table className={"course-activity-list"}>
                  <thead>
                      <tr>
                          <th>順序</th>
                          <th>活動類型</th>
                          <th>活動名稱</th>
                          <th>活動期間</th>
                          <th>說明</th>
                          <th>狀態</th>
                      </tr>
                  </thead>
                  <tbody>

                  {this.state.activities.map((activity, index) => (
                      <tr key={`activty_${index}`}>
                          <td> {this.state.isUpdateOrder ?<input style={{width:20}} type="text" value={activity.orderBy} onChange={this.changeActivitiesOrderBy.bind(this, index)}/> : activity.orderBy }</td>
                          <td>{activity.type == "教材" || activity.type == "測驗" ? activity.type : <Link to={`${config.webContext}master/admin/course/${this.props.params.courseId}/activity/${activity.id}/statistics/${activity.type}`}>{activity.type}</Link>}</td>
                          <td><Link to={`${config.webContext}master/admin/course/${this.props.params.courseId}/activity/${activity.id}`}>{activity.name}</Link></td>
                          <td>{activity.startDate} ~ {activity.endDate}</td>
                          <td>{activity.description}</td>
                          <td>{activity.status === "1" ? "啟用":"停用"}</td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>
      );
  }
}