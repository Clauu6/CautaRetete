const recipeForm = document.getElementById('recipeForm');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const resultsContainer = document.getElementById('resultsContainer');

const modal = document.getElementById('recipeModal');
const closeModal = document.getElementById('closeModal');
const modalDetails = document.getElementById('modalDetails');

let currentTab = 'all';

// Preluăm favoritele salvate în browser (localStorage)
function getFavorites() {
  return JSON.parse(localStorage.getItem('myFavoriteRecipes')) || [];
}

// Salvăm sau ștergem o rețetă din favorite
function toggleFavorite(mealId) {
  let favorites = getFavorites();
  if (favorites.includes(mealId)) {
    favorites = favorites.filter(id => id !== mealId);
  } else {
    favorites.push(mealId);
  }
  localStorage.setItem('myFavoriteRecipes', JSON.stringify(favorites));
  
  // Reîncărcăm secțiunea curentă
  if (currentTab === 'favorites') {
    loadFavoriteRecipes();
  } else {
    handleSearch();
  }
}

// Comutare între tab-uri
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tabAll').classList.toggle('active', tab === 'all');
  document.getElementById('tabFavorites').classList.toggle('active', tab === 'favorites');

  if (tab === 'favorites') {
    loadFavoriteRecipes();
  } else {
    handleSearch();
  }
}

// Căutare formular
recipeForm.addEventListener('submit', (e) => {
  e.preventDefault();//Oprește reîncărcarea paginii când dai submit la formular
  switchTab('all');
});

closeModal.addEventListener('click', () => modal.close());

window.addEventListener('DOMContentLoaded', () => {
  resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Use the search bar above to find delicious recipes!</p>';
});

// ce API folosim(categorie,text-box)
async function handleSearch() {
  const query = searchInput.value.trim();
  const category = categorySelect.value;

  if (category && !query) {
    fetchRecipesByCategory(category);
  } else if (query) {
    fetchRecipesByIngredient(query);
  } else {
    fetchRecipesByIngredient('chicken');
  }
}

// Căutare după ingredient
async function fetchRecipesByIngredient(ingredient) {
  showLoading();
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(ingredient)}`);
    const data = await res.json();
    displayRecipes(data.meals);
  } catch (err) {
    showError();
  }
}

// Căutare după categorie (cu detalii complete)
async function fetchRecipesByCategory(category) {
  showLoading();
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`);
    const data = await res.json();

    if (!data.meals) {
      displayRecipes(null);
      return;
    }

    const detailedMealsPromises = data.meals.slice(0, 12).map(async (meal) => {
      const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const detailData = await detailRes.json();
      return detailData.meals[0];
    });

    const fullMeals = await Promise.all(detailedMealsPromises);
    displayRecipes(fullMeals);
  } catch (err) {
    showError();
  }
}

// Încărcare rețete salvate la favorite
async function loadFavoriteRecipes() {
  showLoading();
  const favoriteIds = getFavorites();

  if (favoriteIds.length === 0) {
    resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No saved recipes yet. Click the heart icon on any recipe to save it for later!</p>`;
    return;
  }

  try {
    const promises = favoriteIds.map(async (id) => {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await res.json();
      return data.meals[0];
    });

    const favoriteMeals = await Promise.all(promises);
    displayRecipes(favoriteMeals);
  } catch (err) {
    showError();
  }
}

// Afișarea cardurilor cu buton de inima (Favorite)
function displayRecipes(meals) {
  if (!meals) {
    resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No recipes found.</p>`;
    return;
  }

  const favorites = getFavorites();

  resultsContainer.innerHTML = meals.map(meal => {
    const isFav = favorites.includes(meal.idMeal);
    return `
      <article class="card">
        <button class="fav-btn" onclick="toggleFavorite('${meal.idMeal}')" title="Save for later">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" onclick="openRecipeDetails('${meal.idMeal}')">
        <div class="card-body" onclick="openRecipeDetails('${meal.idMeal}')">
          <h3 class="card-title">${meal.strMeal}</h3>
          <div class="badge-group">
            ${meal.strCategory ? `<span class="badge">Category: ${meal.strCategory}</span>` : ''}
            ${meal.strArea ? `<span class="badge">Area: ${meal.strArea}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Deschidere detalii în modal
async function openRecipeDetails(mealId) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    const meal = data.meals[0];

    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
        ingredients += `<li>${meal[`strMeasure${i}`] || ''} ${meal[`strIngredient${i}`]}</li>`;
      }
    }

    modalDetails.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; height:250px; object-fit:cover; border-radius:12px;">
      <h2 style="margin-top:1rem;">${meal.strMeal}</h2>
      <p style="color:#64748b; margin-bottom:1rem;">Category: <strong>${meal.strCategory}</strong> | Area: <strong>${meal.strArea}</strong></p>
      
      <h3>Ingredients:</h3>
      <ul style="margin: 0.5rem 0 1.5rem 1.5rem;">
        ${ingredients}
      </ul>

      <h3>Instructions:</h3>
      <p class="instructions-text">${meal.strInstructions}</p>
    `;

    modal.showModal();
  } catch (err) {
    console.error("Failed to load recipe details", err);
  }
}

function showLoading() {
  resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Loading recipes...</p>`;
}

function showError() {
  resultsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">An error occurred while connecting to the API.</p>`;
}