/** load definitions */

import api from 'api/MasterAPI';

/**
 * {  teachers, categories, organizations }
 */
export function getDefinitions() {
  return (dispatch, getState) => {
    return new api(getState().auth).getDefinitions().then((definitions)=> dispatch(receiveDefinitions(definitions)));
  }
}

export function receiveDefinitions(definitions){
    return {
        type: 'MASTER_RECEIVE_DEFINITIONS',
        definitions
    }
}

// export function getCategories() {
//   return (dispatch, getState) => {
//     return new api(getState().auth).getCategories().then((categories)=> dispatch(receiveCategories(categories)));
//   }
// }

// export function receiveCategories(categories){
//     return {
//         type: 'MASTER_RECEIVE_CATEGORIES',
//         categories
//     }
// }
