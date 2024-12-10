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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recipeList = document.getElementById("recipe-list");
const searchInput = document.getElementById("search-input");

let allRecipes = []; 

async function fetchAllRecipes() {
  try {
    const snapshot = await getDocs(collection(db, "recipes"));
    allRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
    displayRecipes(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
  }
}

function displayRecipes(recipesToDisplay) {
  recipeList.innerHTML = ''; 
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

  const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
  viewRecipeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const recipeId = e.target.getAttribute('data-id');
      window.location.href = `recipe-detail.html?id=${recipeId}`;
    });
  });

  if (recipesToDisplay.length === 0) {
    recipeList.innerHTML = '<p>No recipes found. Please try a different search.</p>';
  }
}

function searchRecipes() {
  const query = searchInput.value.trim().toLowerCase();

  if (query === '') {
    displayRecipes(allRecipes);
  } else {
    const filteredRecipes = allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query)
    );
    displayRecipes(filteredRecipes);
  }
}

searchInput.addEventListener('input', searchRecipes);

fetchAllRecipes();
