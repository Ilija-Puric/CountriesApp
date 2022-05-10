const main = document.getElementsByTagName("main")[0];
const mainContent = document.getElementById("mainContent");
const buttonAllCountries = document.getElementById("buttonAllCountries");
let logo = document.getElementById("logo");

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
        let countryPop = country.population;
        if (countryPop >= 1000 && countryPop <= 999999) {
          populationTotal =
            Number.parseFloat(countryPop / 1000).toFixed(2) + "K";
        } else if (countryPop >= 1000000 && countryPop < 1000000000) {
          populationTotal =
            Number.parseFloat(countryPop / 1000000).toFixed(2) + "M";
        } else if (countryPop >= 1000000000) {
          populationTotal =
            Number.parseFloat(countryPop / 1000000000).toFixed(2) + "B";
        }
        let divHtml = `
                <div class="country" data-name="${country.name}" data-population="${countryPop}">
                <img class="flagPrimary" src="${country.flag}" alt="no flag">
                <p class="name" >${country.name}</p>
                <p class="capital">Capital: <span>${country.capital}</span></p>
                <p class="continents">Continent: <span>${country.continent}</span></p>
                <p class="population" >Population: <span>${populationTotal}</span></p>
                <p class="languages">Languages:
                `;
        for (const lang of Object.entries(country.languages)) {
          divHtml += `<span> ${lang[1]} </span>`;
        }
        divHtml += `</p>
        <img class="more"src="images/more.svg" alt="no more pic">
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
      let filtersDiv = filter.nextElementSibling;

      console.log(filtersDiv);
      let nameDiv = filtersDiv.children[0];
      let continentDiv = filtersDiv.children[1];
      let languageDiv = filtersDiv.children[2];
      let populationFieldset = filtersDiv.children[3];
      let findBtn = filtersDiv.children[4].children[0];

      let name = nameDiv.children[1];
      let continentSelectTag = continentDiv.children[1];
      let languageSelectTag = languageDiv.children[1];
      let populationMinTag = populationFieldset.children[1].children[1];
      let populationMaxTag = populationFieldset.children[2].children[1];

      fillSelectTags();
      function fillSelectTags() {
        fillContinents();
        fillLanguages();
        function fillContinents() {
          const continentsSet = new Set();
          for (const country of allCountries) {
            continentsSet.add(country.continent);
          }
          //Sortiranje po imenu kontinenta
          const continents = Array.from(continentsSet).sort();
          continents.forEach((element) => {
            continentSelectTag.innerHTML += `
            <option value="${element.toLowerCase()}">${element}</option>
            `;
          });
        }
        function fillLanguages() {
          const languagesSet = new Set();
          for (const country of allCountries) {
            let languageObj = country.languages;
            //Iteriranje kroz objekte
            for (const lang of Object.entries(languageObj)) {
              languagesSet.add(lang[1]);
            }
          }
          const languages = Array.from(languagesSet).sort();
          languages.forEach((element) => {
            languageSelectTag.innerHTML += `
            <option value="${element.toLowerCase()}">${element}</option>
            `;
          });
        }
      }

      const countryDiv = document.getElementsByClassName("country");
      findBtn.addEventListener("click", () => {
        if (canProcede()) {
          toogleErrorClassOff();
          let arrayMatching = [];
          if (name.value !== "") {
            let nameCountry = name.value.toLowerCase();
            let result = checkIfMatchesCountry();
            if (!result) {
              return false;
            }
            function checkIfMatchesCountry() {
              arrayMatching = [...countryDiv].filter((e) => {
                let nameText = e
                  .querySelector(".name")
                  .textContent.toLowerCase();
                if (nameText.startsWith(nameCountry)) {
                  e.classList.remove("notMatchesName");
                  return e;
                } else {
                  e.classList.add("notMatchesName");
                }
              });
              if (!arrayMatching.length) {
                generateWarning();
                return false;
              } else return true;
            }
          }

          if (continentSelectTag.value !== "Choose".toLowerCase()) {
            let continent = continentSelectTag.value;
            arrayMatching = arrayMatching.length
              ? arrayMatching
              : [...countryDiv];
            let result = checkIfMatchesContinent();
            if (!result) {
              return false;
            }
            function checkIfMatchesContinent() {
              arrayMatching = [...arrayMatching].filter((e) => {
                let continentText = e
                  .querySelector(".continents span")
                  .textContent.toLowerCase();
                if (continentText.startsWith(continent)) {
                  e.classList.remove("notMatchesName");
                  return e;
                } else {
                  e.classList.add("notMatchesName");
                }
              });
              if (!arrayMatching.length) {
                generateWarning();
                return false;
              } else return true;
            }
          }
          if (languageSelectTag.value !== "Choose".toLowerCase()) {
            let language = languageSelectTag.value.toLowerCase();
            //imam vise jezika u jednoj drzavi...
            arrayMatching = arrayMatching.length
              ? arrayMatching
              : [...countryDiv];
            let result = checkIfMatchesLanguages();
            if (!result) {
              return false;
            }
            function checkIfMatchesLanguages() {
              arrayMatching = [...arrayMatching].filter((e) => {
                let languagesSpan = e.querySelectorAll(".languages span");
                for (let i = 0; i < languagesSpan.length; i++) {
                  const lang = languagesSpan[i];
                  const langTxt = lang.textContent.toLowerCase().trim();
                  if (langTxt.startsWith(language)) {
                    e.classList.remove("notMatchesName");
                    return e;
                  } else {
                    e.classList.add("notMatchesName");
                  }
                }
              });
              if (!arrayMatching.length) {
                generateWarning();
                return false;
              } else return true;
            }
          }

          let populationMin = Number.parseInt(populationMinTag.value);
          if (populationMin !== "" && populationMin >= 0) {
            arrayMatching = arrayMatching.length
              ? arrayMatching
              : [...countryDiv];
            let result = checkIfMatchesMin();
            if (!result) {
              return false;
            }
            function checkIfMatchesMin() {
              arrayMatching = [...arrayMatching].filter((e) => {
                let populationSpanValue =
                  e.querySelector(".population span").textContent;
                let num = Number.parseFloat(populationSpanValue).toFixed(2);
                if (populationSpanValue.includes("K")) {
                  num *= 1000;
                } else if (populationSpanValue.includes("M")) {
                  num *= 1000000;
                }
                if (populationMin <= num) {
                  arrayMatching.push(e);
                  e.classList.remove("notMatchesName");
                  return e;
                } else {
                  e.classList.add("notMatchesName");
                }
              });
              if (!arrayMatching.length) {
                generateWarning();
                return false;
              } else return true;
            }
          }
          let populationMax = Number.parseInt(populationMaxTag.value);
          if (populationMax !== "" && populationMax >= 0) {
            arrayMatching = arrayMatching.length
              ? arrayMatching
              : [...countryDiv];
            let result = checkIfMatchesMax();
            if (!result) {
              return false;
            }
            function checkIfMatchesMax() {
              arrayMatching = [...arrayMatching].filter((e) => {
                let populationSpanValue =
                  e.querySelector(".population span").textContent;
                let num = Number.parseFloat(populationSpanValue).toFixed(2);
                if (populationSpanValue.includes("K")) {
                  num *= 1000;
                } else if (populationSpanValue.includes("M")) {
                  num *= 1000000;
                }
                if (num <= populationMax) {
                  arrayMatching.push(e);
                  e.classList.remove("notMatchesName");
                  return e;
                } else {
                  e.classList.add("notMatchesName");
                }
              });
              if (!arrayMatching.length) {
                generateWarning();
                return false;
              } else return true;
            }
          }

          if (!arrayMatching.length) {
            generateWarning();
          } else {
            if (
              !logo.classList.contains("logoStat") &&
              !document.getElementById("statistics")
            ) {
              createStatsAndListeners();
            } else {
              addClassesLogo();
              logo.addEventListener("click", toggleStats);
            }

            function createStatsAndListeners() {
              createStats();
              addClassesLogo();
              logo.addEventListener("click", toggleStats);
            }
            function addClassesLogo() {
              logo.classList.remove("logoStatNone");
              logo.classList.add("logoStat");
              setTimeout(() => {
                logo.classList.add("wiggle");
              }, 500);
            }
            function createStats() {
              let htmlText = ` <div id="statistics" class="moveDefault">
              <div class="scaleMe"></div>
              <div id="statsInfo">
                <h2>Matching criteria</h2>
                <p class="stat">Total countries: <span id="totalCountries"></span></p>
                <p class="stat">Total population: <span id="totalP"></span></p>
                <ul>
                    <p class="stat">Total languages: <span id="totalLanguagesSpoken"></span></p>
                    <ul id="langsStat">
                    </ul>
                </ul>
                             <!-- <ul>
                    <p>Driving side</p>
                    <li>
                        <p class="stat">Left:<span id="totalDriveL"></span></p>
                    </li>
                    <li>
                        <p class="stat">Right:<span id="totalDriveR"></span></p>
                    </li>
                </ul>
                <ul>
                    <p>In UN:</p>
                    <li>
                        <p class="stat">YES:<span id="totalUnY"></span></p>
                    </li>
                    <li>
                        <p class="stat">NO:<span id="totalUnN"></span></p>
                    </li>
                </ul> -->
              </div>
              </div>`;
              allCountriesMainContainer.insertAdjacentHTML(
                "beforebegin",
                htmlText
              );
            }
            if (document.getElementById("warning")) {
              warning.classList.add("hidden");
            }

            let totalCountriesSpan = document.getElementById("totalCountries");
            let totalPopSpan = document.getElementById("totalP");
            let totalLangSpan = document.getElementById("totalLanguagesSpoken");

            setValues();
            showStats();
            function setValues() {
              totalCountriesSpan.textContent = arrayMatching.length;
              setPopulationTC();
              setLangTC();
              function setLangTC() {
                //da nemam ugnjezdjene nizove
                let langs = arrayMatching.flatMap((e) => {
                  let langs = Array.from(e.querySelectorAll(".languages span"));
                  let values = langs.map((e) => e.textContent);
                  return values;
                });
                langs = new Set(langs);
                totalLangSpan.textContent = langs.size;
              }
              function setPopulationTC() {
                let populations = arrayMatching.map((e) => {
                  let populationData = e.dataset.population;
                  if (populationData === "X") {
                    return 0;
                  } else {
                    return Number.parseInt(populationData);
                  }
                });
                let populationTotal = populations.reduce(
                  (prev, curr) => prev + curr
                );
                formatPopulation();
                function formatPopulation() {
                  if (populationTotal >= 1000 && populationTotal <= 999999) {
                    populationTotal =
                      Number.parseFloat(populationTotal / 1000).toFixed(2) +
                      "K";
                  }
                  if (
                    populationTotal >= 1000000 &&
                    populationTotal < 1000000000
                  ) {
                    populationTotal =
                      Number.parseFloat(populationTotal / 1000000).toFixed(2) +
                      "M";
                  }
                  if (populationTotal >= 1000000000) {
                    populationTotal =
                      Number.parseFloat(populationTotal / 1000000000).toFixed(
                        2
                      ) + "B";
                  }
                  totalPopSpan.textContent = populationTotal;
                }
              }
            }
          }
        } else {
          toogleErrorClassOn();
        }
        function toogleErrorClassOff() {
          name.classList.remove("emptyFields");
          continentSelectTag.classList.remove("emptyFields");
          languageSelectTag.classList.remove("emptyFields");
          populationMinTag.classList.remove("emptyFields");
          populationMaxTag.classList.remove("emptyFields");
        }
        function toogleErrorClassOn() {
          name.classList.add("emptyFields");
          continentSelectTag.classList.add("emptyFields");
          languageSelectTag.classList.add("emptyFields");
          populationMinTag.classList.add("emptyFields");
          populationMaxTag.classList.add("emptyFields");
        }
      });

      function styleAdd(element) {
        element.style.transition = "opacity 0.2s linear";
        if (element.style.display === "") {
          element.style.opacity = "0";
          element.style.display = "none";
        } else {
          element.style.display = "";
          setTimeout(() => {
            element.style.opacity = "1";
          }, 100);
        }
      }

      let filters = [
        nameDiv,
        continentDiv,
        languageDiv,
        populationFieldset,
        findBtn,
      ];
      //First load
      filters.forEach((element) => {
        element.style.display = "none";
      });
      filter.addEventListener("click", (e) => {
        filters.forEach((element) => {
          styleAdd(element);
        });
        if (document.getElementsByClassName("empty")[0]) {
          let emptyBtn = document.getElementsByClassName("empty")[0];
          if (nameDiv.style.display == "none") {
            emptyBtn.classList.add("hideMe");
          } else {
            emptyBtn.classList.remove("hideMe");
          }
        }
      });

      let sortBy = document.getElementById("sorting");
      let sortSelectTag = document.getElementById("sortBySelect");
      sortSelectTag.style.display = "none";
      sortBy.addEventListener("click", () => {
        styleAdd(sortSelectTag);
      });

      sortSelectTag.addEventListener("input", (e) => {
        let sortByValue = sortSelectTag.value;
        //sve drzave koje treba da se vide!
        let countries = document.querySelectorAll(
          ".country:not(.notMatchesName)"
        );
        let countryNames = Array.from(countries)
          .map((e) => e.dataset.name)
          .sort();

        let countriesOrdered = [];
        for (let i = 0; i < countryNames.length; i++) {
          let elementToFind = countryNames[i];
          countriesOrdered.push(
            document.querySelector(`[data-name="${elementToFind}"]`)
          );
        }
        containerCountries.innerHTML = "";
        container.innerHTML = generateHtml();
        function generateHtml() {
          let html = "";
          for (const str of countriesOrdered) {
            html += str.outerHTML;
          }
          return html;
        }

        if (sortByValue === "nameAsc") {
          console.log("By name ASC");
        } else if (sortByValue === "nameDesc") {
          console.log("By name Desc");
        } else if (sortByValue === "populationAsc") {
          console.log("By popuation ASC");
        } else if (sortByValue === "populationDesc") {
          console.log("By population Desc");
        }
      });

      const fieldsetForm = document.getElementById("fieldsetFilters");
      fieldsetForm.addEventListener("input", () => {
        if (canProcede()) {
          if (!document.getElementsByClassName("empty")[0]) {
            let empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "X";
            findBtn.parentElement.append(empty);

            empty.addEventListener("click", () => {
              emptyFieldsInForm();
              resetStatsDOM();
              if (document.getElementById("warning"))
                warning.classList.add("hidden");
              empty.remove();
            });
          }
        } else document.getElementsByClassName("empty")[0].remove();
      });

      createListenersForMore();
      function createListenersForMore() {
        let allmore = document.getElementsByClassName("more");
        [...allmore].forEach((element) => {
          element.addEventListener("click", (e) => {
            let clickedName = e.target.parentElement.children[1].textContent;
            allCountriesMainContainer.classList.add("moveOutRight");

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
                    <p class="carSide">Driving side: ${drivingSide}</p>
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
            <img class="back" src="images/back.svg" alt="no back pic">  
            `;

            main.insertAdjacentHTML("beforeend", html);

            const back = document.getElementsByClassName("back")[0];
            const modalCountry =
              document.getElementsByClassName("countryModal")[0];
            back.addEventListener("click", (e) => {
              modalCountry.remove();
              back.remove();
              allCountriesMainContainer.classList.remove("moveOutRight");
            });
          });
        });
      }

      function emptyFieldsInForm() {
        name.value = "";
        continentSelectTag.value = "choose";
        languageSelectTag.value = "choose";
        populationMinTag.value = "";
        populationMaxTag.value = "";
        for (const country of countryDiv) {
          country.classList.remove("notMatchesName");
        }
      }

      function canProcede() {
        if (
          name.value !== "" ||
          continentSelectTag.value !== "Choose".toLowerCase() ||
          languageSelectTag.value !== "Choose".toLowerCase() ||
          populationMinTag.value !== "" ||
          populationMaxTag.value !== ""
        ) {
          return true;
        } else return false;
      }
    }

    function toggleStats() {
      let statistics = document.getElementById("statistics");
      statistics.classList.toggle("moveOutOfSight");
      statistics.classList.toggle("moveToSight");
    }

    function showStats() {
      let statistics = document.getElementById("statistics");
      statistics.classList.remove("moveOutOfSight");
      statistics.classList.add("moveToSight");
    }
    function resetStatsDOM() {
      let statistics = document.getElementById("statistics");
      logo.classList.remove("logoStat");
      logo.classList.remove("wiggle");
      logo.classList.add("logoStatNone");
      logo.removeEventListener("click", toggleStats);
      statistics.classList.remove("moveToSight");
      statistics.classList.add("moveOutOfSight");
    }

    function generateWarning() {
      if (!document.getElementById("warning")) {
        let warning = document.createElement("p");
        warning.id = "warning";
        warning.textContent = "NOTHING FOUND";
        containerCountries.append(warning);
      } else {
        let warning = document.getElementById("warning");
        warning.classList.remove("hidden");
      }
      resetStatsDOM();
    }
    function createAllCountriesHTML() {
      return `
    <div id="allCountriesMainContainer">
    <form id="formFilters">
      <fieldset id="fieldsetFilters">
        <legend id="filters">Filters</legend>
        <div id="wrapperFilters">
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
            <input min="0" type="number" id="populationMin" name="populationMin">
            </div>
            <div>
            <label for="populationMax">Max:</label>
            <input min="0" type="number" id="populationMax" name="populationMax">
            </div>
          </fieldset>
          <div id="btnFindContainer"><button type="button" id="find">Find</button"></div>
        </div>
      </fieldset>
    </form> 
    <form id="formFilters">
    <fieldset id="fieldsetSort">
      <legend id="sorting">Sort by</legend>
      <div id="wrapperSort">
          <select name="sortBy" id="sortBySelect">
          <option value="choose">Choose</option>
          <option value="nameAsc">Name(Asc)</option>
          <option value="nameDesc">Name(Desc)</option>
          <option value="populationAsc">Population(Asc)</option>
          <option value="populationDesc">Population(Desc)</option>
          </select>
      </div>
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
