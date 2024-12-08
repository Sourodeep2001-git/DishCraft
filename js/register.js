// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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
const db = getDatabase(app);

const registerForm = document.getElementById("register-form");

const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the displayName after registration
    await updateProfile(user, {
      displayName: name
    });

    console.log("User registered successfully with name:", name);
    window.location.href = "login.html"; // Redirect after registration
  } catch (error) {
    console.error("Error registering user:", error.message);
  }
};

// Example usage: Call registerUser() with user inputs
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  registerUser(name, email, password);

      // Update profile with display name
      updateProfile(user, { displayName: name }).then(() => {
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
      });
    })
    .catch((error) => {
      alert(error.message);
    });

