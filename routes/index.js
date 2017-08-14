import React                   from 'react';
import {requireAuth}           from 'auth';
import { Route, IndexRoute, IndexRedirect }   from 'react-router';

/** shared components */
import App                     from 'components/index';
import Admin                   from 'components/Admin';
import Wellcome                from 'components/Wellcome';

/** master components */
import Master                  from 'components/master/Master';
import Course                  from 'components/master/Course';
import CourseActivities        from 'components/master/CourseActivities';
import CourseDefs              from 'components/master/CourseDefs';
import CourseDef               from 'components/master/CourseDef';
import CourseDefCourses        from 'components/master/CourseDefCourses';
import Questions               from 'components/master/Questions';
import Courses                 from 'components/master/Courses';
import Question                from 'components/master/NewQuestion' ;
import Members				   from 'components/master/CourseOrderMembers';
import Activity				   from 'components/master/NewActivity';
import Statistics              from 'components/master/ActivityStatistics';
import ExamQuestions   		   from 'components/master/ExamQuestions';
import ExamQuestion   		   from 'components/master/ExamQuestion';
import ManageMember		       from 'components/master/CourseOrderMembersManage';
import DocumentUploading	   from 'components/master/DocumentUploading'

/** senior components */
import Senior                  from 'components/senior/Senior';
import ActiveOrderList         from 'components/senior/ActiveOrderList';
import PassitiveOrderList      from 'components/senior/PassitiveOrderList';
import ActiveOrderDetail       from 'components/senior/ActiveOrderDetail';

/** management components */
import Management              from 'components/management/Management';
import Sms					   from 'components/management/Sms';


import PassitiveOrderDetail    from 'components/senior/PassitiveOrderDetail';

import PassitiveOrderDetailHistory    from 'components/senior/PassitiveOrderDetailHistory';
import ActiveOrderDetailHistory       from 'components/senior/ActiveOrderDetailHistory';

var config = require('config-prod');
var webContext = '/';
if(typeof window === 'object') {
  if(config.webContext !== '/' && config.webContext.length > 1){
    webContext = config.webContext.substring(0, config.webContext.length -1);
  }
  else webContext = config.webContext;
}

export default store => (
	<Route path={webContext} name="app" component={App}>
		<IndexRoute component={Wellcome} />
		<Route path="login" component={Wellcome} onEnter={()=> window.location.reload()}/>
		<Route path="wellcome" component={Wellcome} />
		<Route path="master" name="master" component={Master}>
			<IndexRedirect to="admin" />
			<Route path="admin" name="admin" component={Admin} onEnter={requireAuth(store)}>
				<Route path="newCourse" component={Course} onEnter={Course.onEnter(store)} onLeave={Course.onLeave(store)} />
				<Route path="course/:courseId/activities" component={CourseActivities} onEnter={CourseActivities.onEnter(store)} />
				<Route path="course/:courseId/activity" component={Activity} onEnter={Activity.onEnter(store)} onLeave={Activity.onLeave(store)}/>
				<Route path="course/:courseId" component={Course} onEnter={Course.onEnter(store)} onLeave={Course.onLeave(store)} />
				<Route path="courseDef/:courseDefId/newCourse" component={Course} onEnter={Course.onEnter(store)} onLeave={Course.onLeave(store)} />
				<Route path="courseDefs" component={CourseDefs} />
				<Route path="courseDef/:courseDefId" component={CourseDef} onEnter={CourseDef.onEnter(store)} />
				<Route path="newCourseDef" component={CourseDef} onEnter={CourseDef.onEnter(store)} />
				<Route path="courseDef/:courseDefId/courses" component={CourseDefCourses} onEnter={CourseDefCourses.onEnter(store)} />
				<Route path="questions" component={Questions}/>
				<Route path="courses" component={Courses} onEnter={Courses.onEnter(store)}/>
				<Route path="newQuestion" component={Question} onLeave={Question.onLeave(store)}/>
				<Route path="question/:questionId" component={Question} onEnter={Question.onEnter(store)} onLeave={Question.onLeave(store)}/>
				<Route path="courseOrderMembers/:courseId" component={Members} onEnter={Members.onEnter(store)}/>
				<Route path="course/:courseId/activity/:activityId" component={Activity} onEnter={Activity.onEnter(store)} onLeave={Activity.onLeave(store)}/>
				<Route path="course/:courseId/activity/:activityId/statistics/:type" component={Statistics} onEnter={Statistics.onEnter(store)}/>
				<Route path="examQuestions" component={ExamQuestions} onEnter={ExamQuestions.onEnter(store)}/>
				<Route path="examQuestion" component={ExamQuestion} onEnter={ExamQuestion.onEnter(store)} onLeave={ExamQuestion.onLeave(store)}/>
				<Route path="examQuestion/:examQuestionId" component={ExamQuestion} onEnter={ExamQuestion.onEnter(store)} onLeave={ExamQuestion.onLeave(store)}/>
				<Route path="courseOrderPaidMembers/:courseId" component={ManageMember} onEnter={ManageMember.onEnter(store)}/>
				<Route path="documentUploading/:teachingMaterialId" component={DocumentUploading} onEnter={DocumentUploading.onEnter(store)}/>
			</Route>
		</Route>
		<Route path="/senior" name="senior" component={Senior}>
			<IndexRedirect to="admin" />
			<Route path="admin" name="admin" component={Admin} onEnter={requireAuth(store)}>
				// <IndexRoute component={PassitiveOrderList} />
				<Route path="activeOrders" component={ActiveOrderList}/>
				<Route path="passiveOrders" component={PassitiveOrderList} />
				<Route path="order/:orderId/active" component={ActiveOrderDetail} onEnter={ActiveOrderDetail.onEnter(store)} />
				<Route path="order/:orderId/passive" component={PassitiveOrderDetail} onEnter={PassitiveOrderDetail.onEnter(store)} />
				<Route path="order/:orderId/history/passive/:index" component={PassitiveOrderDetailHistory} onEnter={PassitiveOrderDetailHistory.onEnter(store)} />
				<Route path="order/:orderId/history/active/:index" component={ActiveOrderDetailHistory} onEnter={ActiveOrderDetailHistory.onEnter(store)} />
			</Route>
		</Route>
		<Route path="/management" name="management" component={Management}>
			<IndexRedirect to="admin" />
			<Route path="admin" name="admin" component={Admin} onEnter={requireAuth(store)}>
				<Route path="sms" component={Sms} />
			</Route>
		</Route>

	</Route>
);