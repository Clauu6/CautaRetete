const form = document.getElementById('recipeForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Impiedica reincarcarea paginii

  const query = searchInput.value.trim();
  if (!query) return;

  // Afisam un mesaj de incarcare
  resultsContainer.innerHTML = '<p style="text-align:center;">Se cauta retetele...</p>';

  try {
    // Apelam API-ul TheMealDB
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Eroare la conectarea cu serverul');
    }

    const data = await response.json();

    // Verificam daca am primit rezultate
    if (!data.meals) {
      resultsContainer.innerHTML = '<p style="text-align:center;">Nu s-a gasit nicio reteta pentru acest ingredient.</p>';
      return;
    }

    // Curatam containerul si afisam retetele sub forma de carduri HTML5
    displayRecipes(data.meals);

  } catch (error) {
    console.error('Eroare:', error);
    resultsContainer.innerHTML = '<p style="text-align:center; color: red;">A aparut o eroare. Incearca din nou mai tarziu.</p>';
  }
});

function displayRecipes(meals) {
  resultsContainer.innerHTML = meals.map(meal => `
    <article class="card">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="card-content">
        <h3>${meal.strMeal}</h3>
        <p><strong>Categorie:</strong> ${meal.strCategory}</p>
        <p><strong>Origine:</strong> ${meal.strArea}</p>
        <p style="margin-top: 0.5rem;"><a href="${meal.strYoutube}" target="_blank" rel="noopener">Vezi reteta video pe YouTube</a></p>
      </div>
    </article>
  `).join('');
}