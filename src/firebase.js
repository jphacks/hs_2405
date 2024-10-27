// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPX24ODEh06CFVtPRmM44DK8eue7B30qM",
  authDomain: "euhjphack.firebaseapp.com",
  projectId: "euhjphack",
  storageBucket: "euhjphack.appspot.com",
  messagingSenderId: "910945181811",
  appId: "1:910945181811:web:903618a7bab924079c8a06",
  measurementId: "G-SG8QEC8EKW"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);


export { auth, analytics, db };  
