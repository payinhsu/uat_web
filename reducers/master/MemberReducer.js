export function teachers(state = [], action) {
  switch(action.type) {
    case 'MASTER_RECEIVE_TEACHERS':
      return Object.assign([], state, action.teachers);
    default:
      return state;
  }
}