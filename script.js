
    const btnGroup = document.getElementsByClassName('btn-group');

    const BtnActive = btnGroup[0].getElementsByClassName('btn');
    
    for (var i = 0; i < BtnActive.length; i++) {
        BtnActive[i].addEventListener("click", function() {
          var current = document.getElementsByClassName(" active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";  
        });
      }


let currentCity = '';
let dailyData = {};

function showTab(tab) {
    document.getElementById('today').style.display = tab === 'today' ? 'block' : 'none';
    document.getElementById('forecast').style.display = tab === 'forecast' ? 'block' : 'none';
    document.getElementById('error').style.display = 'none';


}


async function loadWeather(city) {
    currentCity = city;

    document.getElementById('error').style.display = 'none';
    document.getElementById('today').style.display = 'block';
    document.getElementById('forecast').style.display = 'none';

    const todayURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const todayResponse = await fetch(todayURL);
        if (!todayResponse.ok) throw new Error();

        const todayData = await todayResponse.json();
        displayTodayWeather(todayData);

        const forecastResponse = await fetch(forecastURL);
        if (!forecastResponse.ok) throw new Error();

        const forecastData = await forecastResponse.json();
        displayForecastWeather(forecastData);

        const todayDate = new Date().toISOString().split('T')[0];
        displayHourlyToday(forecastData, todayDate);

      
        localStorage.setItem('lastSearchedCity', city);
    } catch {
        showErrorPage(city);
    }
}



function displayTodayWeather(data) {
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById('todayWeather').innerHTML = `
    
        <h4>${data.name}</h4>
        <p>${new Date().toDateString()}</p>
        <img width="100px" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
        <p><strong>${data.weather[0].description}</strong></p>
        <div class="flex">
        <p>Temperature:<h2> ${data.main.temp}°C </h2></p>
        </div>
      
        <p>(Feels like ${data.main.feels_like}°C)</p>
        <p>Sunrise: ${sunrise} | Sunset: ${sunset}</p>
        <h5 class="mt-3">Hourly Forecast</h5>
        <div id="hourlyToday" class="row"></div>
    
    `;
}







function displayHourlyToday(forecastData, todayDate) {
    const hourlyTodayContainer = document.getElementById('hourlyToday');
    hourlyTodayContainer.innerHTML = '';

    const todayHours = forecastData.list.filter(item => item.dt_txt.includes(todayDate));
    todayHours.forEach(hour => {
        const time = hour.dt_txt.split(' ')[1].slice(0, 5);
        hourlyTodayContainer.innerHTML += `
            <div class="col-md-2 hour-card text-center shadow bg-card">
                <h6>${time}</h6>
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" class="weather-icon">
                <p>${hour.weather[0].description}</p>
                <p>Temp: ${hour.main.temp}°C</p>
                <p>Feels: ${hour.main.feels_like}°C</p>
                <p>Wind: ${hour.wind.speed} m/s</p>
            </div>
        `;
    });
}




function showErrorPage(city) {
    document.getElementById('error').style.display = 'block';
    document.getElementById('errorCity').innerText = city;

    document.getElementById('today').style.display = 'none';
    document.getElementById('forecast').style.display = 'none';

}







function displayForecastWeather(data) {
    const forecastDays = document.getElementById('forecastDays');
    const hourlyForecast = document.getElementById('hourlyForecast');
    forecastDays.innerHTML = '';
    hourlyForecast.innerHTML = '';



    dailyData = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) dailyData[date] = [];
        dailyData[date].push(item);
    });



    Object.keys(dailyData).slice(0, 5).forEach(date => {
        const day = dailyData[date][0];
        const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        forecastDays.innerHTML += `
            <div class="col-md-2 day-card text-center cursor-pointer shadow-hover-forecast bg-card" onclick="displayHourly('${date}')">
                <h5>${weekday}</h5>
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="weather-icon">
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;


        if (!document.getElementById('selectedDay').innerText) {
            displayHourly(date);
        }
    });
}














function displayHourly(date) {
    const hourlyForecast = document.getElementById('hourlyForecast');
    document.getElementById('selectedDay').innerText = date;
    hourlyForecast.innerHTML = '';

    dailyData[date].forEach(hour => {
        const time = hour.dt_txt.split(' ')[1].slice(0, 5);
        hourlyForecast.innerHTML += `
            <div class="col-md-2 hour-card text-center shadow bg-card">
                <h6>${time}</h6>
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" class="weather-icon">
                <p>${hour.weather[0].description}</p>
                <p>Temp: ${hour.main.temp}°C</p>
                <p>Feels: ${hour.main.feels_like}°C</p>
                <p>Wind: ${hour.wind.speed} m/s</p>
            </div>
        `;
    });
}






function searchCity(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    loadWeather(city);
    BtnActive[1].classList.remove('active');
    BtnActive[0].classList.add('active');
}


window.onload = () => {
   
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    const defaultCity = 'Tsuman';

    if (lastSearchedCity) {
        loadWeather(lastSearchedCity);
    } else {
        loadWeather(defaultCity);
    }
};
