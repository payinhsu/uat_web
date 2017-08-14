import api from 'api/MasterAPI';

export function getCourseDefs(query) {
  return (dispatch, getState) => {
    // 暫時的查詢條件.
    query = {organizationId:'0', rootCategoryId:'0'};
    return new api(getState().auth).getCourceDefs(query).then((courseDefs)=> dispatch(receiveCourseDefs(courseDefs)));
  }
}

export function receiveCourseDefs(courseDefs) {
  	return {
	    type: 'MASTER_RECEIVE_COURSEDEFS',
	    courseDefs: courseDefs
	}
}

export function getCourseDef(courseDefId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getCourseDef(courseDefId).then((courseDef)=> dispatch(receiveCourseDef(courseDef)));
  }
}

export function receiveCourseDef(courseDef) {
  return {
    type: 'RECEIVE_COURSE_DETAIL',
    courseDef: courseDef
  }
}

export function createCourseDef(courseDef){
  return (dispatch, getState) => {
    return new api(getState().auth).createCourseDef(courseDef).then((success)=> dispatch(getCourseDefs()));
  }
}

export function updateCourseDef(courseDef){
  return (dispatch, getState) => {
    return new api(getState().auth).updateCourseDef(courseDef).then((success)=> dispatch(getCourseDefs()));
  }
}

/** 設定 course，有值時 Course.jsx 會在有值時進入編輯模式，在沒值(null)時，進入新增模式 **/
export function setCourse(course){
  return {
    type: 'MASTER_SET_COURSE',
    course
  };
}

export function setExamQuestion(examQuestion) {
  return {
    type: 'MASTER_SET_EXAMQUESTION',
    examQuestion
  } ;
}

export function setActivity(activity) {
  return {
    type: 'MASTER_SET_ACTIVITY',
    activity
  } ;
}

export function createCourse(course){
  return (dispatch, getState) => {
    return new api(getState().auth).createCourse(course).then((success)=> dispatch(getCourses(course.courseDefId)));
  }
}

export function updateCourse(course){
  return (dispatch, getState) => {
    return new api(getState().auth).updateCourse(course).then((success)=> dispatch(getCourses(course.courseDefId)));
  }
}

export function getQuestions() {
  return (dispatch, getState) => {
    return new api(getState().auth).getQuestions().then((questions)=> dispatch(receiveQuestions(questions)));
  }
}

export function getExamQuestions() {
  return (dispatch, getState) => {
    return new api(getState().auth).getExamQuestions().then((examQuestions)=> dispatch(receiveExamQuestions(examQuestions)));
  }
}

export function receiveExamQuestions(examQuestions) {
    return {
        type: 'RECEIVE_EXAMQUESTIONS',
        examQuestions: examQuestions
    }
}

export function getTeachingMaterials() {
  return (dispatch, getState) => {
    return new api(getState().auth).getTeachingMaterials().then((teachingMaterials)=> dispatch(receiveTeachingMaterials(teachingMaterials)));
  }
}

export function receiveTeachingMaterials(teachingMaterials) {
    return {
        type: 'RECEIVE_TEACHING_MATERIALS',
        teachingMaterials: teachingMaterials
    }
}

export function getQuestion(questionId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getQuestion(questionId).then((question)=> dispatch(receiveQuestion(question)));
  }
}

export function getExamQuestion(examQuestionId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getExamQuestion(examQuestionId).then((examQuestion)=> dispatch(receiveExamQuestion(examQuestion)));
  }
}

export function receiveQuestion(question) {
    return {
        type: 'RECEIVE_QUESTION_DETAIL',
        question: question
    }
}

export function setQuestion(question) {
  return {
    type: 'RECEIVE_QUESTION_DETAIL',
    question
  } ;
}

export function receiveExamQuestion(examQuestion) {
    return {
        type: 'RECEIVE_EXAMQUESTION_DETAIL',
        examQuestion: examQuestion
    }
}

