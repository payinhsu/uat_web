import SeniorApi from 'api/SeniorAPI'

export function sendSms(sms){
	return (dispatch, getState) => {
		return new SeniorApi(getState().auth).sendSms(sms).then((smsResponse)=> dispatch(receiveSms(smsResponse)))
	}
}

export function receiveSms(smsResponse){
  return {
    type:'SEND_SMS',
    smsResponse
  }
}

export function getSmsStatus(responseCode){ 
    return (dispatch, getState) => { 
        return new SeniorApi(getState().auth).getSmsStatus(responseCode).then((res)=> dispatch(receiveStatus(res))) 
    }
 }

  export function receiveStatus(response){ 
    return { 
        type:'GET_SMS_STATUS', 
        smsStatus:response 
    }
 }
