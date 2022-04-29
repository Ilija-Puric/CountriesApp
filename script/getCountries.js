//Da ne moze da se pokrene dokle god nisu ucitani podaci iz fetcha
document.getElementById("buttonAllCountries").disabled = true;
document.getElementById("buttonRandomCountry").disabled = true;
document.getElementById("buttonTrivia").disabled = true;

const getCountries = async function () {
  console.log("lodaing");
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
          borders,
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
          this.borders = borders;
          this.unMember = un;
          this.drivingSide = side;
        }
      }
      for (const [index, country] of data.entries()) {
        //Privremeno resenje za sporo ucitavanje...
        const countryObj = new Country(
          country.name.common,
          country?.capital ? country.capital[0] : "NONE",
          country.population,
          country.flags.svg,
          country.continents[0],
          country?.currencies ? country.currencies : "NO CURRENCY",
          country?.languages ? country.languages : "NO LANG",
          country?.borders ? country.borders : "NONE",
          country?.car.side,
          country.unMember ? "YES" : "NO"
        );

        localStorage.setItem(`${index}`, JSON.stringify(countryObj));
      }

      console.log("done");
      document.getElementById("buttonAllCountries").disabled = false;
      document.getElementById("buttonRandomCountry").disabled = false;
      document.getElementById("buttonTrivia").disabled = false;

      return data;
    }
  } else {
    return new Error(`Error loading resourse,status code:${countries.status}`);
  }
};

const allCountries = [];
if (localStorage.getItem(0) && localStorage.getItem(249)) {
  console.log("Local storage filled");
  //Punjenje allCountries
  let i = 0;
  while (i < 250) {
    allCountries.push(JSON.parse(localStorage.getItem(i)));
    i++;
  }
  document.getElementById("buttonAllCountries").disabled = false;
  document.getElementById("buttonRandomCountry").disabled = false;
  document.getElementById("buttonTrivia").disabled = false;
} else getCountries();
