import api from 'api/MasterAPI';

export function getTeachers() {
  return (dispatch, getState) => {
    return new api(getState().auth).getTeachers().then(teachers=> dispatch(receiveTeachers(teachers)));
  }
}

export function receiveTeachers(teachers){
    return {
        type: 'MASTER_RECEIVE_TEACHERS',
        teachers
    }
}