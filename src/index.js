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

let currentTempElement = document.querySelector(".current-temperature");

function changeCurrentWeather(response) {
 let currentTemp = Math.round(response.data.temperature.current);
 currentTempElement.innerHTML = currentTemp;

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

 celsiusTemp = response.data.temperature.current;

 getForecast(response.data.city);
}

function convertToFahrenheit(event) {
 event.preventDefault();
 celsiusLink.classList.remove("active");
 fahrenheitLink.classList.add("active");
 let forecastLow = document.querySelectorAll(".low");
 let forecastHigh = document.querySelectorAll(".high");
 let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
 currentTempElement.innerHTML = Math.round(fahrenheitTemp);

 forecastLow.forEach((low) => {
  low.innerHTML = Math.round(((Number(low.innerHTML) - 32) * 5) / 9);
 });

 forecastHigh.forEach((high) => {
  high.innerHTML = Math.round(((Number(high.innerHTML) - 32) * 5) / 9);
 });
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
 event.preventDefault();
 currentTempElement.innerHTML = Math.round(celsiusTemp);

 let forecastLow = document.querySelectorAll(".low");
 let forecastHigh = document.querySelectorAll(".high");
 fahrenheitLink.classList.remove("active");
 celsiusLink.classList.add("active");

 forecastLow.forEach((low) => {
  low.innerHTML = Math.round(((Number(low.innerHTML) - 32) * 5) / 9);
 });

 forecastHigh.forEach((high) => {
  high.innerHTML = Math.round(((Number(high.innerHTML) - 32) * 5) / 9);
 });
}

let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", convertToCelsius);

function getForecastDay(timestamp) {
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
              <strong>${getForecastDay(forecastDay.time)}</strong>
            </div>
            <img src="${
             forecastDay.condition.icon_url
            }" alt="weather-icon" id="five-day-emoji"></img>
            <div class="high-low">
              <div class="high">
                ${Math.round(forecastDay.temperature.maximum)}
              </div>
              <div class="low">
              ${Math.round(forecastDay.temperature.minimum)}
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
