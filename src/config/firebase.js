import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import * as firebaseui from 'firebaseui';
import {getFirestore} from "firebase/firestore";
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig);
export const authentication =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const ui = new firebaseui.auth.AuthUI(authentication);
const db = getFirestore(app);

export { app, db, ui };