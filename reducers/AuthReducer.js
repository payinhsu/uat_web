export function auth(state={}, action) {
  switch(action.type) {
    case 'AUTH_SUCCESS':
      return {user:action.user, token:action.token};
    default:
      return state;
  }
}
