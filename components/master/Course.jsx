import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import ScheduleDialog from 'components/master/ScheduleDialog';
import ScheduleDetailDialog from 'components/master/ScheduleDetailDialog';
import CoursePlanningDialog from 'components/master/CoursePlanningDialog';
// import CourseDefPicker from 'components/master/CourseDefPicker';
import TeachersPicker from 'components/master/TeachersPicker';
import Document from 'components/Document';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import tv4 from 'tv4';
import {SCHEMA_NEW_COURSE} from 'lib/schema';
import * as CourseActions from 'actions/master/CourseActions';
import * as DefinitionActions from 'actions/master/DefinitionActions';
import * as MemberActions from 'actions/master/MemberActions';
import moment from 'moment';
import _ from 'lodash';

/**
 * props.master.course: 要被變輯的 course(如果有的話)
 * props.master.copyCourse: 要被複製 course
 * 建立班級: 檢查 props.copyCourse (有值就複製相關資料)
 * 編輯班級:
 */
export default class Course extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // dialog control
      openTeachersPicker:false,
      openCourseSchedule:false,
      openCourseScheduleDetail: false,
      openPlanningDialog: false,
      course: props.master.course || this.emptyCourseModel(),
      editingSchedule: undefined,                              // 紀錄目前點選編輯的 schedule
      planning: undefined,                                     // 紀錄目前點選編輯的 planning
      // apiModel: props.master.courseDef || NewCourseDef.emptyCourseDefModel
      // apiModel: props.params && props.params.courseDefId ? props.master.courseDef : NewCourseDef.emptyCourseDefModel
    };

    this.state.courseImagePath = this.state.course.imageThumbnailPath
    this.state.courseVideoPath = this.state.course.videoThumbnailPath

    // 如果 course instance 本身沒有 courseDefId 的話，它的來源就是新增課程。
    this.state.isNotNew = !this.props.params.courseDefId;//!this.state.course.courseDefId;
    if(!this.state.isNotNew) this.state.course.courseDefId = this.props.params.courseDefId;
    this.state.courseDef = props.master.courseDefs.find(courseDef => courseDef.id === this.state.course.courseDefId);
    // 如果是新課程，即套用複製課程、課程定義資訊。
    if(!this.state.isNotNew && this.props.params.courseDefId){
      this.applyCourseDefInfo();
      if(props.master.copyCourse) this.applyCourse(props.master.copyCourse);
    }
    // this.state.editModel = this.toEditModel(this.state.apiModel);
  }

  // 套用要被複製的班級資料
  applyCourse(courseToCopy){
    this.state.course.schedules = _.cloneDeep(courseToCopy.schedules);
    this.state.course.planning = _.cloneDeep(courseToCopy.planning);
    return this.state.course;
  }

  // 套用課程定義檔的資料對相關班級欄位進行重設.
  applyCourseDefInfo(){
    const courseDef = this.state.courseDef;
    Object.assign(this.state.course, {
      originalPrice: courseDef.price,
      sellPrice: courseDef.price,
      totalTime:{
        hours: courseDef.totalTime.hours,
        mins: courseDef.totalTime.mins
      },
      organizationId: courseDef.organizationId,
      brief: courseDef.brief,
      summaries: courseDef.summaries,
    });
  }

  static onEnter(store){
    return (nextState, replace, callback) => {
      console.log('enter Course.jsx onEnter');
      CourseActions.getCourseDefs({organizationId:'1', rootCategoryId:'0'})(store.dispatch, store.getState).then(() => {
        MemberActions.getTeachers()(store.dispatch, store.getState).then(() => {
          DefinitionActions.getDefinitions()(store.dispatch, store.getState).then(() => {
            // if (store.getState().master.course) {
            if(nextState.params && nextState.params.courseId) {
              // 因為 props.course 可能非完整的 course detail 資料 (可能由選單設值), 所以在進入時固定重新取 detail 資料.
              CourseActions.getCourse(nextState.params.courseId)(store.dispatch, store.getState).then(() => callback());
            }
            else callback();
          });
        });
      })
    }
  }
  /** 離開頁面前，清空班級資料 */
  static onLeave(store){
    return () => {
      console.log('Course.jsx onLeave called');
      store.dispatch(CourseActions.setCourse(null));
      store.dispatch(CourseActions.setCopyCourse(null));
    };
  }

  componentDidMount() {
    // if(this.props.params && this.props.params.courseDefId){
    //   this.props.getCourseDef(this.props.params.courseDefId);
    // }
  };

  emptyCourseModel = () => {
    return {
      courseDefId: undefined,
      name: '',
      isBanner: false,
      forumName: '',
      signUpStartDate: moment().format("YYYY-MM-DD"),
      signUpEndDate: moment().format("YYYY-MM-DD"),
      totalTime:{
        hours: 0,
        mins: 0
      },
      originalPrice: 0,
      sellPrice: 0,
      quota: {
        min: 0,
        max: 0,
        single: 0,
        group: 0
      },
      classAttribute: 'S',
      organizationId: undefined,
      organizationName: '',
      teachers: [],
      imageFileKey: undefined,
      videoFileKey: undefined,
      brief: '',
      summaries: '',
      planning: [],
      schedules: [],
      // 以下不在 api Model 中.
      imageFileName: '',
      videoFileName: '',

      imageThumbnailPath: undefined,
      videoThumbnailPath: undefined
    };
  };

  createCourse = () => {
    const course = this.toApiModel(this.state.course);
    let valid = tv4.validate(course, SCHEMA_NEW_COURSE);
    if(tv4.error){
      if (tv4.error.message === 'name' || tv4.error.dataPath.indexOf('name') > -1 ) {
        window.alert( "班級名稱項目為必填");
      }else if (tv4.error.message === 'forumName' || tv4.error.dataPath.indexOf('forumName') > -1) {
        window.alert( "公開討論區名稱項目為必填");
      }else if (tv4.error.message === 'signUpStartDate' || tv4.error.dataPath.indexOf('signUpStartDate') > -1) {
        window.alert( "報名開始日期項目為必填");
      }else if (tv4.error.message === 'signUpEndDate' || tv4.error.dataPath.indexOf('signUpEndDate') > -1) {
        window.alert( "報名結束日期項目為必填");
      }else if (tv4.error.message === 'schedules' || tv4.error.dataPath.indexOf('schedules') > -1) {
        window.alert( "上課日期項目為必填");
      }else if (tv4.error.message === 'totalTime' || tv4.error.dataPath.indexOf('totalTime') > -1) {
        window.alert( "時數項目為必填");
      }else if (tv4.error.message === 'originalPrice' || tv4.error.dataPath.indexOf('originalPrice') > -1) {
        window.alert( "課程費用定價項目為必填");
      }else if (tv4.error.message === 'classAttribute' || tv4.error.dataPath.indexOf('classAttribute') > -1) {
        window.alert( "班級屬性項目為必填");
      }else if (tv4.error.message.indexOf('min') > -1 || tv4.error.dataPath.indexOf('quota/min') > -1) {
        window.alert( "人數限制最少人數項目為必填");
      }else if (tv4.error.message.indexOf('max') > -1 || tv4.error.dataPath.indexOf('quota/max') > -1) {
        window.alert( "人數限制最多人數項目為必填");
      }else if (tv4.error.message.indexOf('single') > -1 || tv4.error.dataPath.indexOf('quota/single') > -1) {
        window.alert( "線上人數項目為必填");
      }else if (tv4.error.message.indexOf('group') > -1 || tv4.error.dataPath.indexOf('quota/group') > -1) {
        window.alert( "機構人數項目為必填");
      }else if (tv4.error.message === 'organizationId' || tv4.error.dataPath.indexOf('organizationId') > -1) {
        window.alert( "主辦單位項目為必填");
      }else if (tv4.error.message === 'teachers' || tv4.error.dataPath.indexOf('teachers') > -1) {
        window.alert( "授課講師項目為必填");
      }else if (tv4.error.message === 'imageFileKey' || tv4.error.dataPath.indexOf('imageFileKey') > -1) {
        window.alert( "開班圖片項目為必填");
      }else if (tv4.error.message === 'brief' || tv4.error.dataPath.indexOf('brief') > -1) {
        window.alert( "課程簡介項目為必填");
      }else if (tv4.error.message === 'summaries' || tv4.error.dataPath.indexOf('summaries') > -1) {
        window.alert( "課程大綱項目為必填");
      }
    }
    else{
      // business logic checking
      let err;
      if(course.quota.single + course.quota.group > course.quota.max) err = `線上人數(${course.quota.single}) + 構機人數(${course.quota.group}) 不可超過設定人數(${course.quota.max})`
      if(course.quota.min > course.quota.max) err = `最少人數(${course.quota.min})不可超過設定人數(${course.quota.max})`
      // else if(...) err = '...';
      if(err){
        window.alert(err);
      } else {
        // check teacher have master teacher.
        // console.log(JSON.stringify(this.state.course.teachers)) ;
        let masterTeacher = this.state.course.teachers.find( t => t.isMain === true )
        if(masterTeacher) {
            this.props.createCourse(course).then(this.props.history.goBack());
        } else {
            alert("請選擇主要的授課講師") ;
        }
        // this.props.createCourse(course).then(this.props.history.push('/master/admin/courses'));
      }
    }
  };

  updateCourse = () => {
    const course = this.toApiModel(this.state.course);
    let valid = tv4.validate(course, SCHEMA_NEW_COURSE);
    console.log(course);
    if(tv4.error){
      if (tv4.error.message === 'name' || tv4.error.dataPath.indexOf('name') > -1 ) {
        window.alert( "班級名稱項目為必填");
      }else if (tv4.error.message === 'forumName' || tv4.error.dataPath.indexOf('forumName') > -1) {
        window.alert( "公開討論區名稱項目為必填");
      }else if (tv4.error.message === 'signUpStartDate' || tv4.error.dataPath.indexOf('signUpStartDate') > -1) {
        window.alert( "報名開始日期項目為必填");
      }else if (tv4.error.message === 'signUpEndDate' || tv4.error.dataPath.indexOf('signUpEndDate') > -1) {
        window.alert( "報名結束日期項目為必填");
      }else if (tv4.error.message === 'schedules' || tv4.error.dataPath.indexOf('schedules') > -1) {
        window.alert( "上課日期項目為必填");
      }else if (tv4.error.message === 'totalTime' || tv4.error.dataPath.indexOf('totalTime') > -1) {
        window.alert( "時數項目為必填");
      }else if (tv4.error.message === 'originalPrice' || tv4.error.dataPath.indexOf('originalPrice') > -1) {
        window.alert( "課程費用定價項目為必填");
      }else if (tv4.error.message === 'classAttribute' || tv4.error.dataPath.indexOf('classAttribute') > -1) {
        window.alert( "班級屬性項目為必填");
      }else if (tv4.error.message.indexOf('min') > -1 || tv4.error.dataPath.indexOf('quota/min') > -1) {
        window.alert( "人數限制最少人數項目為必填");
      }else if (tv4.error.message.indexOf('max') > -1 || tv4.error.dataPath.indexOf('quota/max') > -1) {
        window.alert( "人數限制最多人數項目為必填");
      }else if (tv4.error.message.indexOf('single') > -1 || tv4.error.dataPath.indexOf('quota/single') > -1) {
        window.alert( "線上人數項目為必填");
      }else if (tv4.error.message.indexOf('group') > -1 || tv4.error.dataPath.indexOf('quota/group') > -1) {
        window.alert( "機構人數項目為必填");
      }else if (tv4.error.message === 'organizationId' || tv4.error.dataPath.indexOf('organizationId') > -1) {
        window.alert( "主辦單位項目為必填");
      }else if (tv4.error.message === 'teachers' || tv4.error.dataPath.indexOf('teachers') > -1) {
        window.alert( "授課講師項目為必填");
      }else if (tv4.error.message === 'imageFileKey' || tv4.error.dataPath.indexOf('imageFileKey') > -1) {
        window.alert( "開班圖片項目為必填");
      }else if (tv4.error.message === 'brief' || tv4.error.dataPath.indexOf('brief') > -1) {
        window.alert( "課程簡介項目為必填");
      }else if (tv4.error.message === 'summaries' || tv4.error.dataPath.indexOf('summaries') > -1) {
        window.alert( "課程大綱項目為必填");
      }
    }
    else{
      // business logic checking
      let err;
      if(course.quota.single + course.quota.group > course.quota.max) err = `線上人數(${course.quota.single}) + 構機人數(${course.quota.group}) 不可超過設定人數(${course.quota.max})`;
      if(course.quota.min > course.quota.max) err = `最少人數(${course.quota.min})不可超過設定人數(${course.quota.max})`;
      // else if(...) err = '...';
      if(err){
        window.alert(err);
      } else {
        // check teacher have master teacher.
        //console.log(JSON.stringify(this.state.course.teachers)) ;
        let masterTeacher = this.state.course.teachers.find( t => t.isMain === true )
        if(masterTeacher) {
            // alert("have master teacher") ;
            this.props.updateCourse(course).then(this.props.history.goBack());
        } else {
            alert("請選擇主要的授課講師") ;
        }
        
      }
    }
  };

  /** view model to api model (for api access) */
  toApiModel = (course) =>{
    return Object.assign({}, course,
      {
        totalTime: {
          hours: parseInt(course.totalTime.hours),
          mins: parseInt(course.totalTime.mins)
        },
        originalPrice: parseInt(course.originalPrice),
        sellPrice: parseInt(course.sellPrice),
        quota: {
          min: parseInt(course.quota.min),
          max: parseInt(course.quota.max),
          single: parseInt(course.quota.single),
          group: parseInt(course.quota.group)
        }
      }
    )
  };

  /** api model to edit model (for editing) */
  toEditModel = (courseDef) =>{
    // return Object.assign({}, courseDef, {
    //   afterLearn:{
    //     positions: get104ItemsByIds('position', courseDef.afterLearn.positions),
    //     abilities: get104ItemsByIds('ability', courseDef.afterLearn.abilities),
    //     tools: get104ItemsByIds('tool', courseDef.afterLearn.tools),
    //     skills: get104ItemsByIds('skill', courseDef.afterLearn.skills)
    //   }
    // });
  }

  onCloseTeachersDialog = () => {
      this.setState({openTeachersPicker:false});
  }

  onConfirmTeachers = (teachers) => {
    this.state.course.teachers = teachers;
    this.setState({course: this.state.course});
  }

  onClosePicker = () => {
    this.setState({
      openTeachersPicker:false,
      openCourseSchedule:false,
      openCourseScheduleDetail:false,
      openPlanningDialog: false
    });
  };

  onConfirmSchdule = (schedule) => {
    this.onClosePicker();
    this.state.course.schedules.push(schedule);
    this.state.course.schedules.sort((s1, s2) => (s1.date + s1.startTime) > (s2.date + s2.startTime) ? 1 : -1);
    this.setState({
      openCourseSchedule: false,
      course: this.state.course
    });
  };

  onConfirmPlanning = (planning) => {
    console.log('confirm planning > ' + JSON.stringify(planning));
    this.onClosePicker();
    this.state.course.planning.push(planning);            // course.planning is an array.
    this.state.course.planning.sort((p1, p2) => p1.order > p2.order ? 1 : -1);
    this.setState({
      openPlanningDialog: false,
      course: this.state.course
    });
    console.log('state plannings > ' + JSON.stringify(this.state.course.planning));
  }

  removePlanning(index, e){
    e.preventDefault();
    this.state.course.planning.splice(index, 1);
    this.setState({course: this.state.course});
  }

  onConfirmScheduleDetails = (schedule) => {
    this.onClosePicker();
    Object.assign(this.state.editingSchedule, {
      date: schedule.date,
      details: schedule.details
    });
    this.state.course.schedules.sort((s1, s2) => (s1.date + s1.startTime) > (s2.date + s2.startTime) ? 1 : -1);
    this.setState({
      openCourseScheduleDetail: false,
      course: this.state.course
    });

    let addTeachers = schedule.details.filter(d => d.teacherId != this.state.course.teachers.memberId) ;
    //console.log("add teachers  : " + JSON.stringify(addTeachers) );

    // this.state.course.teachers.push 
    addTeachers.map (addTeacher => {
      let pushTeacher = this.props.master.definition.teachers.find( t => t.id === addTeacher.teacherId) ;
      console.log("pushTeacher : " + JSON.stringify(pushTeacher)) ;
      if(this.state.course.teachers.find(tt => tt.memberId === pushTeacher.id)) {

      } else {
        this.state.course.teachers.push({
          "familyName" : pushTeacher.familyName,
          "firstName" : pushTeacher.firstName,
          "isMain" : false, 
          "memberId" : pushTeacher.id 
        });
      }
      
      console.log("add teacher : " + JSON.stringify(this.state.course.teachers)) ;
    }) ;
  }

  handleChangeCourse = (field, e) => {
    let nextCourse = Object.assign({}, this.state.course);
    nextCourse[field] = e.target.value;
    this.setState({course:nextCourse});
  }

  // 上傳並取得程課圖片後更新的 callback
  handleChangeImage = (field, url) => {
    this.state.course[field] = url;
    this.setState({course:this.state.course});
  }

  handleChangeIsBanner = (e) => {
    let nextCourse = Object.assign({}, this.state.course);
    nextCourse.isBanner = e.target.checked;
    this.setState({course:nextCourse});
  }

  handleChangeQuota = (field, e) => {
    let nextCourse = Object.assign({}, this.state.course);
    nextCourse.quota[field] = e.target.value;
    this.setState({course:nextCourse});
  }

  handleChangeCourseDate = (field, e, date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    let nextCourse = Object.assign({}, this.state.course);
    nextCourse[field] = dateStr;
    this.setState({course:nextCourse});
  }

  // handleImageChange = (e) => {
  //   e.preventDefault();
  //   this.state.course.imageFileKey = e.target.files[0].name;
  //   this.setState({course: this.state.course});
  // };

  handleUploadImage = (fileKey, fileName) => {
    this.state.course.imageFileKey = fileKey;
    this.state.course.imageFileName = fileName;
    this.setState({course: this.state.course});
    console.log('state after upload image > ' + JSON.stringify(this.state));
  };

  handleUploadVideo = (fileKey, fileName) => {
    this.state.course.videoFileKey = fileKey;
    this.state.course.videoFileName = fileName;
    this.setState({course: this.state.course});
    console.log('state after upload video > ' + JSON.stringify(this.state));
  };

  // handleUploadVideo = (fileKey) => {
  //   this.state.course.imageFileKey = fileKey;
  //   this.setState({course: this.state.course});
  //   console.log('state after upload image > ' + JSON.stringify(this.state));
  // };

  handleVideoChange = (e) => {
     e.preventDefault();
    this.state.course.videoFileKey = e.target.files[0].name;
    this.setState({course: this.state.course});
  };

  handleOpenTeachersPicker = (e) => {
    e.preventDefault();
    this.setState({openTeachersPicker:true});
  };

  handleOpenScheduleDialog = (e) => {
    e.preventDefault();
    this.setState({openCourseSchedule:true});
  };

  removeSchedule(index, e){
    e.preventDefault();
    this.state.course.schedules.splice(index, 1);
    this.setState({course: this.state.course});
  }

  handleOpenPlanningDialog = (e) => {
    e.preventDefault();
    this.setState({openPlanningDialog:true});
  }

  handleTotalTimeHoursChange = (e) => {
    this.state.course.totalTime.hours = e.target.value;
    this.setState({course: this.state.course});
  };

  handleTotalTimeMinsChange = (e) => {
    this.state.course.totalTime.mins = e.target.value;
    this.setState({course: this.state.course});
  };

  /** 將原始行程資料轉換成 UI 呈現的格式 */
  scheduleToUIFields(schedules){
    const out = schedules.map(schedule => {
      return {
        date: schedule.date,
        weekDay: moment(schedule.date).format('E'),
        timeRange: `${schedule.startTime} - ${schedule.endTime}`,
        locale: schedule.localeId
      };
    });
    return out;
  }

  settingCourseDetails(schedule, e){
    e.preventDefault();
    this.setState({editingSchedule: schedule, openCourseScheduleDetail: true});
  }

  goBack = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  render() {
    let childProps = Object.assign({}, this.props);
    delete childProps.children;


    const dayNames = ['周一','周二','周三','周四','周五','周六','周日'];
    return (
      <div id="courseDefs-view">
        <div>
          <div className="component-title">
            <h4>{this.state.isNotNew ? '編輯班級' : '新增班級'}</h4>
            <div className="component-title-btns">
              {this.state.isNotNew ? <button type="button" onClick={this.updateCourse}>更新班級</button> : <button type="button" onClick={this.createCourse}>建立班級</button> }
              <button type="button" onClick={this.goBack}>取消</button>
            </div>
          </div>
        </div>
        <form className="component-form">
          <table>
            <tbody>
              <tr>
                <td>開班編號</td><td><input type="text" value={this.state.course.id} disabled={true} /></td><td></td><td></td>
              </tr>
              <tr>
                <td>*對應課程</td><td>{this.state.courseDef.name}</td>
                <td></td><td></td>
              </tr>
              <tr>
                <td>*班級名稱</td><td><input type="text" value={this.state.course.name} onChange={this.handleChangeCourse.bind(this, 'name')} /></td>
                <td><label><input type="checkbox" checked={this.state.course.isBanner} onChange={this.handleChangeIsBanner} />設定為熱門課程</label></td>
                <td></td>
              </tr>
              <tr>
                <td>*公開討論區名稱</td><td><input type="text" value={this.state.course.forumName} onChange={this.handleChangeCourse.bind(this, 'forumName')} /></td>
              </tr>
              <tr>
                <td>*報名日期</td>
                <td><DatePicker value={moment(this.state.course.signUpStartDate).toDate()} onChange={this.handleChangeCourseDate.bind(this, 'signUpStartDate')} /></td>
                <td> ～ </td>
                <td><DatePicker value={moment(this.state.course.signUpEndDate).toDate()} onChange={this.handleChangeCourseDate.bind(this, 'signUpEndDate')} /></td>
              </tr>
              <tr>
                <td>*上課日期</td><td><button type="button" onClick={this.handleOpenScheduleDialog} >建立上課日期</button></td><td></td><td></td>
              </tr>
              <tr>
                <td></td>
                <td colSpan="4">
                  <table className="schedule-table">
                    <thead><tr><td>日期</td><td>星期</td><td>時間</td><td>場地</td><td>行程設定</td><td>刪除</td></tr></thead>
                    <tbody>
                      {this.scheduleToUIFields(this.state.course.schedules).map((schedule, index) => (
                        <tr key={`schedule_${index}`}>
                          <td>{schedule.date}</td>
                          <td>{schedule.weekDay}</td>
                          <td>{schedule.timeRange}</td>
                          <td>{this.props.master.definition.locales.find(l => l.id === schedule.locale).name}</td>
                          <td><button type="button" onClick={this.settingCourseDetails.bind(this, this.state.course.schedules[index])}>設定</button></td>
                          <td><button type="button" onClick={this.removeSchedule.bind(this, index)}>刪除</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>*時數</td>
                <td><input type="number" value={this.state.course.totalTime.hours} onChange={this.handleTotalTimeHoursChange} /> 小時</td>
                <td><input type="number" max="60" value={this.state.course.totalTime.mins} onChange={this.handleTotalTimeMinsChange} /> 分</td>
                <td></td>
              </tr>
              <tr>
                <td>*課程費用</td>
                <td>定價 <input type="number" value={this.state.course.originalPrice} onChange={this.handleChangeCourse.bind(this, 'originalPrice')} />元</td>
                <td>優惠價 <input type="number" value={this.state.course.sellPrice} onChange={this.handleChangeCourse.bind(this, 'sellPrice')} /> 元</td>
                <td></td>
              </tr>
              <tr>
                <td>*班級屬性</td>
                <td>
                  <select value={this.state.course.quota.classAttribute} onChange={this.handleChangeCourse.bind(this, 'classAttribute')} >
                    <option value="S" >標準班級</option>
                    <option value="O" >機構包班</option>
                    <option value="M" >混合班級</option>
                  </select>
                </td><td></td><td></td>
              </tr>
              <tr>
                <td>*人數限制</td>
                <td>開班最少人數 <input type="number" value={this.state.course.quota.min} onChange={this.handleChangeQuota.bind(this, 'min')} /></td>
                <td>最多不可超過 <input type="number" value={this.state.course.quota.max} onChange={this.handleChangeQuota.bind(this, 'max')} /></td>
                <td></td>
              </tr>
              <tr>
                <td>*線上人數</td>
                <td><input type="number" value={this.state.course.quota.single} onChange={this.handleChangeQuota.bind(this, 'single')} /></td>
                <td>*機構人數</td>
                <td><input type="number" value={this.state.course.quota.group} onChange={this.handleChangeQuota.bind(this, 'group')} /></td>
              </tr>
              <tr>
                <td>*主辦單位</td>
                <td>
                  <select value={this.state.course.organizationId} onChange={this.handleChangeCourse.bind(this, 'organizationId')} disabled={true} >
                    {this.props.master.definition.organizations.map(org => <option key={`org_${org.id}`} value={org.id} >{org.name}</option>)}
                  </select>
                </td><td></td><td></td>
              </tr>
              <tr>
                <td>*授課講師</td>
                <td colSpan="3">
                  <input type="text" value={this.state.course.teachers.map(t => `${t.familyName}${t.firstName}`).join('、')} onClick={this.handleOpenTeachersPicker} />
                </td>
              </tr>
              <tr>
                <td>*開班圖片:</td>
                <td>
                  <Document
                    auth={this.props.auth}
                    docType="image"
                    convertType="course-image"
                    onUpload={this.handleUploadImage}
                    onFileUrl={this.handleChangeImage.bind(this, 'imageThumbnailPath')}
                    displayTag="WebThumbnail"
                  />{this.state.course.imageFileName}</td>
                <td></td>
                <td> {this.state.course.imageThumbnailPath !== 'fileKeyIsEmpty' ? <img src={this.state.course.imageThumbnailPath}/> : ''} </td>
              </tr>
              <tr>
                <td>簡介影片:</td>
                <td>
                  <Document
                    auth={this.props.auth}
                    docType="video"
                    convertType="course-video"
                    onUpload={this.handleUploadVideo}
                    onFileUrl={this.handleChangeImage.bind(this, 'videoThumbnailPath')}
                    displayTag="WebThumbnail"
                  />{this.state.course.videoFileName}</td>
                <td></td>
                <td> {this.state.course.videoThumbnailPath !== 'fileKeyIsEmpty' ? <img src={this.state.course.videoThumbnailPath}/> : ''} </td>
              </tr>
              <tr><td>*課程簡介:</td><td colSpan="3"><textarea value={this.state.course.brief} onChange={this.handleChangeCourse.bind(this, 'brief')} /></td></tr>
              <tr><td>*課程大綱:</td><td colSpan="3"><textarea value={this.state.course.summaries} onChange={this.handleChangeCourse.bind(this, 'summaries')} /></td></tr>
              <tr><td>課程架構:</td><td colSpan="3">
                <table className="schedule-table">
                  <thead><tr><td><button type="button" onClick={this.handleOpenPlanningDialog}>新增</button></td><td>順序</td><td>類別</td><td>說明</td></tr></thead>
                  <tbody>
                    {this.state.course.planning.map((p, index) => 
                      <tr>
                        <td><button type="button" onClick={this.removePlanning.bind(this, index)}>刪除</button></td>
                        <td>{p.order}</td>
                        <td>{this.props.master.definition.plannings.find(planning => planning.id === p.id).name}</td>
                        <td>{p.description}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td></tr>
            </tbody>
          </table>
        </form>
        <TeachersPicker open={this.state.openTeachersPicker} teachers={this.props.master.teachers} defaultTeachers={this.state.course.teachers} onConfirm={this.onConfirmTeachers} onRequestClose={this.onCloseTeachersDialog} />
        <ScheduleDialog open={this.state.openCourseSchedule} excludeDays={this.state.course.schedules.map(s => s.date)} master={this.props.master} onConfirm={this.onConfirmSchdule} onRequestClose={this.onClosePicker} setDate={true} />
        <CoursePlanningDialog open={this.state.openPlanningDialog} plannings={this.props.master.definition.plannings} onConfirm={this.onConfirmPlanning} onRequestClose={this.onClosePicker} />
        {this.state.editingSchedule ? <ScheduleDetailDialog open={this.state.openCourseScheduleDetail} teachers={this.props.master.teachers} excludeDays={this.state.course.schedules.map(s => s.date)} schedule={this.state.editingSchedule} definition={this.props.master.definition} onRequestClose={this.onClosePicker} onConfirm={this.onConfirmScheduleDetails} /> : '' }
        {this.props.children && React.cloneElement(this.props.children, childProps)}
      </div>
    );
  }
}