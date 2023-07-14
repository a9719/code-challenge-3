import React, { useEffect, useState } from 'react';
import axios from 'axios';
const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/data')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  

  return (
    <div>
      <h1>Data from SQL</h1>
      <table>
        <thead>
          <tr>
            <th>Base Currency</th>
            <th>Target Currency</th>
            <th>Source Amount</th>
            <th>Target Amount</th>
            <th>Fee</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.baseCurrency}</td>
              <td>{row.targetCurrency}</td>
              <td>{row.sourceAmount}</td>
              <td>{row.targetAmount}</td>
              <td>{row.fee}</td>
              <td>{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
