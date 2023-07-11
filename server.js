const express = require('express');
const axios = require('axios');

const cors = require('cors');

// Enable CORS


// ... Rest of your code ...


const app = express();
const PORT = 3001; // Change this to your desired port number
const API_KEY = '5b969a7016f940f9ae4c04a23b515172'; // Replace with your Open Exchange Rates API key

app.use(express.json());
app.use(cors());

// Endpoint to fetch the Forex rates
app.post('/api/forex', async (req, res) => {
  try {
    const { baseCurrency, targetCurrency, amount } = req.body;

    // Make a request to the Open Exchange Rates API to get the rates
    const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=${baseCurrency}&symbols=${targetCurrency}`);
    const rates = response.data.rates;

    // Extract the target currency rate
    const forexRate = rates[targetCurrency];

    // Calculate markup and fee
    const markupRate = forexRate * 0.01;
    const fee = amount * markupRate;

    // Calculate target amount
    const targetAmount = amount * (forexRate + markupRate);

    res.json({ forexRate, markupRate, fee, targetAmount });
  } catch (error) {
    console.error('Error fetching Forex rates:', error);
    res.status(500).json({ error: 'Failed to fetch Forex rates' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to check if the server is running
app.get('/ruok', (req, res) => {
  res.send('Server is running.'); // You can customize the response message if needed
});

// ... Remaining code ...
