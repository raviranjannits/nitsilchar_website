import { initializeApp, } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import {getAuth} from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB6jNTy67yQN7rABfvTkZj1RArbjzLi9O0",
  authDomain: "event-app-1ccd1.firebaseapp.com",
  databaseURL: "https://event-app-1ccd1-default-rtdb.firebaseio.com",
  projectId: "event-app-1ccd1",
  storageBucket: "event-app-1ccd1.appspot.com",
  messagingSenderId: "580558805436",
  appId: "1:580558805436:web:928783766d525f87c673b9"
};


// firebase.firestore().settings({ experimentalForceLongPolling: true });
export const FIREBASE_APP=initializeApp(firebaseConfig);
export const FIRESTORE_DB=getFirestore(FIREBASE_APP);
export const FIRESTORE_STRG=getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH=initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)     
});



