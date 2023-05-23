import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from "../GoogleSignIn/SignInWithGoogle";
import { Auth, Hub } from "aws-amplify";
import "./LoginPage.css";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  async function getUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      return userData;
    } catch {
      console.log("Not signed in");
    }
  }

  // Redirect to Home page if user is signed in
  if (user) {
    navigate("/home");
  }

  // Render SignInWithGoogle component
  return (
    <div className="login-page font-sans bg-gradient-to-r from-blue-800 to-blue-400">
      <h1 className="text-white font-semibold">Welcome to Bootstrap App </h1>
      <p className="text-white">Please login to continue</p>
      <SignInWithGoogle />
    </div>
  );
};

export default LoginPage;
