const apiKey = '1cb0618925msh271f76c1a13f805p119986jsnb7900a92f560'; // Replace with your actual GeoDB API key
const weatherApiKey = 'eabdf564f0fc54f9336b850f97dfe725'; // Replace with your actual Weather API key

let debounceTimer;

async function fetchCities() {
    const query = document.getElementById('cityInput').value;
    const limit = 5; // Limit the number of suggestions
    const apiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=${limit}`;

    if (query.length === 0) { 
        // Clear suggestions if input is empty
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const cities = data.data; // Extract cities data
        displayCities(cities); // Call function to display cities
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

function displayCities(cities) {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    // Loop through the cities and create list items
    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = `${city.name}, ${city.country}`;
        listItem.onclick = () => {
            document.getElementById('cityInput').value = city.name;
            suggestionsList.innerHTML = ''; // Clear suggestions on selection
            fetchWeatherForInput(); // Fetch weather for the selected city
        };
        suggestionsList.appendChild(listItem);
    });
}

// Debounce function to limit API calls
function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

// Attach event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cityInput').addEventListener('input', () => debounce(fetchCities, 300)); // Add debouncing to input event
});

async function fetchWeatherForInput() {
    const cityName = document.getElementById('cityInput').value;

    if (!cityName) {
        document.getElementById('weather-detail').textContent = 'Please enter a city name.';
        return;
    }

    // Use GeoDB API to get city details (latitude and longitude)
    const apiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cityName}&limit=1`; // Limit to 1 to get the closest match

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const city = data.data[0];

        if (!city) {
            document.getElementById('weather-detail').textContent = 'City not found.';
            return;
        }

        const lat = city.latitude;
        const lon = city.longitude;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        const temperature = weatherData.main.temp;
        document.getElementById('weather-detail').textContent = `Temperature: ${temperature}°C`;
        console.log(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('weather-detail').textContent = 'Error fetching weather details.';
    }
}
