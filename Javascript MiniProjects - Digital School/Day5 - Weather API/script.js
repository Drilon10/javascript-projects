const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const error = document.getElementById('error');


const API_KEY = '81e795d9e30d9142d3918d58e395f256';


searchBtn.addEventListener('click', () => {
const city = cityInput.value.trim();
if (city === '') return;
getWeather(city);
});


cityInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') searchBtn.click();
});


async function getWeather(city) {
try {
error.textContent = '';
weatherResult.classList.add('d-none');


const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);


if (!response.ok) throw new Error('City not found');


const data = await response.json();
showWeather(data);
} catch (err) {
error.textContent = err.message;
}
}


function showWeather(data) {
weatherResult.classList.remove('d-none');


weatherResult.innerHTML = `
<h4>${data.name}</h4>
<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
<p class="fs-3">${Math.round(data.main.temp)}°C</p>
<p class="text-capitalize">${data.weather[0].description}</p>
<p>💧 Humidity: ${data.main.humidity}%</p>
<p>💨 Wind: ${data.wind.speed} m/s</p>
`;
}