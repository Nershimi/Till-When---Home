import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./components/Homepage";
import UserInput from "./components/UserInput";
import UserDetails from "./components/UserDetails";
import SignUp from "./components/Sign-up";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/add-products" element={<UserInput />} />
          <Route path="/my-details" element={<UserDetails />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
