// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcl4TrqfjofKvcMnl-oBQSLo0R020HYaA",
  authDomain: "dishcraft-f95f3.firebaseapp.com",
  projectId: "dishcraft-f95f3",
  storageBucket: "dishcraft-f95f3.firebasestorage.app",
  messagingSenderId: "373853687903",
  appId: "1:373853687903:web:a5f990737d712259328bea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, setDoc, getDoc };
