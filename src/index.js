function formateDate() {
 let now = new Date();
 let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
 ];
 let day = days[now.getDay()];
 let hour = now.getHours();
 let minute = now.getMinutes();
 if (minute < 10) {
  minute = `0${minute}`;
 }
 let currentDateTime = `${day} ${hour}:${minute}`;

 let dateTime = document.querySelector(".date-time");
 dateTime.innerHTML = `${currentDateTime}`;
}

formateDate();

function changeCity(event) {
 event.preventDefault();
 let input = document.querySelector("#city-input");

 let cityElement = document.querySelector("h1");
 cityElement.innerHTML = `${input.value}`;

 celsiusLink.classList.add("active");
 fahrenheitLink.classList.remove("active");

 let apiKey = "82f43b0671f2tb328187o7be4ab620aa";
 let cityName = document.querySelector("#city-input").value;
 let url = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=metric`;

 axios.get(url).then(changeCurrentWeather);
}

let form = document.querySelector("#city-search");
form.addEventListener("submit", changeCity);

let currentTempElement = document.querySelector(".current-temperature");

function changeCurrentWeather(response) {
 let currentTemp = Math.round(response.data.temperature.current);
 currentTempElement.innerHTML = currentTemp;

 celsiusTemp = response.data.temperature.current;

 let conditionElement = document.querySelector(".current-condition");
 conditionElement.innerHTML = response.data.condition.description;

 let humidityElement = document.querySelector(".humidity");
 let humidity = response.data.temperature.humidity;
 humidityElement.innerHTML = `${humidity}%`;

 let windElement = document.querySelector(".wind");
 let wind = response.data.wind.speed;
 windElement.innerHTML = `${wind}km/h`;

 let currentEmoji = document.querySelector("#current-emoji");
 currentEmoji.setAttribute(
  "src",
  `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
 );

 getForecast(response.data.city);
}

function convertToFahrenheit(event) {
 event.preventDefault();
 celsiusLink.classList.remove("active");
 fahrenheitLink.classList.add("active");

 let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
 currentTempElement.innerHTML = Math.round(fahrenheitTemp);
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
 event.preventDefault();
 fahrenheitLink.classList.remove("active");
 celsiusLink.classList.add("active");
 currentTempElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", convertToCelsius);

function formatDateForecast(timestamp) {
 let date = new Date(timestamp * 1000);
 let day = date.getDay();

 let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

 return days[day];
}

function showForecast(response) {
 let forecastData = response.data.daily;
 let forecastElement = document.querySelector(".five-day");
 let forecastHTML = `<div class="row">`;
 forecastData.slice(0, 5).forEach(function (forecastDay) {
  forecastHTML += `
      <div class="col">
            <div class="day">
              <strong>${formatDateForecast(forecastDay.time)}</strong>
            </div>
            <img src="${
             forecastDay.condition.icon_url
            }" alt="weather-icon" id="five-day-emoji" class="img-fluid"></img>
            <div class="high-low">
              <div>
                <strong>
                ${Math.round(forecastDay.temperature.maximum)}°
                </strong>
              </div>
              <div>
              ${Math.round(forecastDay.temperature.minimum)}°
              </div>
            </div>
      </div>`;
 });
 forecastElement.innerHTML = forecastHTML;
}

function getForecast(city) {
 let apiKey = "82f43b0671f2tb328187o7be4ab620aa";
 let url = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

 axios.get(url).then(showForecast);
}

getForecast("Tokyo");
let apiKey = "82f43b0671f2tb328187o7be4ab620aa";
axios
 .get(
  `https://api.shecodes.io/weather/v1/current?query=Tokyo&key=${apiKey}&units=metric`
 )
 .then(changeCurrentWeather);
