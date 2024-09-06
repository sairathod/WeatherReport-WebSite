// Define the API endpoint
const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd';


// Function to fetch cryptocurrency prices
async function getCryptoPrices() {
    try {
        // Make the API call
        const response = await fetch(apiUrl);
        
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Convert the response to JSON
        const data = await response.json();
        
        // Extract and log the prices
        const bitcoinPrice = data.bitcoin.usd;
        const ethereumPrice = data.ethereum.usd;
        const dogecoinPrice = data.dogecoin.usd;

        document.getElementById("bitcoin-price").innerHTML=bitcoinPrice;
        document.getElementById("ethereum-price").innerHTML=ethereumPrice;
        document.getElementById("dogecoin-price").innerHTML=dogecoinPrice;

        console.log(`Bitcoin Price: $${bitcoinPrice}`);
        console.log(`Ethereum Price: $${ethereumPrice}`);
        console.log(`Dogecoin Price: $${dogecoinPrice}`);
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error);
    }
}

// Call the function
getCryptoPrices();
