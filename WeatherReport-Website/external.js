
function locationName()
{
    const loc_name = document.getElementById("name").value;

    console.log(loc_name);
}
async function fetchCities() {
    const apiKey = '1cb0618925msh271f76c1a13f805p119986jsnb7900a92f560'; // Your GeoDB API key
    const query = document.getElementById('cityInput').value;
    const limit = 10; // Limit the number of suggestions
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
        };
        suggestionsList.appendChild(listItem);
    });
}

// Show suggestions when input field is clicked
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cityInput').addEventListener('click', fetchCities);
});