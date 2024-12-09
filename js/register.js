// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase config
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

const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the displayName after registration
    await updateProfile(user, {
      displayName: name
    });

    // Store user info in Firestore with user.uid as the document ID
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      password : password,
      uid: user.uid // Use UID as the document ID
    });

    // Show success popup
    alert("Registration successful! Please login.");

    // Redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error registering user:", error.message);
    alert(error.message); // Show error message in popup
  }
};

// Event listener for form submission
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Call registerUser function
  registerUser(name, email, password);
});
