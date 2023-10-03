import { useEffect, useState } from "react";
import jwt from "jwt-decode";
import { Auth, Hub } from "aws-amplify";

export const SignInWithGoogle1 = () => {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);
  useEffect(() => {
    // Check for an existing Google client initialization
    if (!window.google && !window.google?.accounts) createScript();
  }, []);

  // Load the Google client
  const createScript = () => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGsi;
    document.body.appendChild(script);
  };

  // Initialize Google client and render Google button
  const initGsi = () => {
    if (window.google && window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          getAWSCredentials(response.credential);
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        {
          theme: "outline",
          size: "large",
          type: "standard",
        },
      );
    }
  };
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser().then((currentUser) => setUser(currentUser));

    return unsubscribe;
  }, []);
  // Exchange Google token for temporary AWS credentials
  const getAWSCredentials = async (credential: string) => {
    const token = jwt(credential) as any;
    const user = {
      email: token.email,
      name: token.name,
    };
    await Auth.federatedSignIn(
      "google",
      { token: credential, expires_at: token.exp },
      user,
    );
  };

  return (
    <div className="flex flex-row">
      <button id="googleSignInButton" />
      {user && <button onClick={() => Auth.signOut()}>Sign Out</button>}
    </div>
  );
};
