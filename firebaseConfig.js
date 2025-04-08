import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzRBc3Kz-bVCGS6rW-jBIxN2r8efmFEOI",
  authDomain: "voyzi-b7eef.firebaseapp.com",
  projectId: "voyzi-b7eef",
  storageBucket: "voyzi-b7eef.appspot.com",
  messagingSenderId: "961032350119",
  appId: "1:961032350119:android:107f173df55d6b385aee82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Set up persistent Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { auth, db, storage };
