import { useState } from "react";

export default function UserInput() {
  const [userInput, setUserInput] = useState({
    productsType: "fridge",
    productName: "milk",
    company: "Some company",
    expiryDate: new Date(),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  async function saveProduct() {
    try {
      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/addNewProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInput),
        }
      );
      if (response.ok) {
        setModalMessage("Product added successfully");
        setModalVisible(true);
        // Optionally reset the form after successful submission
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
