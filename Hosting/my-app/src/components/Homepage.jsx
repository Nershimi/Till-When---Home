import { useEffect, useState } from "react";
import TableOfProducts from "./TableOfProducts";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [aboutToExpiredProducts, setAboutToExpiredProducts] = useState([]);
  const [selectedExpiredProducts, setSelectedExpiredProducts] = useState([]);
  const [selectedAboutToExpireProducts, setSelectedAboutToExpireProducts] =
    useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getExpiredProducts"
    )
      .then((response) => response.json())
      .then((data) => setExpiredProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

  useEffect(() => {
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getProductsAboutToExpire"
    )
      .then((response) => response.json())
      .then((data) => setAboutToExpiredProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

  const navigateToAddProduct = () => {
    navigate("/add-products");
  };
  const navigateToUserDetails = () => {
    navigate("/my-details");
  };

  const handleDeleteProducts = async (selectedProducts, isExpired) => {
    console.log("Selected Products:", selectedProducts);
    try {
      const productIds = selectedProducts;

      console.log("Product IDs:", productIds);

      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/deleteProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentsId: productIds,
          }),
        }
      );

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        if (isExpired) {
          setExpiredProducts((prev) =>
            prev.filter((product) => !productIds.includes(product.id))
          );
        } else {
          setAboutToExpiredProducts((prev) =>
            prev.filter((product) => !productIds.includes(product.id))
          );
        }
      } else {
        console.error("Failed to delete products:", responseText);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <>
      <div>
        <button onClick={navigateToAddProduct}>Add Product</button>
        <button onClick={navigateToUserDetails}>My details</button>
      </div>
      <TableOfProducts
        title="זרוק אותי"
        data={expiredProducts}
        onSelectedProductsChange={setSelectedExpiredProducts}
      />
      <button
        onClick={() => handleDeleteProducts(selectedExpiredProducts, true)}
      >
        מחק
      </button>
      <TableOfProducts
        title="תציל אותי לפני שאגמר"
        data={aboutToExpiredProducts}
        onSelectedProductsChange={setSelectedAboutToExpireProducts}
      />
      <button
        onClick={() =>
          handleDeleteProducts(selectedAboutToExpireProducts, false)
        }
      >
        מחק
      </button>
    </>
  );
}
