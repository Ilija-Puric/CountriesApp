const main = document.getElementsByTagName("main")[0];
const mainContent = document.getElementById("mainContent");
const buttonAllCountries = document.getElementById("buttonAllCountries");
const buttonRandomCountry = document.getElementById("buttonRandomCountry");
const buttonTrivia = document.getElementById("buttonTrivia");

let allCountries = [];
function generateAllCountries() {
  if (allCountries.length <= 250) {
    allCountries = [];
    let i = 0;
    while (i < 250) {
      allCountries.push(JSON.parse(localStorage.getItem(i)));
      i++;
    }
  }

  loadTime();
  let html = `
    <div id="allCountriesContainer">
    </div>
  `;
  mainContent.insertAdjacentHTML("beforeend", html);
  const containerCountries = document.getElementById("allCountriesContainer");
  const styleForAllCountries = document.createElement("link");
  styleForAllCountries.rel = "stylesheet";
  styleForAllCountries.href = "../style/allCountries.css";
  document.head.append(styleForAllCountries);
  containerCountries.style.display = "none";
  mainContent.classList.add("tabsAnimationDown");
  mainContent.id = "";
  //P tag-o projektu
  mainContent.children[0].remove();
  //Div tag-tehnologije
  mainContent.children[0].remove();
  //P tag- select kategoriju
  mainContent.children[0].remove();

  setTimeout(createGrid, 500);

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
      //   let images = document.querySelectorAll(".country img");
      //   let picturesLoaded = 0;
      //   for (const img of images) {
      //     img.addEventListener("load", () => {
      //       picturesLoaded++;
      //       console.log(picturesLoaded);
      //       if (images.length === picturesLoaded) {
      //         containerCountries.style.display = "";
      //         mainContent.id = "slideAllCountries";
      //         mainContent.classList.add("tabsAnimationUp");
      //         main.removeChild(document.getElementsByClassName("spinner")[0]);
      //       }
      //     });
    }

    setTimeout(() => {
      containerCountries.style.display = "";
      mainContent.id = "slideAllCountries";
      mainContent.classList.add("tabsAnimationUp");
      main.removeChild(document.getElementsByClassName("spinner")[0]);
    }, 1000);
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
