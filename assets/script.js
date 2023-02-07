// $(document).ready(function () {
//   var apiUrl =
//     "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={7c6e84c4d2bbe1fd8c0477ebcc15c4ba}";
// });

// my api key for openweathermap
// "7c6e84c4d2bbe1fd8c0477ebcc15c4ba"

// Declare variable for form, button and input
// let searchButton = document.getElementById("search-button");
// let searchInput = document.getElementById("search-input");
// let searchForm = document.getElementById("search-form");

// let searchButton = $("search-button");
let searchInput = $("search-input");
let searchForm = $("search-form");

// Adding event listener to search form

function submitSearchFrom(event) {
  event.preventDefault();
  alert(searchInput.val().trim());
}

searchForm.on("submit", submitSearchFrom);

// searchForm.addEventListener("submit", function submitForm(event) {
//   event.preventDefault();
//   console.log(searchInput.val());
// });

// submitForm();
