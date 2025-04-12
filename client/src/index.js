import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import Tailwind styles
import App from './App';
import { ChatMessagesProvider } from '../src/context/AuthContext';
ReactDOM.render(
  <React.StrictMode>
    <ChatMessagesProvider>

     <App />
    </ChatMessagesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