export function receiveQuestions(questions) {
    return {
        type: 'RECEIVE_QUESTIONS',
        questions: questions
    }
}

export function createQuestion(question){
  return (dispatch, getState) => {
    return new api(getState().auth).createQuestion(question).then((success)=> dispatch(getQuestions()));
  }
}

export function updateQuestion(question){
  return (dispatch, getState) => {
    return new api(getState().auth).updateQuestion(question).then((success)=> dispatch(getQuestions()));
  }
}

export function createExamQuestion(examQuestion){
  return (dispatch, getState) => {
    return new api(getState().auth).createExamQuestion(examQuestion).then((success)=> dispatch(getExamQuestions()));
  }
}

export function updateExamQuestion(examQuestion, examQuestionId){
  return (dispatch, getState) => {
    return new api(getState().auth).updateExamQuestion(examQuestion, examQuestionId).then((success)=> dispatch(getExamQuestions()));
  }
}

export function updateActivitiesOrder(activityOrder, courseId) {
  return(dispatch, getState) => {
    return new api(getState().auth).updateActivitiesOrder(activityOrder, courseId).then((success)=> dispatch(getCourseActivities(courseId)));
  }
}

export function getCourses(courseDefId) {
  return (dispatch, getState) => {
    // dispatch(cleanCourses());
    return new api(getState().auth).getCourses(courseDefId).then((courses)=> dispatch(receiveCourses(courses)));
  }
}

export function receiveCourses(courses) {
    return {
        type: 'RECEIVE_COURSES',
        courses: courses
    }
}

/* course candidates for 'CopyCoursePicker' */
export function getCopyCourses(courseDefId){
  return (dispatch, getState) => {
    // dispatch(cleanCopyCourses());
    return new api(getState().auth).getCourses(courseDefId).then((courses)=> dispatch(receiveCopyCourses(courses)));
  }
}

export function receiveCopyCourses(courses) {
    return {
        type: 'MASTER_RECEIVE_COPY_COURSES',
        courses
    }
}

export function cleanCopyCourses(){
  return {type: 'MASTER_CLEAN_COPY_COURSES'};
}


export function setCopyCourse(course){
  return {
    type: 'MASTER_SET_COPY_COURSE',
    course
  };
}

export function getCourse(courseId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getCourse(courseId).then((course)=> dispatch(receiveCourse(course)));
  }
}

export function receiveCourse(course) {
    return {
        type: 'RECEIVE_COURSE',
        course: course
    }
}

export function getCourseOrderMembers(courseId,query) {
    return (dispatch, getState) => {
        return new api(getState().auth).getCourseOrderMembers(courseId,query).then((members)=> dispatch(receiveCourseOrderMembers(members)));
    }
}

export function receiveCourseOrderMembers(members) {
    return {
        type: 'RECEIVE_COURSE_ORDER_MEMBERS',
        members: members
    }
}

export function createCoursePaidUpload(courseId, members,query) {
    return (dispatch, getState) => {
        return new api(getState().auth).createCoursePaidUpload(courseId,members).then((success) => {
            dispatch(getCourseOrderMembers(courseId, query));
            dispatch(getCoursePaidUpload(courseId, members.members[0].id));
        });           
    }
}

export function createCourseRefundUpload(courseId, members, query) {
    return (dispatch, getState) => {
        return new api(getState().auth).createCourseRefundUpload(courseId, members).then((success) => {
            dispatch(getCourseOrderMembers(courseId, query)) ;
            dispatch(getCourseRefundUpload(courseId,members.members[0].id)) ;
        });
    }
}

export function getCourseActivities(courseId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getCourseActivities(courseId).then(activities=> dispatch(receiveCourseActivities(activities)));
  }
}

export function receiveCourseActivities(activities) {
    return {
        type: 'RECEIVE_COURSE_ACTIVITIES',
        activities: activities
    }
}

