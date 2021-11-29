var request = new XMLHttpRequest();

request.open('GET', 'https://api.openweathermap.org/data/2.5/onecall?lat=40.7128&lon=-74.0060&units=imperial&exclude=&appid=1a6d7f8ce4928ebffa98a0a3025a84ae', true)

request.onload = function (){
    let data = JSON.parse(this.response);
    console.log(data);
    // Main Panel
    
    // Select all innerHTML
    let tempOutput = document.querySelector('.temp');

    // Gather all data
    let temp = data.current.temp;

    // Display the data
    tempOutput.innerHTML = temp + ' F';
    console.log(temp);





    // Future Hours Panel

    // Future Days Panel

}


request.send();

