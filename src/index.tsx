import React from "react";
import "normalize.css";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@ui5/webcomponents-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "jotai";
// import * as PusherPushNotifications from "@pusher/push-notifications-web";
import ReactDOM from "react-dom";

// Check if service workers are supported by the browser
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker.register("/service-worker.js").then(
//       function (registration) {
//         // Registration was successful

//       },
//       function (err) {
//         // registration failed :(
//       }
//     );
//   });
// }

// const beamsClient = new PusherPushNotifications.Client({
//   instanceId: "ca786f8c-c316-4f3a-9860-c363a0186c50",
// });

// beamsClient
//   .start()
//   .then(() => beamsClient.addDeviceInterest("hello"))

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
  document.getElementById("root")
);

reportWebVitals();
