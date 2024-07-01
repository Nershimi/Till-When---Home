import { useEffect, useState } from "react";
import TableOfProducts from "./TableOfProducts";
import NaviBar from "./NaviBar.jsx";

export default function Homepage({ userEmail }) {
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [aboutToExpiredProducts, setAboutToExpiredProducts] = useState([]);
  const [selectedExpiredProducts, setSelectedExpiredProducts] = useState([]);
  const [selectedAboutToExpireProducts, setSelectedAboutToExpireProducts] =
    useState([]);

  useEffect(() => {
    if (!userEmail) return;
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getExpiredProducts",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: userEmail }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          // Handle non-200 responses
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => setExpiredProducts(data))
      .catch((error) =>
        console.error("Error fetching expired products: ", error)
      );
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getProductsAboutToExpire",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: userEmail }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          // Handle non-200 responses
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => setAboutToExpiredProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

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

  if (!userEmail) {
    return <logs>Loading user email...</logs>;
  }

  return (
    <>
      <NaviBar></NaviBar>
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
