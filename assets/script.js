// $(document).ready(function () {
//
// });

const apiURL = "https://api.openweathermap.org";
const myApiKey = "7c6e84c4d2bbe1fd8c0477ebcc15c4ba";
let searchHistory = [];
// Declare variable for form, button and input

let searchButton = $("#search-button");
let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history");
let todayContainer = $("#today");
let forecastContainer = $("#forecast");

function renderSearchHistory() {
  searchHistoryContainer.html("");

  for (let i = 0; i < searchHistory.length; i++) {
    let btn = $("<button>");

    btn.attr("type", "button");
    btn.addClass("history-btn btn-history");
    btn.attr("data-search", searchHistory[i]);
    btn.text(searchHistory[i]);
    searchHistoryContainer.append(btn);
  }
}

function appendSearchHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }

  searchHistory.push(search);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  renderSearchHistory();
}

function renderCurrentWeather(city, weatherData) {
  let date = moment().format("D/M/YYYY");
  let tempC = weatherData["main"]["temp"];
  let windKph = weatherData["wind"]["speed"];
  let humidity = weatherData["main"]["humidity"];
  let iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  let iconDescription =
    weatherData.weather[0].description || weatherData[0].main;
  let card = $("<div>");
  let cardBody = $("<div>");

  let weatherIcon = $("<img>");

  let heading = $("<h2>");
  let tempElement = $("<p>");
  let windElement = $("<p>");
  let humidityElement = $("<p>");

  card.attr("class", "card");
  cardBody.attr("class", "card-body");
  card.append(cardBody);
  heading.attr("class", "h3 card-title");
  tempElement.attr("class", "card-text");
  windElement.attr("class", "card-text");
  humidityElement.attr("class", "card-text");

  heading.text(`${city} (${date})`);
  weatherIcon.attr("src", iconUrl);
  weatherIcon.attr("alt", iconDescription);
  heading.append(weatherIcon);
  tempElement.text(`Temp ${tempC} C`);
  windElement.text(`Wind ${windKph} Kph`);
  humidityElement.text(`Humidity ${humidity} %`);
  cardBody.append(heading, tempElement, windElement, humidityElement);

  todayContainer.html("");
  todayContainer.append(card);
}

function renderForecast(weatherData) {
  let headingCol = $("<div>");
  let heading = $("<h4>");

  headingCol.attr("class", "col-12");
  heading.text("5 day forecast");
  headingCol.append(heading);

  forecastContainer.html("");
  forecastContainer.append(headingCol);

  let futureForecast = weatherData.filter(function (forecast) {
    return forecast.dt_txt.includes("12");
  });

  for (let i = 0; i < futureForecast.length; i++) {
    let iconUrl = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`;

    let iconDescription = futureForecast[i].weather[0].description;
    let tempC = futureForecast[i].main.temp;
    let humidity = futureForecast[i].main.humidity;
    let windKph = futureForecast[i].wind.speed;

    let col = $("<div>");
    let card = $("<div>");
    let cardBody = $("<div>");
    let cardTitle = $("<h5>");
    let weatherIcon = $("<img>");

    let tempElement = $("<p>");
    let windElement = $("<p>");
    let humidityElement = $("<p>");

    col.append(card);
    card.append(cardBody);
    cardBody.append(
      cardTitle,
      weatherIcon,
      tempElement,
      windElement,
      humidityElement
    );

    col.attr("class", "col-md");
    card.attr("class", "card bg-primary h-100 text-white");
    cardTitle.attr("class", "card-title");
    tempElement.attr("class", "card-text");
    windElement.attr("class", "card-text");
    humidityElement.attr("class", "card-text");

    cardTitle.text(moment(futureForecast[i].dt_text).format("D/M/YYYY"));
    weatherIcon.attr("src", iconUrl);
    weatherIcon.attr("alt", iconDescription);
    tempElement.text(`Temp ${tempC} C`);
    windElement.text(`Wind ${windKph} Kph`);
    humidityElement.text(`Humidity ${humidity} %`);

    forecastContainer.append(col);
  }
}

function fetchWeather(location) {
  let latitude = location.lat;
  let longitude = location.lon;
  let city = location.name;

  let queryWeatherURL = `${apiURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${myApiKey}`;

  console.log(queryWeatherURL);

  $.ajax({
    url: queryWeatherURL,
    method: "GET",
  }).then(function (response) {
    renderCurrentWeather(city, response.list[0]);
    renderForecast(response.list);
  });
}

function fetchCoord(search) {
  let queryURL = `${apiURL}/geo/1.0/direct?q=${search}&limit=5&appid=${myApiKey}`;

  fetch(queryURL, { method: "GET" })
    .then(function (data) {
      return data.json();
    })
    .then(function (response) {
      if (!response[0]) {
        alert("Location not found");
      } else {
        appendSearchHistory(search);
        fetchWeather(response[0]);
      }
    });
}

function initializeHistory() {
  let storedHistory = localStorage.getItem("search-history");

  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }

  renderSearchHistory();
}

function submitSearchForm(event) {
  event.preventDefault();
  let search = searchInput.val().trim();
  fetchCoord(search);
  searchInput.val("");
}

function clickSearchHistory(event) {
  if (!$(event.target).hasClass("btn-history")) {
    return;
  }

  let search = $(event.target).attr("data-search");

  fetchCoord(search);
  searchInput.val("");
}

initializeHistory();
searchForm.on("submit", submitSearchForm);
searchHistoryContainer.on("click", clickSearchHistory);
