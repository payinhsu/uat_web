import {admins} from 'mapping';
var config = require('config-prod');

export function requireAuth(store){
  return (nextState, replace) => {
    const auth = store.getState().auth;
    if (!auth || !auth.id) {
      replace({
        pathname: `${config.webContext}login`,
        state: {nextPathname: nextState.location.pathname},
        query: { from: 'portalWeb' }
      });
      return false;
    }
    if(!admins.find(admin => admin.pid === auth.pid)){
      replace({
        pathname: config.webContext,
        state: {nextPathname: nextState.location.pathname},
        query: { from: 'portalWeb' }
      });
      return false;
    }
    return true;
  }
}