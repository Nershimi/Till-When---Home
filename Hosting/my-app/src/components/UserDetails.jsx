import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserToken } from "../../../../backend/getIdToken.js";

export default function UserDetails() {
  const [userToken, setUserToken] = useState();
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await getUserToken();
        setUserToken(token);
      } catch (error) {
        console.error("Error fetching user token: ", error);
      }
    };
    fetchUserToken();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/getUserDetails",
        {
          method: "GET",
          headers: {
            Authorization: userToken,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("User details: ", data);
      setUserDetails(data.userDetails);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/");
  };
  const navigateToAddProduct = () => {
    navigate("/add-products");
  };

  return (
    <div>
      <div>
        <button onClick={navigateToHomepage}>Home</button>
        <button onClick={navigateToAddProduct}>Add-products</button>
      </div>
      <h1>Welcome to your personal details</h1>
      <p>This page is under preparation</p>
      {userDetails.length > 0 &&
        userDetails.map((detail, index) => (
          <div key={index}>
            <input type="text" value={detail.email || ""} readOnly />
            <input type="text" value={detail.fullName || ""} readOnly />
            <input type="text" value={detail.reason || ""} readOnly />
            <input type="date" value={detail.dateOfBirth || ""} readOnly />
          </div>
        ))}
      <button onClick={getUserDetails}>Get Your Details</button>
    </div>
  );
}
