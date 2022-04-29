const main = document.getElementsByTagName("main")[0];
const intro = document.getElementById("intro");
const buttonAllCountries = document.getElementById("buttonAllCountries");
const buttonRandomCountry = document.getElementById("buttonRandomCountry");
const buttonTrivia = document.getElementById("buttonTrivia");

console.log(buttonAllCountries);
console.log(buttonRandomCountry);
console.log(buttonTrivia);

function generateAllCountries() {
  console.log(intro);
  intro.classList.add("tabsAnimationDown");
  setTimeout(() => {
    intro.id = "";
    //P tag-o projektu
    intro.children[0].remove();
    //Div tag-tehnologije
    intro.children[0].remove();
    //P tag- select kategoriju
    intro.children[0].remove();
    let html = `
      <div id="allCountriesContainer">
      </div>
    `;
    intro.insertAdjacentHTML("beforeend", html);

    const styleForAllCountries = document.createElement("link");
    styleForAllCountries.rel = "stylesheet";
    styleForAllCountries.href = "../style/allCountries.css";
    document.head.append(styleForAllCountries);
    intro.classList.add("tabsAnimationUp");
  }, 810);

  setTimeout(() => {
    intro.classList = "";
  }, 1800);
}
buttonAllCountries.addEventListener("click", generateAllCountries);
