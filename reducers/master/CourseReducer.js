import _ from 'lodash';

export function courseDefs(state = [], action) {
  switch(action.type) {
    case 'MASTER_RECEIVE_COURSEDEFS':
      return action.courseDefs;
    default:
      return state;
  }
}


export function courseDef(state = {}, action) {
  switch(action.type) {
    case 'RECEIVE_COURSE_DETAIL':
      return action.courseDef;
    default:
      return state;
  }
}

export function question(state = {}, action) {
  switch(action.type) {
    case 'RECEIVE_QUESTION_DETAIL':
      return action.question;
    default:
      return state;
  }
}

export function examQuestion(state = {}, action) {
  switch(action.type) {
    case 'RECEIVE_EXAMQUESTION_DETAIL':
      return action.examQuestion;
    case 'MASTER_SET_EXAMQUESTION':
      return action.examQuestion;
    default:
      return state;
  }
}


export function questions(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_QUESTIONS':
      return action.questions;
    default:
      return state;
  }
}

export function examQuestions(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_EXAMQUESTIONS':
      return action.examQuestions;
    default:
      return state;
  }
}


export function teachingMaterials(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_TEACHING_MATERIALS':
      return action.teachingMaterials;
    default:
      return state;
  }
}

export function courses(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_COURSES':
      return action.courses;
    case 'MASTER_CLEAN_COURSES':
      return [];
    default:
      return state;
  }
}

export function copyCourses(state = [], action) {
  switch(action.type) {
    case 'MASTER_RECEIVE_COPY_COURSES':
      return action.courses;
    case 'MASTER_CLEAN_COPY_COURSES':
      return [];
    default:
      return state;
  }
}

export function copyCourse(state = null, action) {
  switch(action.type) {
    case 'MASTER_SET_COPY_COURSE':
      return action.course;
    case 'MASTER_CLEAN_COPY_COURSE':
      return null;
    default:
      return state;
  }
}

/** 設定 course，有值時 Course.jsx 會在有值時進入編輯模式，在沒值(null)時，進入新增模式 **/
export function course(state = null, action) {            // 編輯課程的目標 course
  switch(action.type) {
    case 'RECEIVE_COURSE':
      return action.course;
    case 'MASTER_SET_COURSE':
      return action.course;
    default:
      return state;
  }
}

export function members(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_COURSE_ORDER_MEMBERS':
      return action.members;
    default:
      return state;
  }
}

export function paidMembers(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_COURSE_PAID_MEMBERS' :
      return action.members;
    default:
      return state;
  }
}

export function activities(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_COURSE_ACTIVITIES':
      return action.activities;
    default:
      return state;
  }
}

export function activity(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_ACTIVITY' : 
      return action.activity ;
    case 'MASTER_SET_ACTIVITY':
      return action.activity ;
    default : 
      return state;
  }
}

export function questionnaire(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_ACTIVITY_STATISTICS' : 
      return action.questionnaire ;
    default : 
      return state;
  }
}

export function memberCoursePaidUploadRecord(state = [], action) {
    switch(action.type) {
        case 'RECEIVE_MEMBER_COURSE_PAID_UPLOAD_RECORD' :
            return action.memberCoursePaidUploadRecord ;
        default : 
            return state;
    }
}

export function memberCourseRefundUploadRecord(state = [], action) {
    switch(action.type) {
        case 'RECEIVE_MEMBER_COURSE_REFUND_UPLOAD_RECORD' :
            return action.memberCourseRefundUploadRecord ;
        default : 
            return state;
    }
}

export function teachingMaterialView(state = [], action) {
    switch(action.type) {
        case 'RECEIVE_TEACHING_MATERIAL_VIEW' :
            return action.teachingMaterialView ;
        default : 
            return state;
    }
}

export function attendDateView(state = [], action) {
    switch(action.type) {
        case 'RECEIVE_ATTEND_DATE_VIEW' :
            return action.attendDateView ;
        default : 
            return state;
    }
}

export function chapterScoresView(state = [], action) {
    switch(action.type) {
        case 'RECEIVE_CHAPTER_SCORES_VIEW' :
            return action.chapterScoresView ;
        default : 
            return state;
    }
}

export function noticeView(state = [], action) {
    switch(action.type) {
        case 'RECEIVE_NOTICE_VIEW' :
            return action.noticeView ;
        default : 
            return state;
    }
}

export function teachingMaterial(state = [], action) {
  switch(action.type) {
    case 'RECEIVE_TEACHING_MATERIAL':
      return action.teachingMaterial;
    default:
      return state;
  }
}
