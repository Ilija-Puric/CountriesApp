const main = document.getElementsByTagName("main")[0];
const mainContent = document.getElementById("mainContent");
const buttonAllCountries = document.getElementById("buttonAllCountries");
const buttonRandomCountry = document.getElementById("buttonRandomCountry");
const buttonTrivia = document.getElementById("buttonTrivia");

let allCountries = [];
function generateAllCountries() {
  if (!buttonAllCountries.getAttribute("active")) {
    if (allCountries.length <= 250) {
      allCountries = [];
      let i = 0;
      while (i < 250) {
        allCountries.push(JSON.parse(localStorage.getItem(i)));
        i++;
      }
    }
    loadTime();
    let html = createAllCountriesHTML();

    const styleForAllCountries = document.createElement("link");
    styleForAllCountries.rel = "stylesheet";
    styleForAllCountries.href = "style/allCountries.css";
    document.head.append(styleForAllCountries);

    main.appendChild(mainContent.children[3]);
    main.removeChild(mainContent);
    main.insertAdjacentHTML("beforeend", html);
    const containerCountries = document.getElementById("allCountriesContainer");
    containerCountries.style.display = "none";

    setTimeout(createGrid, 1400);

    function loadTime() {
      let spinner = document.createElement("div");
      spinner.classList.add("spinner");
      main.append(spinner);
    }
    function createGrid() {
      for (const country of allCountries) {
        let populationTotal;
        if (country.population >= 1000 && country.population <= 999999) {
          populationTotal =
            Number.parseFloat(country.population / 1000).toFixed(2) + "K";
        }
        if (country.population >= 1000000) {
          populationTotal =
            Number.parseFloat(country.population / 1000000).toFixed(2) + "M";
        }
        let divHtml = `
                <div class="country">
                <img class="flagPrimary" src="${country.flag}" alt="no flag">
                <p class="name">${country.name}</p>
                <p class="capital">Capital: ${country.capital}</p>
                <p class="continents">Continent: ${country.continent}</p>
                <p class="population">Population: ${populationTotal}</p>
                `;
        containerCountries.innerHTML += divHtml;
      }
      setTimeout(() => {
        containerCountries.style.display = "";
        mainContent.id = "slideAllCountries";
        mainContent.classList.add("tabsAnimationUp");
        main.removeChild(document.getElementsByClassName("spinner")[0]);
      }, 1000);
    }
  }
  buttonAllCountries.setAttribute("active", 1);

  function createAllCountriesHTML() {
    return `

    <!-- 
    <div id="dropdownFilters">
    </div>
    <div id="filters">
    </div>
    -->
    <form id="formFilters">
      <fieldset id="fieldsetFilters">
        <legend>Filters</legend>
        <div>
          <label for="name">Country name:</label>
          <input type="text" id="name" name="name">
        </div>
        <div>
          <label for="continent">Continent:</label>
          <select name="continent" id="continent">
            <option value=""></option>
          </select> 
        </div>
        <div>
          <label for="language">Language:</label>
          <select name="language" id="language">
            <option value=""></option>
          </select> 
        </div>
        <div>
          <label for="population">Population:</label>
          <input type="range" id="population" name="population">
        </div>
        <fieldset>
        <legend>Is in UN:</legend>
          <div>
            <label for="unMemberY">Yes:</label>
            <input type="radio" id="unMemberY" name="unMember">
          </div>
          <div>
            <label for="unMemberN">No:</label>
            <input type="radio" id="unMemberN" name="unMember">
          </div>
        </fieldset>
        <div>
        <label for="carSide">Left side driving lane:</label>
        <input type="checkbox" id="carSide" name="carSide">
        </div>
      </fieldset>
    </form> 

    <div id="allCountriesContainer">
    </div>
  `;
  }
}

buttonAllCountries.addEventListener("click", generateAllCountries);

// function detaljnije() {
//   //DETALLJNIJE
//   //   <div class="country">
//   //   <img class="flagPrimary" src="${country.flag}" alt="no flag">
//   //   <p class="name">${country.name}</p>
//   //   <p class="capital">${country.capital}</p>
//   //   <p class="continents">${country.continents}</p>
//   //   <p class="population">${country.population}</p>
//   //   <p class="currencies"></p>
//   //   <p class="languages"></p>
//   //   <p class="carSide"></p>
//   //   <p class="un"></p>
//   //   <div class="borders">
//   //       <p class="flagBorders"></p>
//   //       <p class="name"></p>
//   //   </div>
//   //   </div>
// }
