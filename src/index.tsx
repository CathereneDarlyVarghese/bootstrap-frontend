import React from 'react';
import 'normalize.css';

import './index.css';
import { ThemeProvider } from '@ui5/webcomponents-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'jotai';
// import * as PusherPushNotifications from "@pusher/push-notifications-web";
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';

ReactDOM.render(
  <Provider>
    <React.StrictMode>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);

reportWebVitals();
