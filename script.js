var request = new XMLHttpRequest();
var coordinates = new XMLHttpRequest();

function apiAccess(lat, lon, units) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely,alerts&appid=1a6d7f8ce4928ebffa98a0a3025a84ae`;
}

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getDate(dt) {
  let date = new Date(dt * 1000);

  let day = date.getDay().toString();
  let month = date.getMonth().toString();
  let number = date.getDate().toString();
  let year = date.getFullYear().toString();

  return dayNames[day] + ' ' + monthNames[month] + ' ' + number + ', ' + year;
}

function getlocalDate(offset) {
  date = new Date();
  currentHour = date.getUTCHours();
  hourOffset = offset / 3600;
  localHour = Math.trunc(currentHour + hourOffset);

  if (localHour < 0) {
    date.setDate(date.getDate() - 1);
  } else if (localHour >= 24) {
    date.setDate(date.getDate() + 1);
  }
  currentDay = date.getUTCDay();
  currentMonth = date.getUTCMonth();
  currentDate = date.getUTCDate();
  currentYear = date.getUTCFullYear();
  return (
    dayNames[currentDay] +
    ' ' +
    monthNames[currentMonth] +
    ' ' +
    currentDate +
    ', ' +
    currentYear
  );
}

function getlocalDay(offset) {
  date = new Date();
  currentHour = date.getUTCHours();
  hourOffset = offset / 3600;
  localHour = Math.trunc(currentHour + hourOffset);
  if (localHour < 0) {
    date.setDate(date.getDate() - 1);
  } else if (localHour >= 24) {
    date.setDate(date.getDate() + 1);
  }
  currentDay = date.getUTCDay();
  return currentDay;
}

function getHour(offset) {
  date = new Date();
  currentHour = date.getUTCHours();
  hourOffset = offset / 3600;
  output = Math.trunc(currentHour + hourOffset);
  //Add something that takes care of case where the time is greater than 24
  // For example, if it's 11PM UTC, the clock might just return
  // something higher than 24 in the future hour cards.

  if (output >= 0) {
    return output;
  } else {
    return 24 + output;
  }
}

class city {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }
}

function render(location, units) {
  request.open('GET', location, true);

  request.onload = function () {
    if (units === 'imperial') {
      var tempUnit = 'F';
      var speedUnit = 'mph';
    } else if (units === 'metric') {
      var tempUnit = 'C';
      var speedUnit = 'm/s';
    }

    const conditions = {
      '01': 'clear',
      '02': 'partly-cloudy',
      '03': 'partly-cloudy',
      '04': 'cloudy',
      '09': 'rain',
      10: 'rain',
      11: 'thunder',
      13: 'snow',
      50: 'mist',
      d: '-day',
      n: '-night',
    };



    let data = JSON.parse(this.response);
    // console.log(data);


    // Main Panel

    // Select all inner HTML
    let hiLow = document.querySelector('.temps');

    let date = document.querySelector('.date-written');

    let city = document.querySelector('.city');

    let temp = document.querySelector('.temp');
    let condition = document.querySelector('.condition');

    // Gather all values
    let tempOutput = data.current.temp;
    let hi = Math.round(data.daily[0].temp.max);
    let low = Math.round(data.daily[0].temp.min);
    let hiLowOutput = hi + '/' + low;
    let dateOutput = getlocalDate(data.timezone_offset);
    let conditionOutput = data.current.weather[0].main;
    let conditionImageID = data.current.weather[0].icon;
    let conditionBackground =
      conditions[conditionImageID.substr(0, 2)] +
      conditions[conditionImageID.substr(2, 1)];


    // Set inner HTML
    temp.innerHTML = Math.round(tempOutput) + ' ' + tempUnit;
    hiLow.innerHTML = hiLowOutput + ' ' + tempUnit;
    date.innerHTML = dateOutput;
    condition.innerHTML = conditionOutput;
    let conditionImage = document.getElementsByClassName('condition-image')[0];
    conditionImage.src =
      'http://openweathermap.org/img/wn/' + conditionImageID + '@2x.png';

    // Modify inner CSS
    let main = document.getElementById('main');
    main.style.background = `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${'conditions/' + conditionBackground + '.jpg'})`;


    // Future Hours Panel

    // Select all inner HTML
    let humidity = document.querySelectorAll('.humidity');
    let wind = document.querySelectorAll('.wind');
    let feelsLike = document.querySelectorAll('.feels-like');
    let hourCards = document.querySelectorAll('.hour-cards .card');

    // Gather all Values
    let humidityOutput = data.current.humidity;
    let windOutput = data.current.wind_speed;
    let feelsLikeOutput = data.current.feels_like;

    // Set inner HTML
    humidity.forEach((element) => {
      element.innerHTML = 'Humidity: ' + humidityOutput + ' %';
    });
    wind.forEach((element) => {
      element.innerHTML = 'Wind: ' + windOutput + ' ' + speedUnit;
    });
    feelsLike.forEach((element) => {
      element.innerHTML =
        'Feels Like: ' + Math.round(feelsLikeOutput) + ' ' + tempUnit;
    });
    var additionalHour = 1;

    hourCards.forEach((element) => {
      let hourDigit = getHour(data.timezone_offset);
      output = hourDigit + additionalHour;
      let post = '';
      if (output >= 24) {
        output -= 24;
      }

      if (output > 12) {
        output -= 12;
        post = 'PM';
      } else if (output === 0) {
        output = 12;
        post = 'AM';
      } else if (output === 12) {
        post = 'PM';
      } else {
        post = 'AM';
      }

      let hour = `<p class="hour">${output + ' ' + post}</p>`;

      let conditionImageID = data.hourly[additionalHour].weather[0].icon;
      // console.log(conditionImageID);
      condition.innerHTML = conditionOutput;
      let conditionImage =
        document.getElementsByClassName('future-condition')[additionalHour];
      conditionImage.src =
        'http://openweathermap.org/img/wn/' + conditionImageID + '@2x.png';

      let img = `<img src="${conditionImage.src}" class="future-condition">`;

      let futureTemp = `<p class="future-temp">${Math.round(
        data.hourly[additionalHour].temp
      )} ${tempUnit}</p>`;
      let cardContent = img + hour + futureTemp;
      element.innerHTML = cardContent;
      additionalHour++;
    });

    // Select all inner HTML
    let dayCards = document.querySelectorAll('.day-cards .card');

    // Set inner HTML
    var additionalDay = 1;
    var today = getlocalDay(data.timezone_offset) + 1;
    dayCards.forEach((element) => {
      if (today === 7) {
        today = 0;
      }

      let conditionImageID = data.daily[additionalDay].weather[0].icon;
      // console.log(conditionImageID);
      condition.innerHTML = conditionOutput;
      let conditionImage =
        document.getElementsByClassName('future-condition')[additionalDay];
      conditionImage.src =
        'http://openweathermap.org/img/wn/' + conditionImageID + '@2x.png';

      let dayCondition = `<img src="${conditionImage.src}" class="future-condition">`;
      let futureDay = `<p class="day">${dayNames[today].substr(0, 3)}</p>`;
      let high = data.daily[additionalDay].temp.max;
      let low = data.daily[additionalDay].temp.min;
      let dayHiLow = `<p class="future-temp">${Math.round(high)}/${
        Math.round(low) + ' ' + tempUnit
      }</p>`;
      let cardContent = dayCondition + futureDay + dayHiLow;
      element.innerHTML = cardContent;
      additionalDay += 1;
      today += 1;
    });
  };
  request.send();
}

// Happening on screen

// let cityCoordinates = new city(40.7934, -77.86);
let units = 'imperial';

async function changeCoords(cityQuery) {
  let example = fetch(
    'https://nominatim.openstreetmap.org/search?format=json&q=' + cityQuery
  ).then((response) => response.json());

  example
    .then((data) => {
      // let latitude = document.querySelecet indextor(".lat");
      // let longitude = document.querySelector(".lon");
      let results = document.querySelector('.results');
      results.innerHTML = ' ';
      if (data.length === 0) {
        results.innerHTML += `<p class = 'no-result' >No results, try again</p>`;
      } else {
        for (const city in data) {
          let result = data[city].display_name;
          let coords = data[city].boundingbox;
          let lat = (parseFloat(coords[0]) + parseFloat(coords[1])) / 2;
          let lon = (parseFloat(coords[2]) + parseFloat(coords[3])) / 2;
          results.innerHTML += `<p class='city-result ${city}'>${result}</p><p class = 'coordinate-result ${city}' >${
            lat + ',' + lon
          }</p>`;
        }
      }
      // console.log(data);
      // console.log(data.length);
      //console.log(data[1].boundingbox);
    })
    .then(() => {
      let cities = document.querySelectorAll('.city-result');

      //let coord = document.querySelector(".coordinate-result.0");

      cities.forEach((button) =>
        button.addEventListener('click', () => {
          let index = button.className.charAt(button.className.length - 1);
          let coord = document.getElementsByClassName(
            'coordinate-result ' + index
          );
          document
            .querySelector('.overlay')
            .setAttribute('class', 'overlay-hidden');
          // console.log(coord[0].innerHTML);
          let coordArray = coord[0].innerHTML.split(',');
          // console.log(coordArray);
          document.querySelector('.lat').innerHTML = coordArray[0];
          document.querySelector('.lon').innerHTML = coordArray[1];
          document.querySelector('.city').innerHTML = button.innerHTML;
          render(apiAccess(coordArray[0], coordArray[1], units), units);
        })
      );
    });
}
function getCurrentWeather() {
  navigator.geolocation.getCurrentPosition((showPosition) => {
    const p = showPosition.coords;
    // console.log(p.latitude, p.longitude);

    fetch(
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
        p.latitude +
        '&lon=' +
        p.longitude +
        '&zoom=10'
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        document.querySelector('.lat').innerHTML = p.latitude;
        document.querySelector('.lon').innerHTML = p.longitude;

        document.querySelector('.city').innerHTML =
          data.address.city +
          ', ' +
          data.address.county +
          ', ' +
          data.address.state +
          ', ' +
          data.address.country;
      });

    render(apiAccess(p.latitude, p.longitude, units), units);
  });
}

getCurrentWeather();
// render(apiAccess(cityCoordinates.lat, cityCoordinates.lon, units), units);

currentLocation = document.querySelector('.location-icon');
currentLocation.addEventListener('click', () => {
  getCurrentWeather();
});

unitChanger = document.querySelector('.change-units');
unitChanger.addEventListener('click', () => {
  if (unitChanger.innerHTML === 'Metric') {
    unitChanger.innerHTML = 'Imperial';
    units = 'metric';

    let cityLat = document.querySelector('.lat').innerHTML;
    let cityLon = document.querySelector('.lon').innerHTML;
    cityCoordinates = new city(cityLat, cityLon);

    render(apiAccess(cityCoordinates.lat, cityCoordinates.lon, units), units);
  } else if (unitChanger.innerHTML === 'Imperial') {
    unitChanger.innerHTML = 'Metric';
    units = 'imperial';

    let cityLat = document.querySelector('.lat').innerHTML;
    let cityLon = document.querySelector('.lon').innerHTML;
    cityCoordinates = new city(cityLat, cityLon);

    render(apiAccess(cityCoordinates.lat, cityCoordinates.lon, units), units);
  }
});

changeLocation = document.querySelectorAll('.change-location');
changeLocation.forEach((button) =>
  button.addEventListener('click', () => {
    document.querySelector('.overlay-hidden').setAttribute('class', 'overlay');
  })
);

document.querySelector('.change-days').addEventListener('click', () => {
  document.querySelector('.hidden').setAttribute('class', 'future-days panel');
  document.querySelector('.future-hours').setAttribute('class', 'hidden');
});

document.querySelector('.change-hours').addEventListener('click', () => {
  document.querySelector('.hidden').setAttribute('class', 'future-hours panel');
  document.querySelector('.future-days').setAttribute('class', 'hidden');
});

document.querySelector('.close').addEventListener('click', () => {
  document.querySelector('.overlay').setAttribute('class', 'overlay-hidden');
});

document.querySelector('.search-bar').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    // console.log("Trigger");
    let citySearch = document.getElementById('city-name').value;
    changeCoords(citySearch);
  }
});
