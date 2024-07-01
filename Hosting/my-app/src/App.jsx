import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./components/Homepage";
import UserInput from "./components/UserInput";
import UserDetails from "./components/UserDetails";
import SignUp from "./components/Sign-up";
import SignIn from "./components/Sign-in";
import { useState, useEffect } from "react";
import { isUserLogin } from "../../../backend/isUserLogin.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../backend/initialApp.js";

const auth = getAuth(app);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return console.log("Loading...");
  }

  return (
    <>
      <Router>
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route
            path="/homepage"
            element={
              loggedIn ? <Homepage userEmail={email} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/add-products"
            element={
              loggedIn ? <UserInput userEmail={email} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/my-details"
            element={loggedIn ? <UserDetails /> : <Navigate to="/" />}
          />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/"
            exact
            element={<SignIn setLoggedIn={setLoggedIn} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;

// const PrivateRoute = ({ element: Component, ...rest }) => {
//   return loggedIn ? <Component {...rest} /> : <Navigate to="/sign-in" />;
// };

// {
//   /* <Route
//             path="/homepage"
//             element={<PrivateRoute element={Homepage} userEmail={email} />}
//           /> */
// }

// {
//   /* <Route
//   path="/add-products"
//   element={<UserInput userEmail={email} />}
// /> */
// }
// {
//   /* <Route path="/my-details" element={<UserDetails />} /> */
// }
