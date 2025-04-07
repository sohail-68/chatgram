import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import Tailwind styles
import App from './App';
import { ThemeProvider } from '../src/context/AuthContext';
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>

     <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
