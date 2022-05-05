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
      let findBtn = populationFieldset.nextElementSibling.children[0];

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
              //Zbog vrednosti NO LANG koje se rastavi na N O L A N G
              if (lang[1].length > 1) {
                languagesSet.add(lang[1]);
              }
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
        if (!isEmpty()) {
          toogleErrorClassOff();
          let arrayMatching = [];
          if (name.value !== "") {
            let nameCountry;
            nameCountry = name.value;
            checkIfMatchesCountry();
            function checkIfMatchesCountry() {
              //Pretvaram u array pa rasclanim
              getMatchingNames();
              //Custom fja umesto fillter na niz...
              function getMatchingNames() {
                //Refaktorisi
                for (const country of countryDiv) {
                  let elName = country.querySelector(".name").textContent;
                  console.log(elName);
                  if (
                    elName.toLowerCase().startsWith(nameCountry.toLowerCase())
                  ) {
                    country.classList.remove("notMatchesName");
                    arrayMatching.push(country);
                  } else {
                    country.classList.add("notMatchesName");
                  }
                }
              }
            }
          }
          if (continentSelectTag.value !== "Choose".toLowerCase()) {
            let continent = continentSelectTag.value;
            getMachingCountries();
            function getMachingCountries() {
              let arrayMatchingCopy = [];
              arrayMatching = arrayMatching.length ? arrayMatching : countryDiv;

              for (const country of arrayMatching) {
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
            }
          }
          if (languageSelectTag.value !== "Choose".toLowerCase()) {
            let language = languageSelectTag.value.toLowerCase();
            //imam vise jezika u jednoj drzavi...
            getMatchingLanguages();
            function getMatchingLanguages() {
              let arrayMatchingCopy = [];
              arrayMatching = arrayMatching.length ? arrayMatching : countryDiv;
              for (const country of arrayMatching) {
                let languagesSpan = country.querySelectorAll(".languages span");

                for (let i = 0; i < languagesSpan.length; i++) {
                  const lang = languagesSpan[i];
                  const langTxt = lang.textContent.toLowerCase().trim();
                  if (langTxt.startsWith(language)) {
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

          let populationMin = Number.parseInt(populationMinTag.value);
          if (populationMin !== "" && populationMin >= 0) {
            console.log("BEFORE", arrayMatching);
            getMatchingMin();
            function getMatchingMin() {
              let arrayMatchingCopy = [];
              arrayMatching = arrayMatching.length ? arrayMatching : countryDiv;
              for (const country of arrayMatching) {
                console.log(country);
                let populationSpan = country.querySelector(".population span");
                let populationSpanValue = populationSpan.textContent;

                if (populationSpanValue.includes("K")) {
                  populationSpanValue = Number.parseInt(
                    Number.parseFloat(populationSpanValue).toFixed(2) * 1000
                  );
                } else if (populationSpanValue.includes("M")) {
                  populationSpanValue = Number.parseInt(
                    Number.parseFloat(populationSpanValue).toFixed(2) * 1000000
                  );
                }

                if (populationMin <= populationSpanValue) {
                  arrayMatchingCopy.push(country);
                  country.classList.remove("notMatchesName");
                } else {
                  country.classList.add("notMatchesName");
                }
              }
              arrayMatching = [];
              arrayMatching.push(...arrayMatchingCopy);
              console.log("AFTER", arrayMatching);
            }
          }
          let populationMax = Number.parseInt(populationMaxTag.value);
          if (populationMax !== "" && populationMax >= 0) {
            getMatchingMax();
            function getMatchingMax() {
              let arrayMatchingCopy = [];
              arrayMatching = arrayMatching.length ? arrayMatching : countryDiv;
              for (const country of arrayMatching) {
                let populationSpan = country.querySelector(".population span");
                let populationSpanValue = populationSpan.textContent;

                if (populationSpanValue.includes("K")) {
                  populationSpanValue = Number.parseInt(
                    Number.parseFloat(populationSpanValue).toFixed(2) * 1000
                  );
                } else if (populationSpanValue.includes("M")) {
                  populationSpanValue = Number.parseInt(
                    Number.parseFloat(populationSpanValue).toFixed(2) * 1000000
                  );
                }
                if (populationSpanValue <= populationMax) {
                  arrayMatchingCopy.push(country);
                  country.classList.remove("notMatchesName");
                } else {
                  country.classList.add("notMatchesName");
                }
              }
              arrayMatching = [];
              arrayMatching.push(...arrayMatchingCopy);
            }
          }
          if (!arrayMatching.length) {
            generateWarning();
          } else {
            if (document.getElementById("warning"))
              warning.classList.add("hidden");
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
        if (document.getElementsByClassName("empty")[0]) {
          document.getElementsByClassName("empty")[0].remove();
        }
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

      const fieldsetForm = document.getElementById("fieldsetFilters");
      fieldsetForm.addEventListener("input", () => {
        if (!isEmpty()) {
          if (!document.getElementsByClassName("empty")[0]) {
            let empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "X";
            findBtn.insertAdjacentElement("afterend", empty);

            empty.addEventListener("click", () => {
              emptyFieldsInForm();
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
            <img class="back" src="../images/back.svg" alt="no back pic">  
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

      function isEmpty() {
        if (
          name.value !== "" ||
          continentSelectTag.value !== "Choose".toLowerCase() ||
          languageSelectTag.value !== "Choose".toLowerCase() ||
          populationMinTag.value !== "" ||
          populationMaxTag.value !== ""
        ) {
          return false;
        }
        return true;
      }
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
        <div id="btnFindContainer"><button type="button" id="find">Find</button"></div>
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
