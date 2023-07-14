import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DataTable from './DataTable';
import  { useRef } from 'react';
import { Provider } from "react-redux";
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

