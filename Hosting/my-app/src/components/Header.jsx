import logo from "../assets/Logo.webp";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import "../button.css";
import { isUserLogin } from "../../../../backend/isUserLogin.js";
import { signOutUser } from "../../../../backend/sign-out";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    isUserLogin()
      .then((user) => {
        if (user) {
          console.log("User is logged in:", user);
          setLoggedIn(true);
        } else {
          console.log("No user is logged in");
          setLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error checking user state:", error);
      })
      .then(() => {
        // Set up unsubscribe only after the promise is resolved
        unsubscribe && unsubscribe();
      });

    // Return the cleanup function
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const navigateToSignUp = () => {
    navigate("/sign-up");
  };
  const navigateToSignIn = () => {
    navigate("/sign-in");
  };

  function handleSignOut() {
    signOutUser();
    navigateToSignIn();
  }

  return (
    <header id="header">
      <div className="left-content">
        <img src={logo} alt="Logo of website" />
        <h1>Till When</h1>
      </div>
      <div className="right-content">
        {!loggedIn ? (
          <div>
            <Button
              type="button"
              onClick={navigateToSignUp}
              className="button-17"
              role="button"
            >
              Sign up
            </Button>
            <Button
              type="button"
              onClick={navigateToSignIn}
              className="button-17"
              role="button"
            >
              Sign in
            </Button>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              onClick={handleSignOut}
              className="button-17"
              role="button"
            >
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
