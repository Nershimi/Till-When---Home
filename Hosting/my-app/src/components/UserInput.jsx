import { useState } from "react";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import NaviBar from "./NaviBar.jsx";

export default function UserInput({ userEmail }) {
  const [userInput, setUserInput] = useState({
    productsType: "",
    productName: "",
    company: "",
    expiryDate: "",
  });
  const userMail = userEmail;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState({
    productsType: false,
    productName: false,
    company: false,
    expiryDate: false,
  });

  function checkProductValid() {
    const fields = ["productsType", "productName", "company", "expiryDate"];
    let isValid = true;
    fields.forEach((field) => {
      if (userInput[field].length <= 0) {
        handleChangeInteracted(field);
        isValid = false;
      }
    });
    return isValid;
  }

  async function saveProduct() {
    // console.log("User Input:", userInput); // Debugging
    // console.log("User Email:", userMail); // Debugging
    try {
      if (!checkProductValid()) {
        console.log("Product not valid!");
        alert("Failed to add product. Missing details.\n Please try again.");
        return;
      }

      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/addNewProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productData: userInput,
            userEmail: userMail,
          }),
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
        setHasInteracted({
          productsType: false,
          productName: false,
          company: false,
          expiryDate: false,
        });
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  }

  function handleChange(inputIdentifier, newValue) {
    setUserInput((prevUserInput) => {
      return {
        ...prevUserInput,
        [inputIdentifier]: newValue,
      };
    });
    setHasInteracted((prevHasInteracted) => {
      return {
        ...prevHasInteracted,
        [inputIdentifier]: true,
      };
    });
  }

  function handleChangeInteracted(inputIdentifier) {
    setHasInteracted((prevHasInteracted) => {
      return {
        ...prevHasInteracted,
        [inputIdentifier]: true,
      };
    });
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <NaviBar></NaviBar>
      <section id="user-input">
        <p>
          <label>Product Type</label>
          {hasInteracted.productsType && userInput.productsType <= 0 && (
            <p style={{ color: "red" }}>Missing product type</p>
          )}
          <select
            required
            value={userInput.productsType}
            onChange={(event) => {
              handleChange("productsType", event.target.value);
            }}
          >
            <option value="יבש">יבש</option>
            <option value="קירור">קירור</option>
            <option value="מקפיא">מקפיא</option>
          </select>
        </p>
        <p>
          <label>Product Name</label>
          <Input
            type="text"
            required
            value={userInput.productName}
            placeholder="Product name"
            onChange={(event) => {
              handleChange("productName", event.target.value);
            }}
            error={
              userInput.productName.length <= 0 &&
              hasInteracted.productName &&
              "Missing product name"
            }
          />
        </p>
        <p>
          <label>Product Company</label>
          <Input
            type="text"
            required
            placeholder="Company"
            value={userInput.company}
            onChange={(event) => {
              handleChange("company", event.target.value);
            }}
            error={
              userInput.company.length <= 0 &&
              hasInteracted.company &&
              "Missing product company"
            }
          />
        </p>
        <p>
          <label>Expiry Date</label>
          <Input
            type="date"
            required
            value={userInput.expiryDate}
            onChange={(event) => {
              handleChange("expiryDate", event.target.value);
            }}
            error={
              userInput.expiryDate.length <= 0 &&
              hasInteracted.expiryDate &&
              "Missing product expiry date"
            }
          />
        </p>
        <Button onClick={saveProduct}>Save</Button>
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

// function handleChangeProduct(inputIdentifier, newValue) {
//   setUserInput((prevUserInput) => {
//     return {
//       ...prevUserInput,
//       [inputIdentifier]: newValue,
//     };
//   });
// }
