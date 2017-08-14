import axios from 'axios';
import config from 'config-prod';
import BaseAPI from './BaseAPI';

const APP_TOKEN = '8e387797-da95-4366-9578-74714b61effc';
const API_BASE_URL = config.masterAPIUrl;

export default class MasterAPI extends BaseAPI {
  constructor(auth) {
    super('SeniorAPI', API_BASE_URL, APP_TOKEN);
    this.token = auth ? auth.accessToken : APP_TOKEN;
    this.auth = auth;
    if(auth) this.USER_TOKEN = auth.accessToken;
  }

  getCourceDefs(query){
    return this.get(`/organization/${query.organizationId}/courseDefs`, query, this.auth.accessToken).then((resp) => resp.data.courseDefs);
  }

  getCourseDef(courseDefId){
    return this.get(`/courseDef/${courseDefId}/webDetail`, null, this.auth.accessToken).then((resp) => resp.data);
  }

  createCourseDef(courseDef){
    return this.post(`/courseDef`, courseDef, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  updateCourseDef(courseDef){
    return this.put(`/courseDef/${courseDef.courseDefId}`, courseDef, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  createCourse(course){
    return this.post(`/course`, course, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  updateCourse(course){
    return this.put(`/course/${course.id}`, course, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  getQuestions() {
    return this.get(`/questions`, null, this.auth.accessToken).then((resp) => resp.data.questions)
  }

  getExamQuestions() {
    return this.get(`/examQuestions`, null, this.auth.accessToken).then((resp) => resp.data.examQuestions)
  }

  getTeachingMaterials() {
    return this.get(`/teachingMaterials`, null, this.auth.accessToken).then((resp) => resp.data.teachingMaterials)
  }

  getQuestion(questionId) {
    return this.get(`/question/${questionId}`, null, this.auth.accessToken).then((resp) => resp.data)
  }
  
  getExamQuestion(examQuestionId) {
    return this.get(`/examQuestion/${examQuestionId}`, null, this.auth.accessToken).then((resp) => resp.data)
  }

  createQuestion(question) {
    return this.post(`/question`, question, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  updateQuestion(question) {
    return this.put(`/question/${question.id}`, question, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  createExamQuestion(examQuestion) {
     return this.post(`/examQuestion`, examQuestion, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  updateExamQuestion(examQuestion, examQuestionId) {
    return this.put(`/examQuestion/${examQuestionId}`, examQuestion, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  getCourses(courseDefId) {
    return this.get(`/courseDef/${courseDefId}/courseList`, null, this.auth.accessToken).then((resp) => resp.data.courses)
  }

  getTeachers() {
    return this.get(`/teachers`, null, this.auth.accessToken).then((resp) => resp.data.teachers)
  }

  getCourse(courseId) {
    return this.get(`/course/${courseId}/webDetail`, null, this.auth.accessToken).then((resp) => resp.data)
  }

  getCourseOrderMembers(courseId,query) {
      return this.get(`/course/${courseId}/orderMembers`, query, this.auth.accessToken).then((resp) => resp.data.members)
  }

  getCourseActivities(courseId) {
    return this.get(`/course/${courseId}/webActivityList`, null, this.auth.accessToken).then((resp) => resp.data.activities)
  }

  getCoursePaidMembers(courseId,query) {
    return this.get(`/course/${courseId}/paidMembers`, query, this.auth.accessToken).then((resp) => (
      {members:resp.data.members,
       chapters:resp.data.chapters}))
  }

  /** APIs to load defination data */
  // getCategories() {
  //   return this.get(`/categories`, null, APP_TOKEN).then((resp) => resp.data.categories);
  // }

  /** {  teachers, categories, organizations } */
  getDefinitions() {
    return this.get(`/mapping/collectionsUtil`, null, this.auth.accessToken).then((resp) => (
      {
        teachers: resp.data.teachers, 
        categories: resp.data.categories, 
        organizations: resp.data.organizations, 
        locales: resp.data.locales, 
        chapters: resp.data.chapters,
        plannings: resp.data.plannings,
        banks: resp.data.banks
      }
    ));
  }

  updateOrderPaymentStatus(orders) {
    return this.put(`/order/paymentStatus`, orders, this.auth.accessToken).then((resp) => this.isSuccess(resp.data))
  }

  updateActivitiesOrder(activityOrder, courseId) {
    return this.put(`/course/${courseId}/activity/order`, activityOrder, this.auth.accessToken).then((resp) => this.isSuccess(resp.data))
  }

  getCoursePaidUpload(courseId, memberId) {
    return this.get(`/course/${courseId}/paidUpload?memberId=${memberId}`, null , this.auth.accessToken).then((resp) => (
       {
         member:resp.data.member, 
         courseName:resp.data.courseName, 
         paidRecords:resp.data.paidRecords
       }
      ));
  }
  
  getCourseRefundUpload(courseId, memberId) {
    return this.get(`/course/${courseId}/refundUpload?memberId=${memberId}`, null , this.auth.accessToken).then((resp) => (
       {
         member:resp.data.member, 
         courseName:resp.data.courseName, 
         refundRecords:resp.data.refundRecords
       }
      ));
  }

  createCoursePaidUpload(courseId,members) {
    return this.post(`/course/${courseId}/paidUpload`, members, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  createCourseRefundUpload(courseId,members) {
    return this.post(`/course/${courseId}/refundUpload`, members, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  createCourseActivity(courseId, activity) {
    return this.post(`/course/${courseId}/activity`, activity, this.auth.accessToken).then((resp) => this.isSuccess(resp.data))
  }

  updateCourseActivity(courseId, activityId, activity) {
    return this.put(`/course/${courseId}/activity/${activityId}`, activity, this.auth.accessToken).then((resp) => this.isSuccess(resp.data))
  }

  getActivity(courseId, activityId) {
    return this.get(`/course/${courseId}/activity/${activityId}`, null, this.auth.accessToken).then((resp) => resp.data.activity)
  }

  getActivityStatistics(courseId) {
    return this.get(`/course/${courseId}/questionnaire/result`, null, this.auth.accessToken).then((resp) => resp.data.questionnaire)
  }

  getSignature(paramObj){           // paramObj: {fileName, fileType, inputType, memberId}
    return this.post(`/document/signature`, paramObj, this.auth.accessToken).then((resp) => resp.data.signature);
  }

  /** fileType is {I|M|V} */
  getFileUrl(fileKey, tags){          // resp.data => {fileKey:'', tags:[], expiration:0}
    return this.post(`/document/fileUrl`, {fileKey, tags}, this.auth.accessToken).then((resp) => resp.data);
  }

  getStudentTeachingMaterialView(courseId, memberId) {
    return this.get(`/course/${courseId}/student/${memberId}/teachingMaterialViewed`, null, this.auth.accessToken).then((resp) => (
      {
          member: resp.data.member,
          courseName: resp.data.courseName,
          teachingMaterials: resp.data.teachingMaterials
      }
    ));
  }

  getStudentAttendDateView(courseId, memberId) {
    return this.get(`/course/${courseId}/student/${memberId}/attendDate`, null, this.auth.accessToken).then((resp) => (
      {
          member: resp.data.member,
          courseName: resp.data.courseName,
          attendances: resp.data.attendances
      }
    ));
  }

  getStudentChapterScoresView(courseId, memberId) {
    return this.get(`/course/${courseId}/student/${memberId}/chapterScores`, null, this.auth.accessToken).then((resp) => (
      {
          member: resp.data.member,
          courseName: resp.data.courseName,
          chapters: resp.data.chapters,
          totalScore: resp.data.totalScore,
          totalScoreUploadAuthor: resp.data.totalScoreUploadAuthor,
          totalScoreUploadDate: resp.data.totalScoreUploadDate
      }
    ));
  }

  getStudentNoticeView(courseId, memberId) {
    return this.get(`/notices?memberId=${memberId}&courseId=${courseId}&startRecord=1&endRecord=99999999`, null, this.auth.accessToken).then((resp) => (
      {
          member: resp.data.member,
          courseName: resp.data.courseName,
          notices: resp.data.notices
      }
    ));
  }

  getCourseStudentScores(courseId, members) {
    return this.get(`/course/${courseId}/members/totalScore?members=[${members}]`, null, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  postAttendStudents(courseId, attendStudents) {
    return this.post(`/course/${courseId}/attendStudents`, attendStudents, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  postMemberScores(members, courseId, chapterId) {
    return this.put(`/course/${courseId}/chapter/${chapterId}/members/score`, members, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }

  postWebNotices(model) {
     return this.post(`/webNotices`, model, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }
  getTeachingMaterial(teachingMaterialId) {
    return this.get(`/teachingMaterial/${teachingMaterialId}`, null, this.auth.accessToken).then((resp) => resp.data);
  }

  updateTeachingMaterial(teachingMaterialId,teachingMaterial) {
    console.log('Enter API Teaching Material')
    return this.put(`/teachingMaterial/${teachingMaterialId}`, teachingMaterial, this.auth.accessToken).then((resp) => this.isSuccess(resp.data));
  }
   
}