// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClSjq40CeH_1Wyg2hw1uBJwpNsjreBLK0",
  authDomain: "verify-2db20.firebaseapp.com",
  projectId: "verify-2db20",
  storageBucket: "verify-2db20.firebasestorage.app",
  messagingSenderId: "449409839791",
  appId: "1:449409839791:web:4a1724ef6cdaeca3041a5a",
  measurementId: "G-ZSWL4K9JTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);