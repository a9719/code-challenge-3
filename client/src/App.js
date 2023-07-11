import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    fetchForexRate();
  };

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

  return (
    <div className="container">
      <h1>Forex Calculator</h1>
      <div className="form-group">
        <label>
          Base Currency:
          <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <label>
          Target Currency:
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
          Source Amount:
          <input
            type="number"
            value={sourceAmount}
            onChange={handleSourceAmountChange}
          />
        </label>
      </div>
      <div>
        <button onClick={handleCurrencySwap}>Swap Currencies</button>
      </div>
      <div className="result-group">
        <h2>Fee: {fee}</h2>
        <h2>Target Amount: {targetAmount}</h2>
      </div>
    </div>
  );
}

export default App;


