export const SCHEMA_NEW_COURSE_DEF = {
    type:'object',
    required: ['name', 'rootCategoryIds', 'totalTime', 'price', 'level', 'imageFileKey', 'organizationId', 'brief', 'summaries', 'suitable'],
    properties:{
      name: {
        type: 'string',
        minLength: 1
      },
      rootCategoryIds: {
          type: 'array',
          minItems: 1
      },
      totalTime:{
        type: 'object',
        properties:{
          hours: {
            type: 'integer',
            minimum: 0
          },
          mins: {
            type: 'integer',
            minimum: 0
          }
        }
      },
      price: {
        type: 'integer',
        minimum: 0
      },
      level: {
        type: 'string',
        minLength: 1
      },
      imageFileKey: {
        type: 'string',
        minLength: 1
      },
      organizationId: {
        type: 'string',
        minLength: 1
      },
      brief: {
        type: 'string',
        minLength: 1
      },
      summaries: {
        type: 'string',
        minLength: 1
      },
      suitable: {
        type: 'string',
        minLength: 1
      }
    }
  };

export const SCHEMA_NEW_COURSE = {
  type:'object',
  required: ['name', 'forumName', 'signUpStartDate', 'signUpEndDate', 'totalTime', 'originalPrice', 'classAttribute' , 'quota', 'organizationId', 'teachers', 'imageFileKey', 'brief', 'summaries', 'schedules'],
  properties:{
    name: {
      type: 'string',
      minLength: 1
    },
    forumName: {
      type: 'string',
      minLength: 1
    },
    signUpStartDate: {
      type: 'string',
      minLength: 10
    },
    signUpEndDate: {
      type: 'string',
      minLength: 10
    },
    totalTime:{
      type: 'object',
      properties:{
        hours: {
          type: 'integer',
          minimum: 0
        },
        mins: {
          type: 'integer',
          minimum: 0
        }
      }
    },
    originalPrice: {
      type: 'integer',
      minimum: 0
    },
    quota:{
      type: 'object',
      properties:{
        min: {
          type: 'integer',
          minimum: 0
        },
        max: {
          type: 'integer',
          minimum: 0
        },
        single: {
          type: 'integer',
          minimum: 0
        },
        group: {
          type: 'integer',
          minimum: 0
        }
      }
    },
    classAttribute: {
      type: 'string',
      minLength: 1
    },
    organizationId: {
      type: 'string',
      minLength: 1
    },
    teachers: {
        type: 'array',
        minItems: 1
    },
    imageFileKey: {
      type: 'string',
      minLength: 1
    },
    brief: {
      type: 'string',
      minLength: 1
    },
    summaries: {
      type: 'string',
      minLength: 1
    },
    schedules: {
        type: 'array',
        minItems: 1
    }
  }
};

export const SCHEMA_COURSE_SCHEDULE = {
    type:'object',
    required: ['date', 'startTime', 'endTime', 'localeId'],
    properties:{
      date: {
        type: 'string',
        minLength: 10
      },
      startTime: {
        type: 'string',
        minLength: 5
      },
      endTime: {
        type: 'string',
        minLength: 5
      },
      localeId: {
        type: 'string',
        minLength: 1
      },
    }
  };

export const SCHEMA_NEW_QUESTION = {
  type:'object',
  required: ['no', 'category', 'necessaryAttribute', 'type', 'answerAtrribute', 'content'],
  properties:{
    no: {
        type: 'string',
        minLength: 1
    },
    category: {
        type: 'string',
        minLength: 1
    },
    necessaryAttribute: {
        type: 'string',
        minLength: 1
    },
    type: {
        type: 'string',
        minLength: 1
    },
    answerAtrribute: {
        type: 'string',
        minLength: 1
    },
    content: {
        type: 'string',
        minLength: 1
    }
  }
};

export const SCHEMA_COURSE_PLANNING = {
  type:'object',
  required: ['id', 'description', 'order'],
  properties:{
    id: {
        type: 'string',
        minLength: 1
    },
    description: {
        type: 'string',
        minLength: 1
    },
    order: {
      type: 'integer',
      minimum: 0
    }
  }
};

export const SCHEMA_NEW_EXAM_QUESTION = {
  type:'object',
  required: ['chapterId', 'content'],
  properties:{
    chapterId: {
      type: 'string',
      minLength: 1
    },
    content: {
      type: 'string',
      minLength: 1
    }
  }
};