import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import swapIcon from './assets/converter-swap-icon.png';
import converterIcon from './assets/converter-icon.png'







function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [sourceAmount, setSourceAmount] = useState(1);
  const [forexRate, setForexRate] = useState(null);
  const [markupRate, setMarkupRate] = useState(null);
  const [fee, setFee] = useState(null);
  const [targetAmount, setTargetAmount] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    fetchCurrencyOptions();
    fetchForexRate();
  }, [baseCurrency, targetCurrency]);

  const fetchCurrencyOptions = async () => {
    try {
      const response = await axios.get('https://openexchangerates.org/api/currencies.json');
      const currencies = response.data;
      setCurrencyOptions(Object.keys(currencies));
    } catch (error) {
      console.error('Error fetching currency options:', error);
    }
  };

  const fetchForexRate = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/forex', {
        baseCurrency,
        targetCurrency,
        amount: sourceAmount,
      });

      setForexRate(response.data.forexRate);
      setMarkupRate(response.data.markupRate);
      setFee(response.data.fee);
      setTargetAmount(response.data.targetAmount);
    } catch (error) {
      console.error('Error fetching Forex rates:', error);
    }
  };

  const handleSourceAmountChange = (event) => {
    const amount = parseFloat(event.target.value);
    setSourceAmount(amount);
  };
  
  useEffect(() => {
    fetchForexRate();
  }, [baseCurrency, targetCurrency, sourceAmount]);
  
  

  const handleCurrencySwap = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
    fetchForexRate();
  };

  const handleBaseCurrencyChange = (event) => {
    const currency = event.target.value;
    setBaseCurrency(currency);
    fetchForexRate();
  };

  const handleTargetCurrencyChange = (event) => {
    const currency = event.target.value;
    setTargetCurrency(currency);
    fetchForexRate();
  };

  const handleSubmit = async () => {
    try {
      // Prepare the conversion data to be sent to the backend
      const conversionData = {
        baseCurrency,
        targetCurrency,
        sourceAmount,
        targetAmount,
        fee,
      };

      // Send a POST request to the backend endpoint
      await axios.post('http://localhost:3001/api/save-conversion', conversionData);

      // Show a success message or perform any other desired action
      console.log('Conversion data saved successfully!');
    } catch (error) {
      console.error('Error saving conversion data:', error);
    }
  };


return (

  

<div className="container">
  
     <h1> <img className="icon" src={converterIcon} alt="Swap" /> Currency Transfer</h1>
      <div className="form-group">
        <label>
          From:
          <input
            type="number"
            value={sourceAmount}
            onChange={handleSourceAmountChange}
          />
          <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
       
       <div>
       <img className="icon" src={swapIcon} alt="Swap" onClick={handleCurrencySwap}/>
      </div>
      
        <label>
          To:
          {targetAmount}
          <select value={targetCurrency} onChange={handleTargetCurrencyChange}>
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          
        </label>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div className="result-group">
        <h2>Market Rate: {forexRate}</h2>
       
      </div>

      
      <div className="result-group">
        <h2>Fee: {fee}</h2>
      </div>

    </div>
  );
}
export default App;


