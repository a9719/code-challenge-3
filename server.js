const express = require('express');
const axios = require('axios');
const mysql = require('mysql');


const cors = require('cors');

// Enable CORS


// ... Rest of your code ...


const app = express();
const PORT = 3001; // Change this to your desired port number
const API_KEY = '5b969a7016f940f9ae4c04a23b515172'; // Replace with your Open Exchange Rates API key

app.use(express.json());
app.use(cors());

function createTable() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS conversions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baseCurrency VARCHAR(3),
    targetCurrency VARCHAR(3),
    sourceAmount DECIMAL(10, 2),
    targetAmount DECIMAL(10, 2),
    fee DECIMAL(10, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table: ', err);
      // Handle the error
    } else {
      console.log('Table created successfully.');
      // Proceed with other operations
      // ...
    }
  });
}


// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'new_password',
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

db.query('CREATE DATABASE IF NOT EXISTS forex', (error) => {
  if (error) {
    console.error('Error creating database:', error);
    return;
  }
  console.log('Database created!');
});

db.query('USE forex', (error) => {
  if (error) {
    console.error('Error selecting database: ', error);
    return;
  }});






// API endpoint to save the conversion data
app.post('/api/save-conversion', (req, res) => {
  const { baseCurrency,targetCurrency,sourceAmount, targetAmount, fee, createdAt } = req.body;

  db.query("SHOW TABLES LIKE 'conversions'", (err, results) => {
    if (err) {
      console.error('Error checking table existence: ', err);
      // Handle the error
    } else {
      if (results.length === 0) {
        // Table does not exist, create it
        createTable();
      } else {
        // Table already exists, proceed with other operations
        // ...
      }
    }
  });
  

  // Insert the conversion data into the database
  const sql = `INSERT INTO conversions (baseCurrency,targetCurrency,sourceAmount, targetAmount, fee, createdAt) VALUES (?, ?, ?, ?,?,?)`;
  const currentTime = new Date();
  db.query(sql, [baseCurrency,targetCurrency,sourceAmount, targetAmount, fee, currentTime], (err, result) => {
    if (err) {
      console.error('Error saving conversion data:', err);
      res.status(500).json({ error: 'Failed to save conversion data' });
      return;
    }
    res.status(200).json({ message: 'Conversion data saved successfully' });
  });
});


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

app.get('/api/data', (req, res) => {
  // Retrieve data from the table
  db.query('SELECT * FROM forex.conversions', (queryErr, results) => {
    console.log(results);
    if (queryErr) {
      console.error('Error executing query: ', queryErr);
      res.status(500).send('An error occurred while fetching data.');
      return;
    }

    // Send the data as JSON response
    res.json(results);
  });
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
