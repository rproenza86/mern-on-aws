import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { API_ENDPOINT } from './config';

function App() {
  useEffect(() => {
    fetch(`${API_ENDPOINT}/helloWorld`).then(res => {
      console.log(res);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to AWS.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
