// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const db = getFirestore(app);

const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

// Form Submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    await addDoc(collection(db, "contacts"), { name, email, message, timestamp: new Date() });

    successMessage.classList.remove("d-none");
    successMessage.style.display = "block";

    contactForm.reset();

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error("Error saving message:", error);
  }
});
