const main = document.getElementsByTagName("main")[0];
const mainContent = document.getElementById("mainContent");
const buttonAllCountries = document.getElementById("buttonAllCountries");
const buttonRandomCountry = document.getElementById("buttonRandomCountry");
const buttonTrivia = document.getElementById("buttonTrivia");

let allCountries = [];
function generateAllCountries() {
  if (!document.getElementById("allCountriesMainContainer")) {
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

    const container = document.getElementById("allCountriesMainContainer");
    const containerCountries = document.getElementById("allCountriesContainer");
    container.style.display = "none";

    setTimeout(createGrid, 100);

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
      let images = document.getElementsByClassName("flagPrimary");
      let imageLoaded = [];

      for (const img of images) {
        img.addEventListener("load", () => {
          imageLoaded.push(1);
          if (imageLoaded.length === images.length) {
            container.style.display = "";
            container.classList.add("animationCountriesContainer");
            main.removeChild(document.getElementsByClassName("spinner")[0]);
          }
        });
      }
      let filter = document.getElementById("filters");

      let nameDiv = filter.nextElementSibling;
      let continentDiv = nameDiv.nextElementSibling;
      let languageDiv = continentDiv.nextElementSibling;
      let populationFieldset = languageDiv.nextElementSibling;
      let unFieldset = populationFieldset.nextElementSibling;

      filter.addEventListener("click", () => {
        let filters = [
          nameDiv,
          continentDiv,
          languageDiv,
          populationFieldset,
          unFieldset,
        ];

        filters.forEach((e) => {
          if (e.style.display === "") {
            e.style.display = "none";
          } else e.style.display = "";
        });
      });
    }

    function createAllCountriesHTML() {
      return `

    <div id="allCountriesMainContainer">
    <form id="formFilters">
      <fieldset id="fieldsetFilters">
        <legend id="filters">Filters</legend>
        <div>
          <label for="name">Name:</label>
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
        <fieldset>
        <legend class="sublegend">Population:</legend>
          <div>
          <label for="populationMin">Min:</label>
          <input type="number" id="populationMin" name="populationMin">
          </div>
          <div>
          <label for="populationMax">Max:</label>
          <input type="number" id="populationMax" name="populationMax">
          </div>
        </fieldset>
        <fieldset>
        <legend class="sublegend">Is in UN:</legend>
          <div>
            <label for="unMemberY">Yes:</label>
            <input type="radio" id="unMemberY" name="unMember">
          </div>
          <div>
            <label for="unMemberN">No:</label>
            <input type="radio" id="unMemberN" name="unMember">
          </div>
        </fieldset>
      </fieldset>
    </form> 

    <div id="allCountriesContainer">
    </div>
    </div>

  `;
    }
  } else {
    return;
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
