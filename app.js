const API_KEY = '9505fd1df737e20152fbd78cdb289b6a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct?appid=' + API_KEY;

let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (valueSearch.value.trim() === '') {
        displayError("Please enter a location.");
        return;
    }
    searchWeather();
});

const displayError = (message) => {
    const errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.innerText = message;
    main.appendChild(errorElement);
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
};

const toggleLoading = (isLoading) => {
    if (isLoading) {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loading');
        loadingElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
        main.appendChild(loadingElement);
    } else {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
};

const searchWeather = () => {
    const location = valueSearch.value.trim().replace(/\s+/g, ',');
    const cityUrl = `${BASE_URL}&q=${location}`;

    toggleLoading(true);
    fetch(cityUrl)
        .then(response => response.json())
        .then(data => {
            toggleLoading(false);
            if (data.cod == 200) {
                const geoUrl = `${GEO_URL}&q=${data.name},${data.sys.country}`;
                fetch(geoUrl)
                    .then(response => response.json())
                    .then(geoData => {
                        let locationName = data.name;
                        if (geoData[0] && geoData[0].state) {
                            locationName += `, ${geoData[0].state}`;
                        }
                        if (data.sys.country) {
                            locationName += `, ${data.sys.country}`;
                        }
                        city.querySelector('figcaption').innerHTML = locationName;
                        city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                        temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                        temperature.querySelector('span').innerText = data.main.temp;
                        description.innerText = data.weather[0].description;
                        clouds.innerText = data.clouds.all;
                        humidity.innerText = data.main.humidity;
                        pressure.innerText = data.main.pressure;
                    });
            } else {
                displayError("Location not found. Please try again.");
                main.classList.add('error');
                setTimeout(() => {
                    main.classList.remove('error');
                }, 1000);
            }
            valueSearch.value = '';
        })
        .catch(err => {
            toggleLoading(false);
            displayError("An error occurred. Please try again later.");
        });
};

const initApp = () => {
    const lastLocation = localStorage.getItem('lastLocation') || 'Delhi,India';
    valueSearch.value = lastLocation;
    searchWeather();
};

initApp();
