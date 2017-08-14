export function sms(state = '', action) {
  switch(action.type) {
    case 'SEND_SMS':
      return action.smsResponse;
    default:
      return state;
  }
}

export function smsStatus(state = '', action) { 
  switch(action.type) { 
    case 'GET_SMS_STATUS': 
      return action.smsStatus; 
    default: 
      return state; 
  }
 }