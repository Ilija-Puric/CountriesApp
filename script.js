const randomCountryDiv = document.getElementById("randomCountryContainer");
const btnRandomCountry = randomCountryDiv.children[1];
const pAdvertising = randomCountryDiv.children[0];
const h1 = document.getElementsByTagName("h1")[0];

const spinner = document.getElementById("spinner");

const style = document.createElement("style");
const styleClicked = document.createElement("style");
(() => {
  styleClicked.id = "onlyClicked";
  document.head.append(styleClicked);
})();

const getCountries = async function () {
  let countries = await fetch("https://restcountries.com/v3.1/all");
  if (countries.status === 200) {
    let data = await countries.json();
    if (typeof Storage !== "undefined") {
      for (const [index, country] of data.entries()) {
        console.log(index, country.name.common);
        sessionStorage.setItem(`${index}`, country.name.common);
      }
      return data;
    }
  } else {
    return new Error(`Error loading resourse,status code:${countries.status}`);
  }
};

if (sessionStorage.getItem(0) && sessionStorage.getItem(249)) {
  console.log("Popunjena lokalna memorija");
} else getCountries();

const getBorderingCountry = async function (country) {
  let countryInfo = await fetch(
    `https://restcountries.com/v3.1/alpha/${country}`
  );
  if (countryInfo.status === 200) {
    let data = await countryInfo.json();
    return data;
  } else {
    return new Error(
      `Error loading resourse,status code:${countryInfo.status}`
    );
  }
};

const getSingleCountry = async function (name) {
  let countryInfo = await fetch(`https://restcountries.com/v3.1/name/${name}`);
  if (countryInfo.status === 200) {
    let data = await countryInfo.json();
    return data;
  } else {
    return new Error(
      `Error loading resourse,status code:${countryInfo.status}`
    );
  }
};

btnRandomCountry.addEventListener("click", () => {
  // FUNKCIJA KOJA JEDNOMMMMM SAMO PRAVI HTTP ZAHTEV SERVERU,OSTATAK IZ MEMORIJE
  //Sinhrona radnja....
  animateLoadTime();
  getRandomCountry();

  async function getRandomCountry() {
    let randomCnt = await getSingleCountry(
      sessionStorage.getItem(getRandomNum())
    );

    let randomCountry = randomCnt[0];

    let countryName = randomCountry.name.common;
    let countryFlag = randomCountry.flags.svg;
    let capital = randomCountry?.capital || "None";
    let continent = randomCountry.continents[0];
    let memberOfUN = randomCountry.unMember ? "YES" : "NO";
    let borderingCountries = randomCountry?.borders;
    let languages = randomCountry.languages;
    let currency = randomCountry.currencies
      ? Object.values(randomCountry.currencies)[0]
      : "NONE";
    if (borderingCountries) {
      // Imam niz promisa koji zelim istovremeno da runnam
      let promises = [];
      borderingCountries.forEach((element) => {
        let promise = getBorderingCountry(element);
        promises.push(promise);
      });

      let allBorderingCountries = await Promise.all(promises)
        .then((req) => req)
        .catch((err) => console.log(err));

      //da mogu kasnije da pristupim...
      var borderingCountriesValues = [];
      allBorderingCountries.forEach((element) => {
        borderingCountriesValues.push([
          element[0].name.common,
          element[0].flags.svg,
        ]);
      });
    }

    getHTML(borderingCountries);

    function getHTML(hasBordering) {
      let htmlBordering = "";
      if (hasBordering) {
        //Moram razmisliti da li i ime gradova da dodam u DOM
        for (const [x, y] of borderingCountriesValues) {
          htmlBordering += `
          <div>
            <img src='${y}' alt="no picture of bordering country"/>
            <!--<p>${x}</p>-->
          </div>
          `;
        }
        document.head.append(style);
        style.innerHTML = `
        .borderingCountries{
            display: grid !important;
            width: 100%;
            grid-template-columns: repeat(auto-fit,minmax(${
              100 / borderingCountriesValues.length
            }%,1fr));
            width: 100%;
            margin: 0 auto;
            min-width: 250px;
          }
        .borderingCountries>div img{
              position: static !important;
                    object-fit: cover;
                   // height:16.2vh !important;
                   //height: 100% !important;
                   height: 16vh !important
        }
        `;
      }

      if (pAdvertising.nextElementSibling.tagName !== "DIV") {
        pAdvertising.style.display = "none";
        pAdvertising.insertAdjacentHTML(
          "afterend",
          `<div id="randomCountry">
        <img src="${countryFlag}" alt="no flag found" class="flag">
        <div class="middle">
          <p class="countryName">Name: <span>${countryName}</span></p>
          <p class="countryContinent">Continent: <span>${continent}</span></p>
          <p class="capital">Capital: <span>${capital}</span></p>
          <p class="unMember">In UN?: <span>${memberOfUN}</span></p>
          <div class="currencies">
            <p>Currency: <span>${currency.name}(${currency.symbol})</span></p>
          </div>
        </div>
        <div class="languages">
        </div>
        <div class="borderingCountries" style="display:none">
            ${htmlBordering}
        </div>
        </div>`
        );
      } else {
        pAdvertising.nextElementSibling.innerHTML = `
        <img src="${countryFlag}" alt="no flag found" class="flag">
        <div class="middle">
        <p class="countryName">Name: <span>${countryName}</span></p>
        <p class="countryContinent">Continent: <span>${continent}</span></p>
        <p class="capital">Capital: <span>${capital}</span></p>
        <p class="unMember">In UN?: <span>${memberOfUN}</span></p>
        <div class="currencies">
          <p>Currency: <span>${currency.name}(${currency.symbol})</span></p>
        </div>
        </div>
        <div class="borderingCountries" style="display:none">
            ${htmlBordering}
        </div>`;
      }
    }
    animateCountries();
  }
});

function changeLayout() {
  if (
    !randomCountryDiv.classList.contains("showCountry") ||
    !h1.classList.contains("moveToBottom")
  )
    styleClicked.innerHTML = `

#randomCountryContainer{
  position: absolute;
  background-color:transparent !important;
  transition:background-color 0.6s ease-in;
}
#randomCountryContainer button{
   position: absolute;
   bottom: -20px !important;
}
main{
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
`;
}

function animateLoadTime() {
  changeLayout();
  if (pAdvertising.style.opacity !== "0") pAdvertising.style.opacity = "0";
  randomCountryDiv.classList.remove("showCountry");
  randomCountryDiv.classList.add("generateCountry");
  spinner.classList.remove("opacity0");
}
function animateCountries() {
  h1.classList.add("moveToBottom");
  randomCountryDiv.classList.add("showCountry");
  spinner.classList.add("opacity0");
}
function getRandomNum() {
  return Math.floor(Math.random() * 249 + 0);
}
