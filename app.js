document.getElementById("searchFood").addEventListener("click", (event) => {
  const searchedFood = document.getElementById("foodName").value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedFood}`)
    .then((res) => res.json())
    .then((data) => {
      displayFood(data);
    });
});

const displayFood = (foods) => {
  const foodContainer = document.getElementById("foodContainer");
  foodContainer.innerHTML = "";

  if (foods.meals && Array.isArray(foods.meals)) {
    foods.meals.forEach((food) => {
      const div = document.createElement("div");
      div.classList.add("foodCard");

      div.innerHTML = `
            <img class="food-img" src="${food.strMealThumb}" >
            <div class="innerText">
              <h6> Name:  ${food.strMeal.slice(0, 20)} </h6>              
              <p> Category:  ${food.strCategory} </p>
              <p> Area:  ${food.strArea} </p>     
              <p>
                ${
                  food.strYoutube
                    ? `<a id="youtube" href="${food.strYoutube}"><i class="fab fa-youtube"></i></a>`
                    : ""
                }
                ${
                  food.strSource
                    ? `<a id="link" href="${food.strSource}"><i class="fas fa-link"></i></a>`
                    : ""
                }
              </p>
              
              <button id="${food.idMeal}" onclick="handleAddToCart('${
        food.idMeal
      }','${food.strMealThumb}', '${food.strCategory}', '${food.strMeal.slice(
        0,
        20
      )}')" type="button" class="btnAdd btn btn-outline-secondary">Add to Cart</button>
              <button id='detailsBtn-${
                food.idMeal
              }' onclick="handleSingleFood('${food.idMeal}')" type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>

            </div>
        `;
      foodContainer.appendChild(div);
      NoFoodFound.classList.add("d-none");
    });
  } else {
    const NoFoodFound = document.getElementById("NoFoodFound");
    NoFoodFound.classList.remove("d-none");
  }
};

const displaySingleFood = (food) => {
  const detailsOfFood = document.getElementById("modal-data");
  detailsOfFood.innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("SinglefoodCard");

  const foodDetails = food[0];
  const ingredients = [];
  for (let i = 0; i < 20; i++) {
    const ingredient = foodDetails[`strIngredient${i + 1}`];
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  let ingredientsList = '<ul class="ingredientsList">';
  ingredients.forEach((element) => {
    ingredientsList += `<li> ${element} </li>`;
  });
  ingredientsList += "</ul>";

  div.innerHTML = `
      <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel"> ${foodDetails.strMeal} </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">    
          <img class="food-img" src="${foodDetails.strMealThumb}" > 

          <h6> Details </h6>
          <p> Category: <strong> ${foodDetails.strCategory} </strong> </p>
          <p> Area: <strong> ${foodDetails.strArea} </strong> </p>     
          <p> Related Links: ${ foodDetails.strYoutube ? `<a id="youtube" href="${foodDetails.strYoutube}"><i class="fab fa-youtube"></i></a>` : ""} 
            ${ foodDetails.strSource ? `<a id="link" href="${foodDetails.strSource}"><i class="fas fa-link"></i></a>` : "" }
          </p>

          <h6 class="mt-5"> Ingredients </h6>
          <hr>
          ${ingredientsList}
      </div>    
  `;

  detailsOfFood.appendChild(div);
};

const loadAllFood = () => {
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=e")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayFood(data);
    });
};

const handleSingleFood = (idMeal) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.meals)
      displaySingleFood(data.meals);
    })
    .catch((error) => {
      console.error("Error fetching meal details:", error);
    });
};

const handleAddToCart = (idMeal, strMealThumb, strCategory, strMeal) => {
  const totalFood = document.getElementById("totalFood").innerText;
  let convertedCount = parseInt(totalFood);
  convertedCount += 1;

  // console.log(convertedCount, idMeal)
  if (convertedCount >= 12) {
    console.log("Max limit reached");
    alert("You have reached the max limit");
  } else {
    if (convertedCount <= 11) {
      document.getElementById("totalFood").innerText = convertedCount;

      const totalDessert = document.getElementById("totalDessert").innerText;
      let convertedTotalDessertCount = parseInt(totalDessert);
      if (strCategory == "Dessert") convertedTotalDessertCount += 1;
      document.getElementById("totalDessert").innerText =
        convertedTotalDessertCount;

      const totalBeef = document.getElementById("totalBeef").innerText;
      let convertedTotalBeefCount = parseInt(totalBeef);
      if (strCategory == "Beef") convertedTotalBeefCount += 1;
      document.getElementById("totalBeef").innerText = convertedTotalBeefCount;

      const totalVegetarian =
        document.getElementById("totalVegetarian").innerText;
      let convertedTotalVegetarianCount = parseInt(totalVegetarian);
      if (strCategory == "Vegetarian") convertedTotalVegetarianCount += 1;
      document.getElementById("totalVegetarian").innerText =
        convertedTotalVegetarianCount;

      const totalOthers = document.getElementById("totalOthers").innerText;
      let convertedTotalOtherFoodCount = parseInt(totalOthers);
      if (
        strCategory != "Dessert" &&
        strCategory != "Beef" &&
        strCategory != "Vegetarian"
      )
        convertedTotalOtherFoodCount += 1;
      document.getElementById("totalOthers").innerText =
        convertedTotalOtherFoodCount;

      const container = document.getElementById("tableItems");
      const tr = document.createElement("tr");
      tr.classList.add("food-item");

      tr.innerHTML = ` 
      <td> ${convertedCount} </td>  
      <td> <img class="table-img" src="${strMealThumb}" > </td>  
      <td colspan="6">${strMeal}</td>
      `;

      container.appendChild(tr);

      const selectedFood = document.getElementById(idMeal);
      selectedFood.innerText = "Already Selected";
      selectedFood.classList.remove("btn-outline-secondary");
      selectedFood.classList.add("btn-outline-danger");
      selectedFood.disabled = true;
    }
  }
};

loadAllFood();
