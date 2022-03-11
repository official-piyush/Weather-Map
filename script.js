import { format } from 'date-fns';
import pngObject from 'images/*.png';

let timeNow;
let dateToday;

const app = document.querySelector(`.wrapper`);
const button = app.querySelector(`.submit`);
const cityField = app.querySelector(`input[type=text]`);
const error = app.querySelector(`.error`);

const initialState = {
  requestDate: dateToday,
  requestTime: timeNow,
  temp: `T`,
  loc: `City`,
  pres: `0`,
  humid: `0`,
  wind: `0`,
  describe: `Status`,
  cloud: `0`,
  visibile: `0`,
  sunriseTime: `00:00`,
  sunsetTime: `00:00`,
  icon: pngObject[`404`],
};

console.log(pngObject);

const card1 = app.querySelector(`.card-1`);

const currentDate = card1.querySelector(`.date`);
const currentTime = card1.querySelector(`.current-time`);
const temperature = card1.querySelector(`p.temperature strong`);
const location = card1.querySelector(`p.location`);
const pressure = card1.querySelector(`.pressure`);
const humidity = card1.querySelector(`.humidity`);
const wind = card1.querySelector(`.wind`);
const weatherIcon = card1.querySelector(`.center-icon`);

const card2 = app.querySelector(`.card-2`);

const description = card2.querySelector(`.description`);
const clouds = card2.querySelector(`.clouds`);
const visibility = card2.querySelector(`.visible`);
const sunRise = card2.querySelector(`.sun-rise`);
const sunSet = card2.querySelector(`.sun-set`);

function formatSentence(sentence) {
  const wordsList = sentence.split(` `);
  return wordsList
    .map((word) => {
      if (word.toLowerCase() !== `and` && word.toLowerCase() !== `with`) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        word = `<span class="and-with"><br>${word}<br></span>`;
      }
      return word;
    })
    .join(` `);
}

function formatDate(date) {
  return format(date, "MMM dd',' yyyy");
}

function formatTime(date, required = false) {
  if (required) {
    return format(date, 'K:mm a');
  }
  return format(date, 'K:mm');
}

function createDate(unixStamp) {
  return new Date(unixStamp * 1000);
}

function setDateTime() {
  const today = new Date();
  dateToday = formatDate(today);
  timeNow = formatTime(today, true);
  currentDate.textContent = dateToday;
  currentTime.textContent = timeNow;
}

function displayData(currentState) {
  setDateTime();
  temperature.textContent = currentState.temp;
  location.textContent = currentState.loc;
  pressure.textContent = currentState.pres;
  humidity.textContent = currentState.humid;
  wind.textContent = currentState.wind;
  description.textContent = currentState.describe;
  clouds.textContent = currentState.cloud;
  visibility.textContent = currentState.visible;
  sunRise.textContent = currentState.sunriseTime;
  sunSet.textContent = currentState.sunsetTime;
  weatherIcon.src = currentState.icon;
}

async function setState(data) {
  const currentState = { ...initialState };
  if (data) {
    let temp = data.main.temp;
    currentState.temp = +temp.toFixed(1);

    currentState.loc = `${data.name}, ${data.sys.country}`;

    currentState.pres = data.main.pressure;

    currentState.humid = data.main.humidity;

    let windSpeed = data.wind.speed;
    windSpeed = Math.floor((windSpeed * 18) / 5);
    currentState.wind = windSpeed;

    let describe = data.weather[0].description;
    describe = formatSentence(describe);
    currentState.describe = describe;

    currentState.cloud = data.clouds.all;

    currentState.visible = data.visibility;

    const unixSunrise = data.sys.sunrise;
    let fullDate = createDate(unixSunrise);
    currentState.sunriseTime = formatTime(fullDate);

    const unixSunset = data.sys.sunset;
    fullDate = createDate(unixSunset);
    currentState.sunsetTime = formatTime(fullDate);

    currentState.icon = pngObject[data.weather[0].icon];
  }

  displayData(currentState);
}

async function getWeather(city, key) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  const response = await fetch(endpoint);
  console.log(response);

  if (response.status >= 200 && response.status <= 299) {
    const data = await response.json();
    setState(data);
  } else {
    error.classList.add(`show`);
    setState(false);
  }
}

async function handleClick(event) {
  event.preventDefault();
  const city = cityField.value;
  const key = `Your Key`;
  const data = await getWeather(city, key);
}

cityField.addEventListener(`input`, () => {
  error.classList.remove(`show`);
});

button.addEventListener(`click`, handleClick);

setDateTime();
