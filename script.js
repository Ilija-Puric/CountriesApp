const randomCountryDiv = document.getElementById("randomCountryContainer");
const btnRandomCountry = randomCountryDiv.children[1];
const pAdvertising = randomCountryDiv.children[0];
const h1 = document.getElementsByTagName("h1")[0];

const getCountries = async function () {
  let countries = await new Promise((resolve, reject) => {
    resolve(fetch("https://restcountries.com/v3.1/all"));
    reject("Error man");
  });
  let data = await countries.json();
  return data;
};

const getBorderingCountry = async function (country) {
  let countries = await new Promise((resolve, reject) => {
    //restcountries.com/v3.1/name/{name}
    https: resolve(fetch(`https://restcountries.com/v3.1/name/${country}`));
    reject("Error man");
  });
  let data = await countries.json();
  return data;
};

btnRandomCountry.addEventListener("click", () => {
  if (
    !randomCountryDiv.classList.contains("showCountry") ||
    !h1.classList.contains("moveToBottom")
  )
    animateCountryLoad();

  getRandomCountry();

  async function getRandomCountry() {
    //Sinhrona radnja.... mora pre async await
    if (pAdvertising.style.opacity !== "0") pAdvertising.style.opacity = "0";

    let countries = await getCountries();
    let randomCountry = countries[getRandomNum()];
    let countryName = randomCountry.name.common;
    let countryFlag = randomCountry.flags.svg;
    let capital = randomCountry.capital[0];
    let continent = randomCountry.continents[0];
    let memberOfUN = randomCountry.unMember ? "YES" : "NO";
    let borderingCountries = randomCountry?.borders;
    let languages = randomCountry.languages;
    let currency =
      randomCountry.currencies[Object.keys(randomCountry.currencies)[0]];

    if (borderingCountries) {
      console.log("ima bordering");
    } else {
      console.log("no bordering");
    }
    console.log(randomCountry);

    if (pAdvertising.nextElementSibling.tagName === "DIV") {
      pAdvertising.nextElementSibling.innerHTML = getHTML();
    } else {
      pAdvertising.style.display = "none";
      pAdvertising.insertAdjacentHTML("afterend", getHTML());
    }

    function getHTML() {
      return `<div id="randomCountry">
        <img src="${countryFlag}" alt="no flag found" class="flag">
        <div id="randomCountryDetails">
            <p class="countryName">Name: <span>${countryName}</span></p>
            <p class="countryContinent">Continent: <span>${continent}</span></p>
            <p class="capital">Capital: <span>${capital}</span></p>
            <p class="unMember">In UN?: <span>${memberOfUN}</span></p>
            <div class="currencies">
              <p>Currency: <span>${currency.name}(${currency.symbol})</span></p>
            </div>
            <div class="languages">
            </div>
            <div class="borderingCountries">
            </div>
        </div>
        </div>`;
    }
  }
});

function animateCountryLoad() {
  randomCountryDiv.classList.add("showCountry");
  h1.classList.add("moveToBottom");
}

function getRandomNum() {
  return Math.floor(Math.random() * 250 + 0);
}
