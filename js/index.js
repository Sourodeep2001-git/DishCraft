import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

// DOM Elements
const recipeList = document.getElementById("recipe-list");
const searchInput = document.getElementById("search-input");

let allRecipes = []; // Array to store all recipes

// Fetch and Display All Recipes
async function fetchAllRecipes() {
  try {
    const snapshot = await getDocs(collection(db, "recipes"));
    allRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Store recipes in `allRecipes`

    // Display all recipes initially
    displayRecipes(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
  }
}

// Function to display recipes dynamically
function displayRecipes(recipesToDisplay) {
  recipeList.innerHTML = ''; // Clear the current recipe list
  recipesToDisplay.forEach(recipe => {
    const recipeCard = `
      <div class="recipe-card">
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
        <h3>${recipe.name}</h3>
        <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
      </div>
    `;
    recipeList.innerHTML += recipeCard;
  });

  // Attach event listeners to "View Recipe" buttons
  const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
  viewRecipeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const recipeId = e.target.getAttribute('data-id');
      // Redirect to the detailed recipe page with the recipe ID
      window.location.href = `recipe-detail.html?id=${recipeId}`;
    });
  });

  // Show "No results found" if no recipes match
  if (recipesToDisplay.length === 0) {
    recipeList.innerHTML = '<p>No recipes found. Please try a different search.</p>';
  }
}

// Function to handle recipe search
function searchRecipes() {
  const query = searchInput.value.trim().toLowerCase();

  if (query === '') {
    // If the search input is cleared, display all recipes
    displayRecipes(allRecipes);
  } else {
    // Filter recipes based on the search query
    const filteredRecipes = allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query)
    );
    displayRecipes(filteredRecipes);
  }
}

// Add event listener to search input
searchInput.addEventListener('input', searchRecipes);

// Initial call to load and display all recipes
fetchAllRecipes();
