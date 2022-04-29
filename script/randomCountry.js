const randomCountryDivContainer = document.getElementById(
  "randomCountryContainer"
);
const btnRandomCountry = randomCountryDivContainer.children[2];
const pAdvertising = randomCountryDivContainer.children[0];
const h1 = document.getElementsByTagName("h1")[0];
const randomCountryDiv = document.getElementById("randomCountry");

const logoSpinner = document.getElementById("logoSpinner");

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
        //Izmena sa json
        localStorage.setItem(`${index}`, JSON.stringify(country));
      }
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
} else getCountries();

btnRandomCountry.addEventListener("click", () => {
  animateLoadTime();
  getRandomCountry();
  waitForImagesToLoad();

  function waitForImagesToLoad() {
    console.log("images");
    const images = document.querySelectorAll("#randomCountryContainer img");
    console.log(images);
    let loaded = [];
    [...images].forEach((image) => {
      image.addEventListener("load", () => {
        loaded.push(image);
        console.log("image");
        if (loaded.length === images.length) {
          console.log("done loading");
          animateCountries();
        }
      });
    });
  }

  function getRandomCountry() {
    let randomCountry = JSON.parse(localStorage.getItem(getRandomNum()));

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

    let allBorderingCountries;
    if (borderingCountries) {
      allBorderingCountries = allCountries.filter((country) => {
        for (let i = 0; i < borderingCountries.length; i++) {
          let border = borderingCountries[i];
          if (country.cca3 === border) return country;
        }
      });
    }

    getHTML(allBorderingCountries);

    function getHTML(allBorderingCountries) {
      let htmlBordering = "";
      if (allBorderingCountries) {
        for (const country of allBorderingCountries) {
          htmlBordering += `
          <div>
            <img src='${country.flags.svg}' alt="no picture of bordering country"/>
            <!--<p>${country.name.common}</p>-->
          </div>
          `;
        }
        document.head.append(style);
        style.innerHTML = `
        .borderingCountries{
            display: grid !important;
            width: 100%;
            grid-template-columns: repeat(auto-fit,minmax(${
              100 / allBorderingCountries.length
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

      randomCountryDiv.classList.remove("hidden");
      randomCountryDiv.innerHTML = `
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
    console.log("done random");
  }
});

function changeLayout() {
  if (
    !randomCountryDivContainer.classList.contains("showCountry") ||
    !h1.classList.contains("moveToBottom")
  )
    styleClicked.innerHTML = `
      #randomCountryContainer{
        position: absolute;
        background-color:transparent !important;
        transition:background-color 0.6s ease-in;
      }
      #randomCountryContainer button{
        position: relative;
        bottom: 35px !important;
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
  randomCountryDivContainer.classList.remove("showCountry");
  randomCountryDivContainer.classList.add("generateCountry");
  logoSpinner.classList.remove("opacity0");
  console.log("load");
}
function animateCountries() {
  h1.classList.add("moveToBottom");
  randomCountryDivContainer.classList.add("showCountry");
  logoSpinner.classList.add("opacity0");
  console.log("load done");
}
function getRandomNum() {
  return Math.floor(Math.random() * 249 + 0);
}
