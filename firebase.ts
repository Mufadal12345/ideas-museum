import * as firebaseApp from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAVp26636YGOwPIT8X6kWsxKWEnta3A0G4",
    authDomain: "ideas-museum.firebaseapp.com",
    projectId: "ideas-museum",
    storageBucket: "ideas-museum.firebasestorage.app",
    messagingSenderId: "776953892130",
    appId: "1:776953892130:web:b72d1a6e4c9b5f8290697b",
    measurementId: "G-FNKDJSJLE6"
};

const app = firebaseApp.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();