  export const initialStore=()=>{
    return{
      token: sessionStorage.getItem('access_token') || null,
      user: JSON.parse(sessionStorage.getItem('user') || 'null'),
      isAuthenticated: !!sessionStorage.getItem('access_token'),
      isLoading: false,
      authError: null
    }
  }

  export default function storeReducer(store, action = {}) {
    switch(action.type){
      case 'set_hello':
        return {
          ...store,
          message: action.payload
        };
        
      case'login_start':
      return {
        ...store,
        isLoading: true,
        authError: null
      };

      case 'login_success':
        sessionStorage.setItem('access_token', action.payload.token);
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));

        return{
          ...store,
          token: action.payload.token,
          user: action.payload.user,
          isAuthenticated: true,
          isLoading: false,
          authError: null
        };

      case 'login_error':
        return {
          ...store,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          authError: action.payload
        };

      case 'logout':
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user');

        return {
          ...store,
          token: null,
          user: null,
          isAuthenticated: false,
          authError: null
        };

      case 'clear_auth_error':
        return {
          ...store,
          authError: null,
          isLoading: false
        };

      default:
        throw Error('Unknown action: ' + action.type);
    }    
  }
