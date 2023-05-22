// This code is used to login a user with an email and password. It will also dispatch a LOGIN action to the authContext that will set the user in the state

import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

// firebase imports
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const useLogin = () => {
  // This custom hook contains the logic for logging in a user with an email and password. It uses the auth context to update the state of the app.
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const login = (email, password) => {
    // This function will sign in the user and dispatch a LOGIN action to the authContext that will set the user in the state
    setError(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: 'LOGIN', payload: res.user }); // dispatch the user to the auth context
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return { error, login };
};
