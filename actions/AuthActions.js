export function authorize(user, token){
  return {
      type: 'AUTH_SUCCESS',
      user,
      token
  }
}
