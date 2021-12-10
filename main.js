'use strict;'
const shuffle = document.getElementById('shuffleBtn');
const resultHeading = document.getElementById('result-title');
const singleMeals = document.getElementById('single-meal');
const search = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchWord');
const meals = document.getElementById('meals');
const mealInfo = document.querySelectorAll('.meal-info');

function getSearchMenu() {
	const keyword = searchInput.value;

	fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
	.then(response => response.json())
	.then(datas => {
		// console.log(datas.meals);
		const dataMeals = datas.meals;

		displayNoneAll();

		if(dataMeals == null) {
			resultHeading.style.display = 'block';
			resultHeading.innerText = "검색 결과가 없습니다. 다시 시도해주세요!";
		}
		else {
			meals.style.display = "flex";

			meals.innerHTML = `
			<h2>Search results for '${keyword}':</h2>`;

			addSearchMenuList(dataMeals);
		}
	})
	.catch(console.log);
}

function addSearchMenuList(dataMeals) {
	// console.log(dataMeals);

	dataMeals.forEach(meal => {
	meals.innerHTML += `
		<div class="menuImg">
			<img src="${meal.strMealThumb}">
			<div class="meal-info" data-Id="${meal.idMeal}" onclick="getMealId(${meal.idMeal})">
				<h3>${meal.strMeal}</h3>
			</div>
		</div>
		`;
	});
}


function getMealId(mealId) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
	.then(response => response.json())
	.then(data => {
		const meal = data.meals[0];

		setDisplayFlex();
		addMealsHTML(meal);
	})
	.catch(console.log);
}

function getShuffleMenu() {
	fetch("https://www.themealdb.com/api/json/v1/1/random.php")
	.then(response => response.json())
	.then(data => {
		//console.log(data.meals[0]);
		const meal = data.meals[0];

		displayNoneAll();
		setDisplayFlex();
		addMealsHTML(meal);
	})
	.catch(console.log);
}

function addMealsHTML(meal) {
	const ingredients = [];

	for(let i = 1 ; i <= 20; i++) {
		if(meal[`strIngredient${i}`]){
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
		}
		else {
			break;
		}
	}

	singleMeals.innerHTML = `
	<div class="single-meals">
		<h1>${meal.strMeal}</h1>
		<img src="${meal.strMealThumb}" />
		<div class="category-area">
			<p>${meal.strCategory}<br>${meal.strArea}</p>
		</div>
		<div class="flex">
			<p class="instruction">${meal.strInstructions}</p>
			<h2 class="single-ing-title">Ingredients</h2>
			<ul class="ing-list">${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
		</div>
	</div>
	`;
}

function setDisplayFlex() {
	singleMeals.style.display = "flex";
	singleMeals.style.justifyContent = 'center';
}

function displayNoneAll() {
	resultHeading.style.display = 'none';
	meals.style.display = 'none';
	singleMeals.style.display = 'none';
}

search.addEventListener('click', getSearchMenu);
shuffle.addEventListener('click', getShuffleMenu);