// googleAuth.js

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '961032350119-10lps0qlksqaj0aojbk7eejbc4ukdo16.apps.googleusercontent.com',
    offlineAccess: true,
  });
};

export const useGoogleLogin = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  return { signInWithGoogle };
};
