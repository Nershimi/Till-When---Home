import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./components/Homepage";
import UserInput from "./components/UserInput";
import UserDetails from "./components/UserDetails";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/add-products" element={<UserInput />} />
          <Route path="/my-details" element={<UserDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
