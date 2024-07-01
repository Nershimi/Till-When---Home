import { useState, useEffect } from "react";
import { getUserToken } from "../../../../backend/getIdToken.js";
import NaviBar from "./NaviBar.jsx";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

export default function UserDetails() {
  const [userToken, setUserToken] = useState();
  const [userDetails, setUserDetails] = useState({
    email: "",
    fullName: "",
    reason: "",
    dateOfBirth: "",
  });
  const [readMod, setReadMod] = useState(true);

  function checkDetailsValid() {
    const fields = ["fullName", "reason", "dateOfBirth"];
    let isValid = true;
    fields.forEach((field) => {
      if (userDetails[field].length <= 0) {
        isValid = false;
      }
    });
    return isValid;
  }

  async function updateDetails() {
    try {
      if (!checkDetailsValid()) {
        console.log("User details not valid!");
        alert(
          "Failed to update user details. Missing details.\n Please try again."
        );
        return;
      }

      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/updateUserPersonalDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userDetails }),
        }
      );
      if (response.ok) {
        console.log("User details updated successfully");
        setReadMod(true);
      } else {
        throw new Error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update user details. Please try again.");
    }
  }

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

  useEffect(() => {
    if (userToken) {
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
          setUserDetails(
            data.userDetails || {
              email: "",
              fullName: "",
              reason: "",
              dateOfBirth: "",
            }
          );
        } catch (error) {
          console.error("Error fetching user details: ", error);
        }
      };
      getUserDetails();
    }
  }, [userToken]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
    return "";
  };

  function handleChange(inputIdentifier, newValue) {
    setUserDetails((prevUserDetails) => {
      return {
        ...prevUserDetails,
        [inputIdentifier]: newValue,
      };
    });
  }

  function handleEdit() {
    setReadMod(false);
  }

  return (
    <div>
      <NaviBar />
      <h1>Welcome to your personal details</h1>
      <section>
        <p>
          <label>Email:</label>
          <Input
            type="text"
            value={userDetails.email}
            onChange={(event) => handleChange("email", event.target.value)}
            readOnly
          />
        </p>
        <p>
          <label>Full Name:</label>
          <Input
            type="text"
            value={userDetails.fullName}
            onChange={(event) => handleChange("fullName", event.target.value)}
            readOnly={readMod}
          />
        </p>
        <p>
          <label>Reason:</label>
          <Input
            type="text"
            value={userDetails.reason}
            onChange={(event) => handleChange("reason", event.target.value)}
            readOnly={readMod}
          />
        </p>
        <p>
          <label>Date of Birth:</label>
          <Input
            type="date"
            value={formatDate(userDetails.dateOfBirth)}
            onChange={(event) =>
              handleChange("dateOfBirth", event.target.value)
            }
            readOnly={readMod}
          />
        </p>
      </section>
      <Button onClick={handleEdit}>Edit</Button>
      {!readMod && <Button onClick={updateDetails}>Save</Button>}
    </div>
  );
}
