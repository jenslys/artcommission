// useLogout.ts
// Description: This custom hook contains the logic for logging out of the app. It uses the auth context to update the state of the app.
// Context: This custom hook is used in the Header component.
// Function: logout
// Variable: dispatch
// Variable: auth

import { useAuthContext } from './useAuthContext';

// firebase imports
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export const useLogout = () => {
  // This custom hook contains the logic for logging out of the app. It uses the auth context to update the state of the app.
  const { dispatch } = useAuthContext();

  const logout = () => {
    // This function will sign out the user and dispatch a LOGOUT action to the authContext that will set the user in the state to null
    signOut(auth)
      .then(() => {
        dispatch({ type: 'LOGOUT' }); // dispatch the user to the auth context
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { logout };
};
