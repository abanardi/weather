var request = new XMLHttpRequest();

function apiAccess (lat, lon, units){
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely,alerts&appid=1a6d7f8ce4928ebffa98a0a3025a84ae`;

}


const dayNames = ['Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]

const monthNames = ['January',
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
                ]

function getDate(dt){
    let date = new Date(dt * 1000);
    
    let day = date.getDay().toString();
    let month = date.getMonth().toString();
    let number = date.getDate().toString();
    let year = date.getFullYear().toString();

    return dayNames[day] + ' ' + monthNames[month] + ' ' + number + ', ' + year
}

function getlocalDate(offset){
    date = new Date();
    currentHour = date.getUTCHours();
    hourOffset = offset/3600;
    localHour = Math.trunc(currentHour + hourOffset);
    
    if(localHour < 0){
        date.setDate(date.getDate()-1);
    }
    else if(localHour >= 24){
        date.setDate(date.getDate()+1);
    }
    currentDay = date.getUTCDay();
    currentMonth = date.getUTCMonth();
    currentDate = date.getUTCDate();
    currentYear = date.getUTCFullYear();
    return dayNames[currentDay] + ' ' + monthNames[currentMonth] + ' ' + currentDate + ', ' + currentYear;
}

function getlocalDay(offset){
    date = new Date();
    currentHour = date.getUTCHours();
    hourOffset = offset/3600;
    localHour = Math.trunc(currentHour + hourOffset);
    if(localHour < 0){
        date.setDate(date.getDate()-1);
    }
    else if(localHour >= 24){
        date.setDate(date.getDate()+1);
    }
    currentDay = date.getUTCDay();
    return currentDay;
}

function getHour(offset){
    date = new Date();
    currentHour = date.getUTCHours();
    hourOffset = offset/3600;
    output = Math.trunc(currentHour + hourOffset);
    //Add something that takes care of case where the time is greater than 24
    // For example, if it's 11PM UTC, the clock might just return
    // something higher than 24 in the future hour cards.
    
    if(output >= 0){
        return output
    }
    else{
        return 24 + output;
    }
}

newYork = apiAccess(40.7128, -74.006, 'imperial')
stateCollege = apiAccess(40.7934, -77.8600, 'imperial');
denver = apiAccess(39.7392, -104.9903, 'imperial');
london = apiAccess(51.5072, -0.1276, 'imperial')
surabaya = apiAccess(-7.2575, 112.7521, 'imperial');
chicago = apiAccess(41.8781, -87.62998, 'imperial');
losAngeles = apiAccess(34.0522, -118.2437, 'imperial');
lasVegas = apiAccess(36.1699, -115.1398, 'imperial');
melbourne = apiAccess(-37.8136, 144.9631, 'imperial');
auckland = apiAccess(-36.8509, 174.7645, 'imperial');
tarawa = apiAccess(1.4518, 172.9717, 'imperial');
mumbai = apiAccess(19.0760, 72.8777, 'imperial');
adelaide = apiAccess(-34.9285, 138.6007,'imperial');

function render(location){

    request.open('GET', location, true)

    request.onload = function (){
        let data = JSON.parse(this.response);
        //console.log(data);
        

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
        let hiLowOutput =  hi + '/' + low;
        let dateOutput = getlocalDate(data.timezone_offset);
        let conditionOutput = data.current.weather[0].main;


        // Set inner HTML
        temp.innerHTML = Math.round(tempOutput) + ' F';
        hiLow.innerHTML = hiLowOutput + ' F';
        date.innerHTML = dateOutput;
        console.log(date.innerHTML);
        condition.innerHTML = conditionOutput;






        // Future Hours Panel

        // Select all inner HTML
        let humidity = document.querySelectorAll('.humidity');
        let wind = document.querySelectorAll('.wind');
        console.log(wind);
        let feelsLike = document.querySelectorAll('.feels-like');
        let hourCards = document.querySelectorAll('.hour-cards .card');


        // Gather all Values
        let humidityOutput = data.current.humidity;
        let windOutput = data.current.wind_speed;
        let feelsLikeOutput = data.current.feels_like;



        // Set inner HTML
        humidity.forEach(element => {
            element.innerHTML = 'Humidity: ' + humidityOutput + ' %'; 
        });
        wind.forEach(element => {
            element.innerHTML = 'Wind: ' + windOutput + ' mph';
        });
        feelsLike.forEach(element => {
            element.innerHTML = 'Feels Like: ' + Math.round(feelsLikeOutput) + ' F';    
        });
        var additionalHour = 1;

        hourCards.forEach(element => {
            let hourDigit = getHour(data.timezone_offset);
            output = hourDigit + additionalHour;
            let post = '';
            if(output >= 24){
                output -= 24;
            }

            if(output > 12){
                output -= 12;
                post = 'PM';
            }
            else if(output === 0){
                output = 12;
                post = 'AM';
            }
            else if(output === 12){
                post = 'PM';
            }
            else{
                post = 'AM';
            }

            
            let hour = `<p class="hour">${output + ' ' + post}</p>`;

            let img = `<img src="conditions/if-weather-3-2682848_90785.ico" class="future-condition">`;
            let futureTemp = `<p class="future-temp">${Math.round(data.hourly[additionalHour].temp)} F</p>`
            let cardContent = img+hour+futureTemp;
            element.innerHTML = cardContent;
            additionalHour++;
        });
        
        // Select all inner HTML
        let dayCards = document.querySelectorAll('.day-cards .card');

        // Set inner HTML
        var additionalDay = 1;
        var today = getlocalDay(data.timezone_offset) + 1;
        dayCards.forEach(element => {
        
            let dayCondition = `<img src="conditions/if-weather-3-2682848_90785.ico" class="future-condition">`;
            let futureDay = `<p class="day">${dayNames[today].substr(0,3)}</p>`;
            let high = data.daily[additionalDay].temp.max;
            let low = data.daily[additionalDay].temp.min;
            let dayHiLow = `<p class="future-temp">${Math.round(high)}/${Math.round(low)}</p>`
            let cardContent = dayCondition+futureDay+dayHiLow;
            element.innerHTML = cardContent;
            additionalDay += 1;
            today += 1;

        });
    }
    request.send();
}

render(stateCollege);

unitChanger = document.querySelector('.change-units'); 
unitChanger.addEventListener('click', () => {
    if(unitChanger.innerHTML === 'Metric'){
        //render(location, 'metric');
        unitChanger.innerHTML = 'Imperial';
    }
    else if(unitChanger.innerHTML === 'Imperial'){
        //render(location, 'imperial');
        unitChanger.innerHTML = 'Metric';
    }
});

document.querySelector('.change-location').addEventListener('click', () => {
    render(adelaide);
});



