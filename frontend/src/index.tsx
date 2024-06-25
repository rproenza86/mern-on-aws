import React from 'react';
import ReactDOM from 'react-dom/client';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import { Amplify, ResourcesConfig } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import './index.css';
import App from './App';
import awsExports from './aws-exports';
import reportWebVitals from './reportWebVitals';
import { GlobalProvider } from './state/GlobalContext';

Amplify.configure(awsExports as unknown as ResourcesConfig);

// Initialize CloudWatch RUM
try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    identityPoolId: "us-east-1:e725beda-2f34-4c05-946a-ce06be2bcbb6",
    endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
    telemetries: ["errors","performance","http"],
    allowCookies: true,
    enableXRay: true
  };

  const APPLICATION_ID: string = window.location.hostname === 'localhost' ? 
  '78c1a1b1-f0a4-419e-a6b0-84e767902c5d'
  : '1ab0013f-d4d6-4981-b426-b706fcadf293';
  const APPLICATION_VERSION: string = '1.0.0';
  const APPLICATION_REGION: string = 'us-east-1';

  new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}


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
