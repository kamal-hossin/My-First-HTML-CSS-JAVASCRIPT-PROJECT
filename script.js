const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a";

const drinkColumn = document.getElementById("drinkColumn");
const groupCardContainer = document.getElementById("groupCardContainer");
const drinkCount = document.getElementById("drinkCount");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let group = [];

async function fetchDrinks(query = "") {
  const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  console.log(data);
  return data.drinks;
}

async function fetchDrinkById(id) {
  const res = await fetch(`www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
  const data = await res.json();
  return data.drinks[0];
}

function renderDrinks(list) {
  drinkColumn.innerHTML = "";
  if (!list) {
    drinkColumn.innerHTML = "<p>No drinks found.</p>";
    return;
  }

  list.forEach(drink => {
    const card = document.createElement("div");
    card.className = "drink-card";
    card.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
      <h4>${drink.strDrink}</h4>
      <p>Category: ${drink.strCategory}</p>
      <p>${drink.strInstructions.slice(0, 15)}...</p>
      <button class="addBtn">Add to Group</button>
      <button class="detailsBtn">Details</button>
    `;

    const addBtn = card.querySelector(".addBtn");
    const detailsBtn = card.querySelector(".detailsBtn");

    addBtn.addEventListener("click", () => {
      if (group.length >= 7) {
        alert("Cannot add more than 7 drinks!");
        return;
      }
      if (!group.includes(drink.strDrink)) {
        group.push(drink.strDrink);
        renderGroup();
      }
    });

    detailsBtn.addEventListener("click", async () => {
      const drink = await fetchDrinkById(drink.idDrink);
      modalBody.innerHTML = `
        <h3>${drink.strDrink}</h3>
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="width:100%; border-radius:5px;">
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        <p><strong>Ingredient 1:</strong> ${drink.strIngredient1 || 'N/A'}</p>
      `;
      modal.style.display = "flex";
    });

    drinkColumn.appendChild(card);
  });
}

function renderGroup() {
  groupCardContainer.innerHTML = "";
  group.forEach(item => {
    const card = document.createElement("div");
    card.className = "group-card";
    card.textContent = item;
    groupCardContainer.appendChild(card);
  });
  drinkCount.textContent = group.length;
}

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  const list = await fetchDrinks(query);
  renderDrinks(list);
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

(async () => {
  const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
  const data = await res.json();
  renderDrinks(data.drinks);
})();

