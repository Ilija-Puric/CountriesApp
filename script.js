const randomCountryDiv = document.getElementById("randomCountryContainer");
const btnRandomCountry = randomCountryDiv.children[1];
const h1 = document.getElementsByTagName("h1")[0];
console.log(btnRandomCountry);

const getCountries = async function () {
  let countries = await new Promise((resolve, reject) => {
    resolve(fetch("https://restcountries.com/v3.1/all"));
    reject("Error man");
  });
  let data = await countries.json();
  return data;
};

btnRandomCountry.addEventListener("click", () => {
  console.log("clicked");
  if (
    !randomCountryDiv.classList.contains("showCountry") ||
    !h1.classList.contains("moveToBottom")
  )
    animateCountryLoad();

  getRandomCountry();

  async function getRandomCountry() {
    let countries = await getCountries();
    let randomCountry = countries[getRandomNum()];
    console.log(randomCountry);

    // getCountries()
    //   .then((req) => {
    //     console.log(req[getRandomNum()]);
    //   })
    //   .catch((err) => alert(err));
  }
});

function animateCountryLoad() {
  randomCountryDiv.classList.add("showCountry");
  h1.classList.add("moveToBottom");
}

function getRandomNum() {
  return Math.floor(Math.random() * 250 + 0);
}
