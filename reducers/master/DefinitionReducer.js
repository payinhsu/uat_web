export function definition(state = {categories:[], courseDefs:[], locales:[]}, action) {
  switch(action.type) {
    case 'MASTER_RECEIVE_CATEGORIES':
      return Object.assign({}, state, {categories: action.categories});
    case 'MASTER_RECEIVE_COURSEDEFS':
      return Object.assign({}, state, {courseDefs: action.courseDefs});
    case 'MASTER_RECEIVE_DEFINITIONS':
      return Object.assign({}, state, action.definitions);
    default:
      return state;
  }
}