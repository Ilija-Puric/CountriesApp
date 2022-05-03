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
                <p class="capital">Capital: <span>${country.capital}</span></p>
                <p class="continents">Continent: <span>${country.continent}</span></p>
                <p class="population">Population: <span>${populationTotal}</span></p>
                <p class="languages">Languages:
                `;
        for (const lang of Object.entries(country.languages)) {
          divHtml += `<span> ${lang[1]} </span>`;
        }
        divHtml += `</p>
        <img class="more"src="../images/more.svg" alt="no more pic">
        </div>      
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
      let findBtn = unFieldset.nextElementSibling;

      let name = nameDiv.children[1];
      let continentSelectTag = continentDiv.children[1];
      let languageSelectTag = languageDiv.children[1];
      let populationMinTag = populationFieldset.children[1].children[1];
      let populationMaxTag = populationFieldset.children[2].children[1];
      let unY = unFieldset.children[1].children[1];
      let unN = unFieldset.children[2].children[1];

      console.log(unN);
      fillSelectTags();
      function fillSelectTags() {
        fillContinents();
        fillLanguages();
        function fillContinents() {
          const continents = new Set();
          for (const country of allCountries) {
            continents.add(country.continent);
          }
          continents.forEach((element) => {
            continentSelectTag.innerHTML += `
            <option value="${element.toLowerCase()}">${element}</option>
            `;
          });
        }
        function fillLanguages() {
          const languages = new Set();
          for (const country of allCountries) {
            let languageObj = country.languages;
            //Iteriranje kroz objekte
            for (const lang of Object.entries(languageObj)) {
              //Zbog vrednosti NO LANG koje se rastavi na N O L A N G
              if (lang[1].length > 1) {
                languages.add(lang[1]);
              }
            }
          }
          languages.forEach((element) => {
            languageSelectTag.innerHTML += `
            <option value="${element.toLowerCase()}">${element}</option>
            `;
          });
        }
      }

      const countryNames = document.getElementsByClassName("name");
      findBtn.addEventListener("click", () => {
        if (!isEmpty()) {
          console.log("Can procede");
          toogleErrorClassOff();
          let arrayMatching = [];
          let nameCountry;
          if (name.value !== "") {
            nameCountry = name.value;
            checkIfMatchesCountry();
            function checkIfMatchesCountry() {
              //Pretvaram u array pa rasclanim
              arrayMatching.push(...getMatchingNames());
              //Custom fja umesto fillter na niz...
              function getMatchingNames() {
                let arr = [];
                //Refaktorisi
                for (const country of countryNames) {
                  let elName = country.textContent;
                  if (
                    elName.toLowerCase().startsWith(nameCountry.toLowerCase())
                  ) {
                    country.parentElement.classList.remove("notMatchesName");
                    arr.push(country.parentElement);
                  } else {
                    country.parentElement.classList.add("notMatchesName");
                  }
                }
                return arr;
              }
            }
          }
          if (continentSelectTag.value !== "Choose".toLowerCase()) {
            let continent = continentSelectTag.value;
            getMachingCountries();
            function getMachingCountries() {
              console.log(arrayMatching);
              let arrayMatchingCopy = [];
              for (const country of arrayMatching) {
                console.log(country);
                let continentSpan = country.querySelector(".continents span");
                if (
                  continentSpan.textContent
                    .toLowerCase()
                    .startsWith(continent.toLowerCase())
                ) {
                  country.classList.remove("notMatchesName");
                  arrayMatchingCopy.push(country);
                } else {
                  country.classList.add("notMatchesName");
                }
              }
              arrayMatching = [];
              arrayMatching.push(...arrayMatchingCopy);
              console.log(arrayMatching);
            }
          }
          if (languageSelectTag.value !== "Choose".toLowerCase()) {
            let language = languageSelectTag.value.toLowerCase();
            //imam vise jezika u jednoj drzavi...
            getMatchingLanguages();
            function getMatchingLanguages() {
              console.log(arrayMatching);
              let arrayMatchingCopy = [];
              for (const country of arrayMatching) {
                let languagesSpan = country.querySelectorAll(".languages span");

                for (let i = 0; i < languagesSpan.length; i++) {
                  const lang = languagesSpan[i];
                  const langTxt = lang.textContent.toLowerCase().trim();
                  if (langTxt.startsWith(language)) {
                    console.log(lang.parentElement, lang);
                    console.log("im innnnnn");
                    arrayMatchingCopy.push(country);
                    country.classList.remove("notMatchesName");
                    break;
                  } else {
                    country.classList.add("notMatchesName");
                  }
                }
              }
              arrayMatching = [];
              arrayMatching.push(...arrayMatchingCopy);
            }
          }
        } else {
          toogleErrorClassOn();
        }
        function isEmpty() {
          if (
            name.value !== "" ||
            continentSelectTag.value !== "Choose".toLowerCase() ||
            languageSelectTag.value !== "Choose".toLowerCase() ||
            populationMinTag.value !== "" ||
            populationMaxTag.value !== "" ||
            unY.checked ||
            unN.checked
          ) {
            return false;
          }
          return true;
        }
        function toogleErrorClassOff() {
          name.classList.remove("emptyFields");
          continentSelectTag.classList.remove("emptyFields");
          languageSelectTag.classList.remove("emptyFields");
          populationMinTag.classList.remove("emptyFields");
          populationMaxTag.classList.remove("emptyFields");
          unY.classList.remove("emptyFields");
          unN.classList.remove("emptyFields");
        }
        function toogleErrorClassOn() {
          name.classList.add("emptyFields");
          continentSelectTag.classList.add("emptyFields");
          languageSelectTag.classList.add("emptyFields");
          populationMinTag.classList.add("emptyFields");
          populationMaxTag.classList.add("emptyFields");
          unY.classList.add("emptyFields");
          unN.classList.add("emptyFields");
        }
      });

      let filters = [
        nameDiv,
        continentDiv,
        languageDiv,
        populationFieldset,
        unFieldset,
        findBtn,
      ];
      //First load
      filters.forEach((element) => {
        element.style.display = "none";
      });
      filter.addEventListener("click", (e) => {
        filters.forEach((element) => {
          element.style.transition = "opacity 0.3s linear";
          if (element.style.display === "") {
            element.style.opacity = "0";
            element.style.display = "none";
          } else {
            element.style.display = "";
            setTimeout(() => {
              element.style.opacity = "1";
            }, 100);
          }
        });
      });

      createListenersForMore();
      function createListenersForMore() {
        let allmore = document.getElementsByClassName("more");
        console.log(allmore);
        [...allmore].forEach((element) => {
          element.addEventListener("click", (e) => {
            let clickedName = e.target.parentElement.children[1].textContent;
            allCountriesMainContainer.classList.add("moveOutRight");

            console.log(clickedName);
            let country = allCountries.filter((element) => {
              if (element.name === clickedName) {
                return element;
              }
            });

            country = country[0];
            let populationTotal;
            if (country.population >= 1000 && country.population <= 999999) {
              populationTotal =
                Number.parseFloat(country.population / 1000).toFixed(2) + "K";
            }
            if (country.population >= 1000000) {
              populationTotal =
                Number.parseFloat(country.population / 1000000).toFixed(2) +
                "M";
            }
            let drivingSide = country.drivingSide.toUpperCase();
            let html = `
                    <div class="countryModal">
                    <img class="flagPrimary" src="${country.flag}" alt="no flag">
                    <p class="name">${country.name}</p>
                    <p class="capital">Capital: <span>${country.capital}</span></p>
                    <p class="continents">Continent: <span>${country.continent}</span></p>
                    <p class="population">Population: <span>${populationTotal}</span></p>
                    <p class="carSide">Driving side:${drivingSide}</p>
                    <p class="un">UN member: ${country.unMember}</p>
                    <p class="languages">Languages:
                    `;
            for (const lang of Object.entries(country.languages)) {
              html += `<span> ${lang[1]} </span>`;
            }
            html += `</p>
            <p class="currencies">Currencies:
            `;

            for (const currency of Object.entries(country.currencies)) {
              if (currency[1] !== "X") {
                html += `<span>${currency[1].name}(${currency[1].symbol}) </span>`;
              } else {
                html += `<span>X</span>`;
              }
            }
            html += `
            </p>
            </div>    
            <img class="back" src="../images/back.svg" alt="no back pic">  
            `;

            main.insertAdjacentHTML("beforeend", html);

            const back = document.getElementsByClassName("back")[0];
            const modalCountry =
              document.getElementsByClassName("countryModal")[0];
            back.addEventListener("click", (e) => {
              console.log(back);
              modalCountry.remove();
              back.remove();
              allCountriesMainContainer.classList.remove("moveOutRight");
            });
          });
        });
      }
    }
    function createWarning() {
      let warning = document.createElement("p");
      warning.id = "warning";
      warning.textContent = "NOTHING FOUND";
      containerCountries.append(warning);
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
          <option value="choose">Choose</option>
          </select> 
        </div>
        <div>
          <label for="language">Language:</label>
          <select name="language" id="language">
          <option value="choose">Choose</option>
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
        <button type="button" id="find">Find</button">
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
