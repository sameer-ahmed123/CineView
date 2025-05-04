// Import the functions you need from the SDKs you need
const FIREBASE_API_KEY = import.meta.env.FIREBASE_API_KEY
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "cineview-f70fd.firebaseapp.com",
  projectId: "cineview-f70fd",
  storageBucket: "cineview-f70fd.firebasestorage.app",
  messagingSenderId: "481745677385",
  appId: "1:481745677385:web:3d96c1c3274bdf5cd22398",
  measurementId: "G-YGT1J3DB3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export {auth,db}