/**************** clean code ***************/
export function cleanCourses(){
  return {type: 'MASTER_CLEAN_COURSES'};
}

export function updateOrderPaymentStatus(orders,courseId, query) {
  return (dispatch, getState) => {
    return new api(getState().auth).updateOrderPaymentStatus(orders).then((success) => dispatch(getCourseOrderMembers(courseId,query)));
  }
}

export function createCourseActivity(courseId, activity) {
  return (dispatch, getState) => {
    return new api(getState().auth).createCourseActivity(courseId, activity).then((success) => dispatch(getCourseActivities(courseId)))
  }
}

export function updateCourseActivity(courseId, activityId, activity) {
  return (dispatch, getState) => {
    return new api(getState().auth).updateCourseActivity(courseId, activityId, activity).then((success) => dispatch(getCourseActivities(courseId)))
  }
}

export function getActivity(courseId, activityId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getActivity(courseId, activityId).then((activity) => dispatch(receiveActivity(activity)))
  }
}

export function receiveActivity(activity) {
  return {
        type: 'RECEIVE_ACTIVITY',
        activity: activity
    }
}

export function getActivityStatistics(courseId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getActivityStatistics(courseId).then((questionnaire) => dispatch(receiveQuestionnaire(questionnaire)))
  }
}

export function receiveQuestionnaire(questionnaire) {
  return {
        type: 'RECEIVE_ACTIVITY_STATISTICS',
        questionnaire: questionnaire
    }
}

export function getCoursePaidMembers(courseId, query) {
    return (dispatch, getState) => {
        return new api(getState().auth).getCoursePaidMembers(courseId, query).then(members=> dispatch(receiveCoursePaidMembers(members)));
    }
}

export function receiveCoursePaidMembers(members) {
    return {
        type: 'RECEIVE_COURSE_PAID_MEMBERS',
        members: members
    }
}

export function getCoursePaidUpload(courseId, memberId) {
    return (dispatch, getState) => {
        return new api(getState().auth).getCoursePaidUpload(courseId, memberId).then((memberCoursePaidUploadRecord)=> 
          dispatch(receiveCoursePaidUpload(memberCoursePaidUploadRecord)));
    }
}

export function receiveCoursePaidUpload(memberCoursePaidUploadRecord) {
    return {
        type: 'RECEIVE_MEMBER_COURSE_PAID_UPLOAD_RECORD',
        memberCoursePaidUploadRecord: memberCoursePaidUploadRecord
    }
}

export function getCourseRefundUpload(courseId, memberId) {
    return (dispatch, getState) => {
        return new api(getState().auth).getCourseRefundUpload(courseId, memberId).then((memberCourseRefundUploadRecord)=> 
          dispatch(receiveCourseRefundUpload(memberCourseRefundUploadRecord)));
    }
}

export function receiveCourseRefundUpload(memberCourseRefundUploadRecord) {
    return {
        type: 'RECEIVE_MEMBER_COURSE_REFUND_UPLOAD_RECORD',
        memberCourseRefundUploadRecord: memberCourseRefundUploadRecord
    }
}

export function setEmptyPaidUpload(memberCoursePaidUploadRecord){
  return {
    type: 'RECEIVE_MEMBER_COURSE_PAID_UPLOAD_RECORD',
    memberCoursePaidUploadRecord:memberCoursePaidUploadRecord
  }
}

export function setEmptyRefundUpload(memberCourseRefundUploadRecord){
  return {
    type: 'RECEIVE_MEMBER_COURSE_REFUND_UPLOAD_RECORD',
    memberCourseRefundUploadRecord:memberCourseRefundUploadRecord
  }
}

export function setEmptyTeachingMaterial(teachingMaterialView){
  return {
    type: 'RECEIVE_TEACHING_MATERIAL_VIEW',
    teachingMaterialView:teachingMaterialView
  }
}

export function setEmptyAttendDate(attendDateView){
  return {
    type: 'RECEIVE_ATTEND_DATE_VIEW',
    attendDateView:attendDateView
  }
}

