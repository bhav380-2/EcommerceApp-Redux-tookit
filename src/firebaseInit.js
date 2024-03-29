// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4YJp1w7Cl1R7Sbunja1NeOruY9exUtu0",
  authDomain: "buybusy-a2f1c.firebaseapp.com",
  projectId: "buybusy-a2f1c",
  storageBucket: "buybusy-a2f1c.appspot.com",
  messagingSenderId: "938637279535",
  appId: "1:938637279535:web:74e4eeb2ccdfa49ddfe1da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { app, auth };