import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCc6wz54j-rFgrirQ8Rl7pljxXvYxGN0to",
  authDomain: "voyzi-b26a9.firebaseapp.com",
  projectId: "voyzi-b26a9",
  storageBucket: "voyzi-b26a9.appspot.com",
  messagingSenderId: "1090441995437",
  appId: "1:1090441995437:android:b932a7db644afce87ed224",
};


const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
