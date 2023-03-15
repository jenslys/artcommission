// Import the necessary modules from React and Firebase
import { createContext, useReducer, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Create a new context object
export const AuthContext = createContext();

// Define the authentication reducer function
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

// Create a new component for the authentication context provider
// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  // Use the authReducer function to manage the state of the authentication context
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  // Use the useEffect hook to listen for changes in the user authentication state
  useEffect(() => {
    // Subscribe to the onAuthStateChanged event in Firebase Authentication
    const unsub = onAuthStateChanged(auth, (user) => {
      // Update the authentication context state with the user object
      dispatch({ type: 'AUTH_IS_READY', payload: user });
      // Unsubscribe from the onAuthStateChanged event
      unsub();
    });
  }, []);

  //console.log('AuthContext state:', state);

  // Return the AuthContext provider component with the state and dispatch values as context
  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};
