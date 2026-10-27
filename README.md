# Culinary Hub - Recipe Search Application

Proiect Web realizat utilizând HTML5, CSS Responsiv și JavaScript.

## Descrierea proiectului
Aplicația permite căutarea rețetelor culinare din baza de date TheMealDB în funcție de ingrediente și categorii, precum și salvarea rețetelor favorite folosind localStorage.

## Tehnologii utilizate
- HTML5 Semantic: `<header>`, `<main>`, `<section>`, `<dialog>`, `<form>`
- CSS3 Responsiv: Flexbox, CSS Grid și `@media queries`
- JavaScript (ES6+): Fetch API (async/await), manipulare DOM, localStorage
- API Sursă: TheMealDB API (https://www.themealdb.com/)

## Structura proiectului
- index.html - Structura paginii web
- style.css - Stilizarea și adaptabilitatea pe mobil/desktop
- script.js - Logica de preluare date din API și manipulare UI
- ReadMe.md - Documentația proiectului

## Funcționalități
1. Căutare rețete după ingredientul principal.
2. Filtrare rețete după Categorie (Seafood, Vegetarian, Dessert etc.).
3. Afișare detalii complete (ingrediente și mod de preparare) într-o fereastră modală nativă HTML5 (`<dialog>`).
4. Salvarea rețetelor la "Favorites" cu persistență de date prin localStorage.
5. Interfață complet adaptabilă pentru dispozitive mobile și desktop.
