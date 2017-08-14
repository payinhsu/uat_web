
import axios from 'axios';

export default class BaseAPI{
  constructor(name, API_BASE_URL) {
    this.name = name;
    this.API_BASE_URL = API_BASE_URL;
  }

  get(apiPath, params, token){
  	const url = this.API_BASE_URL + apiPath;
    console.log('with header: ' + JSON.stringify({Authorization: `Bearer ${token}`}))

    return axios.get(url, {
      headers: {Authorization: `Bearer ${token}`},
      params
    }).then(this.checkResponse);
  }

  put(apiPath, params, token){
  	const url = this.API_BASE_URL + apiPath;
    console.log('putting > ' + url);
    console.log('with header: ' + JSON.stringify({Authorization: `Bearer ${token}`}))

    return axios.put(url, params, {
      headers: {Authorization: `Bearer ${token}`}
    }).then(this.checkResponse);
  }

  post(apiPath, params, token){
  	const url = this.API_BASE_URL + apiPath;
    console.log('posting > ' + url);
    console.log('with header: ' + JSON.stringify({Authorization: `Bearer ${token}`}))

    return axios.post(url, params, {
      headers: {Authorization: `Bearer ${token}`}
    }).then(this.checkResponse);
  }

  checkResponse(resp){
    if(resp.data && resp.data.returnCode && resp.data.returnCode && resp.data.returnCode === '000'){
      return resp;
    }
    else{
      console.log(`into alert > resp.data.returnCode: ${resp.data.returnCode}, resp.data.returnMsg: ${resp.data.returnMsg}`);
      alert(resp.data.returnMsg);
      Promise.reject(resp.data.returnMsg);
    }
  }

  isSuccess(resp){
    return resp && resp.returnCode && resp.returnCode === '000';
  }
}