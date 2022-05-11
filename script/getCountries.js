//Da ne moze da se pokrene dokle god nisu ucitani podaci iz fetcha
document.getElementById("buttonAllCountries").disabled = true;

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

        localStorage.setItem(`${index}`, JSON.stringify(countryObj));
      }

      document.getElementById("buttonAllCountries").disabled = false;
      return data;
    }
  } else {
    return new Error(`Error loading resourse,status code:${countries.status}`);
  }
};

if (localStorage.getItem(0) && localStorage.getItem(249)) {
  document.getElementById("buttonAllCountries").disabled = false;
} else getCountries();
