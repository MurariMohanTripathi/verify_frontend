// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

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

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };