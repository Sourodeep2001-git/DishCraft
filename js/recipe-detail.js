import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase Configuration
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

const recipeDetail = document.getElementById("recipe-detail");
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

const fetchRecipeDetails = async () => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    const recipeDoc = await getDoc(recipeRef);

    if (recipeDoc.exists()) {
      const recipe = recipeDoc.data();

      const userRef = doc(db, "users", recipe.userId);
      const userDoc = await getDoc(userRef);
      const authorName = userDoc.exists() ? userDoc.data().name : "Unknown";

      recipeDetail.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" alt="${recipe.name}" class="img-fluid rounded mb-4">
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Procedure:</strong> ${recipe.procedure}</p>
        <p><strong>Author:</strong> ${authorName}</p>
      `;
    } else {
      recipeDetail.innerHTML = "<p>Recipe not found.</p>";
    }
  } catch (err) {
    console.error("Error fetching recipe details:", err);
    recipeDetail.innerHTML = "<p>Error loading recipe details.</p>";
  }
};

fetchRecipeDetails();