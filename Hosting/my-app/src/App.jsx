import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./components/Homepage";
import UserInput from "./components/UserInput";
import UserDetails from "./components/UserDetails";
import SignUp from "./components/Sign-up";
import SignIn from "./components/Sign-in";
import { useState, useEffect } from "react";
import { isUserLogin } from "../../../backend/isUserLogin.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const user = await isUserLogin();
        setLoggedIn(!!user); // Update loggedIn state based on user's login status
      } catch (error) {
        console.error("Error checking user login status:", error);
      }
    };

    checkUserLogin();
  }, []);

  return (
    <>
      <Router>
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/add-products" element={<UserInput />} />
          <Route path="/my-details" element={<UserDetails />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/sign-in"
            element={<SignIn setLoggedIn={setLoggedIn} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
