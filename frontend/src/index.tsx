import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify, ResourcesConfig } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import './index.css';
import App from './App';
import awsExports from './aws-exports';
import reportWebVitals from './reportWebVitals';
import { GlobalProvider } from './state/GlobalContext';

Amplify.configure(awsExports as unknown as ResourcesConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </GlobalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
