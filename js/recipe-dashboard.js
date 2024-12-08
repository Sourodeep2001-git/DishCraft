import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getDatabase, ref as dbRef, set } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

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
const auth = getAuth(app);
const rtdb = getDatabase(app);

// DOM Elements
const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const logoutButton = document.getElementById('logout-button');

// Utility function to display a popup modal
const showModal = (message, type = 'success') => {
    const modalElement = document.getElementById('popupModal');
    const modalBody = document.querySelector('#popupModal .modal-body');
    const modalTitle = document.querySelector('#popupModal .modal-title');
  
    modalTitle.textContent = type === 'success' ? 'Success!' : 'Action Required';
    modalBody.textContent = message;
  
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};

// Track edit mode
let editMode = false;
let editId = null;

// Fetch Recipes from Firestore for the logged-in user
const fetchRecipes = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;
    const q = query(collection(db, 'recipes'), where('userId', '==', userEmail));
    const querySnapshot = await getDocs(q);

    recipeList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('col');
      recipeCard.innerHTML = `
        <div class="card h-100">
          <img src="${recipe.image}" class="card-img-top" alt="Recipe Image">
          <div class="card-body">
            <h5 class="card-title">${recipe.name}</h5>
            <p class="card-text"><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p class="card-text"><strong>Procedure:</strong> ${recipe.procedure}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary btn-sm edit-btn" data-id="${doc.id}" data-name="${recipe.name}" data-ingredients="${recipe.ingredients}" data-procedure="${recipe.procedure}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${doc.id}">Delete</button>
          </div>
        </div>
      `;
      recipeList.appendChild(recipeCard);
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
  }
};

// Convert image file to base64 string
const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Add or Edit Recipe
recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('recipe-name').value;
  const ingredients = document.getElementById('ingredients').value;
  const procedure = document.getElementById('procedure').value;
  const imageFile = document.getElementById('recipe-image').files[0];

  if (!imageFile) {
    showModal('Please upload an image for the recipe.', 'error');
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) return;

    const userEmail = user.email;

    // Convert image to base64 string
    const imageBase64 = await toBase64(imageFile);

    if (editMode) {
      const recipeRef = doc(db, 'recipes', editId);
      await updateDoc(recipeRef, { name, ingredients, procedure, image: imageBase64 });
      // Store image URL in Realtime Database
      await set(dbRef(rtdb, 'recipes/' + editId), {
        name,
        ingredients,
        procedure,
        image: imageBase64,
        userId: userEmail
      });
      showModal('Recipe updated successfully!', 'success');
      editMode = false;
      editId = null;
    } else {
      // Add new recipe
      const docRef = await addDoc(collection(db, 'recipes'), { 
        name, 
        ingredients, 
        procedure, 
        image: imageBase64, 
        userId: userEmail 
      });
      // Store image URL in Realtime Database
      await set(dbRef(rtdb, 'recipes/' + docRef.id), {
        name,
        ingredients,
        procedure,
        image: imageBase64,
        userId: userEmail
      });
      showModal('Recipe added successfully!', 'success');
    }
    recipeForm.reset();
    fetchRecipes();
  } catch (err) {
    console.error('Error saving recipe:', err);
    showModal('Error saving recipe. Please try again.', 'error');
  }
});

// Delete Recipe
recipeList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const recipeId = e.target.dataset.id;

    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      await set(dbRef(rtdb, 'recipes/' + recipeId), null); // Remove from Realtime DB
      showModal('Recipe deleted successfully!', 'success');
      fetchRecipes();
    } catch (err) {
      console.error('Error deleting recipe:', err);
      showModal('Error deleting recipe. Please try again.', 'error');
    }
  }

  // Edit Recipe
  if (e.target.classList.contains('edit-btn')) {
    editMode = true;
    editId = e.target.dataset.id;

    document.getElementById('recipe-name').value = e.target.dataset.name;
    document.getElementById('ingredients').value = e.target.dataset.ingredients;
    document.getElementById('procedure').value = e.target.dataset.procedure;

    showModal('Editing mode enabled. Make changes and save.', 'info');
  }
});

// Logout User
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth); // Log the user out
    showModal('You have been logged out successfully!', 'success'); // Show the logout popup
  } catch (err) {
    console.error('Error logging out:', err);
    showModal('Error logging out. Please try again.', 'danger');
  }
});

// Check User Authentication
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    fetchRecipes();
  }
});
