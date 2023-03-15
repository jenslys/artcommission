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
  const { dispatch } = useAuthContext();

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: 'LOGOUT' });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { logout };
};
