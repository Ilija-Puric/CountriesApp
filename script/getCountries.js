//Da ne moze da se pokrene dokle god nisu ucitani podaci iz fetcha
document.getElementById("buttonAllCountries").disabled = true;
const main = document.getElementsByTagName("main")[0];
const mainContent = document.getElementById("mainContent");
const buttonAllCountries = document.getElementById("buttonAllCountries");
const logo = document.getElementById("logo");

let query = location.search;
let parameters = new Map();

function searchCountries(query) {
  if (query) {
    let pairs = new URLSearchParams(query);
    if (pairs.has("name") && pairs.get("name")) {
      parameters.set("name", pairs.get("name"));
    }
    if (pairs.has("continent") && pairs.get("continent")) {
      parameters.set("continent", pairs.get("continent"));
    }
    if (pairs.has("language") && pairs.get("language")) {
      parameters.set("language", pairs.get("language"));
    }
    if (pairs.has("min") && pairs.get("min")) {
      parameters.set("min", pairs.get("min"));
    }
    if (pairs.has("max") && pairs.get("max")) {
      parameters.set("max", pairs.get("max"));
    }
  }
  return parameters;
}

let allCountries = [];
const getCountries = async function () {
  let countries = await fetch("https://restcountries.com/v3.1/all");
  if (countries.status === 200) {
    let data = await countries.json();
    if (typeof Storage !== "undefined") {
      class Country {
        constructor(
          name,
          capital,
          population,
          flag,
          continent,
          currencies,
          languages,
          side,
          un
        ) {
          this.name = name;
          this.capital = capital;
          this.population = population;
          this.flag = flag;
          this.continent = continent;
          this.currencies = currencies;
          this.languages = languages;
          this.unMember = un;
          this.drivingSide = side;
        }
      }
      for (const [index, country] of data.entries()) {
        const countryObj = new Country(
          country.name.common,
          country?.capital ? country.capital[0] : "X",
          country?.population ? country.population : 0,
          country.flags.svg,
          country.continents[0],
          country?.currencies ? country.currencies : "X",
          country?.languages ? country.languages : "X",
          country?.car.side,
          country.unMember ? "YES" : "NO"
        );
        allCountries.push(countryObj);
        localStorage.setItem(`${index}`, JSON.stringify(countryObj));
      }
      if (document.getElementById("buttonAllCountries"))
        document.getElementById("buttonAllCountries").disabled = false;
      return;
    }
  } else {
    return new Error(`Error loading resourse,status code:${countries.status}`);
  }
};

if (localStorage.getItem(0) && localStorage.getItem(249)) {
  let i = 0;
  while (i < 250) {
    allCountries.push(JSON.parse(localStorage.getItem(i)));
    i++;
  }
  if (query === "")
    document.getElementById("buttonAllCountries").disabled = false;
} else getCountries();

if (searchCountries(query).size) {
  document.getElementById("mainContent").remove();
  window.addEventListener("load", function () {
    generateAllCountries("search");
  });
}
