import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../../../backend/initialApp.js";

const auth = getAuth(app);

export default function UserInput() {
  const [userInput, setUserInput] = useState({
    productsType: "יבש",
    productName: "פסטה",
    company: "שם החברה",
    expiryDate: new Date(),
  });
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  async function saveProduct() {
    console.log("User Input:", userInput); // Debugging
    console.log("User Email:", email); // Debugging

    try {
      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/addNewProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productData: userInput, userEmail: email }),
        }
      );
      if (response.ok) {
        console.log("Product added successfully");
        setModalMessage("Product added successfully");
        setModalVisible(true);
        setUserInput({
          productsType: "",
          productName: "",
          company: "",
          expiryDate: "",
        });
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  }
  const navigateToHomepage = () => {
    navigate("/");
  };
  const navigateToUserDetails = () => {
    navigate("/my-details");
  };

  function handleChange(inputIdentifier, newValue) {
    setUserInput((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <dir>
        <button onClick={navigateToHomepage}>Home</button>
        <button onClick={navigateToUserDetails}>My details</button>
      </dir>
      <section id="user-input">
        <p>
          <label>Product Type</label>
          {/* <input
            type="text"
            required
            value={userInput.productsType}
            onChange={(event) =>
              handleChange("productsType", event.target.value)
            }
          /> */}
          <select
            required
            value={userInput.productsType}
            onChange={(event) =>
              handleChange("productsType", event.target.value)
            }
          >
            <option value="יבש">יבש</option>
            <option value="קירור">קירור</option>
            <option value="מקפיא">מקפיא</option>
          </select>
        </p>
        <p>
          <label>Product Name</label>
          <input
            type="text"
            required
            value={userInput.productName}
            onChange={(event) =>
              handleChange("productName", event.target.value)
            }
          />
        </p>
        <p>
          <label>Product Company</label>
          <input
            type="text"
            required
            value={userInput.company}
            onChange={(event) => handleChange("company", event.target.value)}
          />
        </p>
        <p>
          <label>Expiry Date</label>
          <input
            type="date"
            required
            value={userInput.expiryDate}
            onChange={(event) => handleChange("expiryDate", event.target.value)}
          />
        </p>
        <button onClick={saveProduct}>Save</button>
      </section>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