export function setEmptyChapterScores(chapterScoresView){
  return {
    type: 'RECEIVE_CHAPTER_SCORES_VIEW',
    chapterScoresView:chapterScoresView
  }
}

export function setEmptyNotices(noticeView) {
  return {
    type: 'RECEIVE_NOTICE_VIEW',
    noticeView:noticeView
  }
}

export function getStudentTeachingMaterialView(courseId, memberId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getStudentTeachingMaterialView(courseId, memberId).then((teachingMaterialView) => 
      dispatch(receiveStudentTeachingMaterialView(teachingMaterialView)))
  }
}

export function receiveStudentTeachingMaterialView(teachingMaterialView) {
  return {
      type: 'RECEIVE_TEACHING_MATERIAL_VIEW',
      teachingMaterialView: teachingMaterialView
  }
}

export function getStudentAttendDateView(courseId, memberId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getStudentAttendDateView(courseId, memberId).then((attendDateView) => 
      dispatch(receiveStudentAttendDateView(attendDateView)))
  }
}

export function receiveStudentAttendDateView(attendDateView) {
  return {
      type: 'RECEIVE_ATTEND_DATE_VIEW',
      attendDateView: attendDateView
  }
}

export function getStudentChapterScoresView(courseId, memberId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getStudentChapterScoresView(courseId, memberId).then((chapterScoresView) => 
      dispatch(receiveStudentChapterScoresView(chapterScoresView)))
  }
}

export function receiveStudentChapterScoresView(chapterScoresView) {
  return {
      type: 'RECEIVE_CHAPTER_SCORES_VIEW',
      chapterScoresView: chapterScoresView
  }
}

export function getStudentNoticeView(courseId, memberId) {
  return (dispatch, getState) => {
    return new api(getState().auth).getStudentNoticeView(courseId, memberId).then((noticeView) => 
      dispatch(receiveStudentNoticeView(noticeView)))
  }
}

export function receiveStudentNoticeView(noticeView) {
  return {
      type: 'RECEIVE_NOTICE_VIEW',
      noticeView: noticeView
  }
}

export function getCourseStudentScores(courseId, members, query) {
  return (dispatch, getState) => {
    return new api(getState().auth).getCourseStudentScores(courseId, members).then((success) => 
      dispatch(getCoursePaidMembers(courseId, query)))
  }
} 

export function postAttendStudents(courseId, attendStudents, query) {
  return (dispatch, getState) => {
    return new api(getState().auth).postAttendStudents(courseId, attendStudents).then((success) => 
      dispatch(getCoursePaidMembers(courseId, query)))
  }
}

export function postMemberScores(members, courseId, chapterId, query) {
  return (dispatch, getState) => {
    return new api(getState().auth).postMemberScores(members, courseId, chapterId).then((success) => 
      dispatch(getCoursePaidMembers(courseId, query)))
  }
}

export function postWebNotices(courseId, model, query) {
  return (dispatch, getState) => {
    return new api(getState().auth).postWebNotices(model).then((success) => 
      dispatch(getCoursePaidMembers(courseId, query)))
  }
}

export function getTeachingMaterial(teachingMaterialId) {
    return (dispatch, getState) => {
      return new api(getState().auth).getTeachingMaterial(teachingMaterialId).then((teachingMaterial) => dispatch(receiveTeachingMaterial(teachingMaterial)));
    }
}

export function receiveTeachingMaterial(teachingMaterial) {
    return {
        type: 'RECEIVE_TEACHING_MATERIAL',
        teachingMaterial: teachingMaterial
    }
}

export function updateTeachingMaterial(teachingMaterialId,teachingMaterial) {
  return (dispatch, getState) => {
    return new api(getState().auth).updateTeachingMaterial(teachingMaterialId,teachingMaterial).then((success) =>
      dispatch(getTeachingMaterial(teachingMaterialId)));
  }
}
