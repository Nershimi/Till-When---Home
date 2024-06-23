import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableOfProducts from "./TableOfProducts.jsx";
import Button from "./Button.jsx";
import Dialog from "./Dialog.jsx";

export default function Homepage({ userEmail }) {
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [aboutToExpiredProducts, setAboutToExpiredProducts] = useState([]);
  const [selectedExpiredProducts, setSelectedExpiredProducts] = useState([]);
  const [selectedAboutToExpireProducts, setSelectedAboutToExpireProducts] =
    useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [isEndGetData, setIsEndGetData] = useState(false);

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
      .catch((error) => console.error("Error fetching products: ", error))
      .then(() => setIsEndGetData(true));
  }, []);

  const navigateToAddProduct = () => {
    navigate("/add-products");
  };
  const navigateToUserDetails = () => {
    navigate("/my-details");
  };

  const handleDeleteProducts = async (selectedProducts, isExpired) => {
    // console.log("Selected Products:", selectedProducts);
    try {
      const productIds = selectedProducts;

      // console.log("Product IDs:", productIds);

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

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {!userEmail && (
        <Dialog onClose={closeDialog}>
          You are not connected please login
        </Dialog>
      )}

      <div>
        <Button onClick={navigateToAddProduct}>Add Product</Button>
        <Button onClick={navigateToUserDetails}>My details</Button>
      </div>
      <TableOfProducts
        title="זרוק אותי"
        data={expiredProducts}
        onSelectedProductsChange={setSelectedExpiredProducts}
      />
      <Button
        onClick={() => handleDeleteProducts(selectedExpiredProducts, true)}
      >
        מחק
      </Button>
      <TableOfProducts
        title="תציל אותי לפני שאגמר"
        data={aboutToExpiredProducts}
        onSelectedProductsChange={setSelectedAboutToExpireProducts}
      />
      <Button
        onClick={() =>
          handleDeleteProducts(selectedAboutToExpireProducts, false)
        }
      >
        מחק
      </Button>
      {/* check how to get this message after it checked */}
      {isEndGetData &&
        expiredProducts.length <= 0 &&
        aboutToExpiredProducts.length <= 0 && (
          <Dialog onClose={closeDialog}>
            This table empty please add product
          </Dialog>
        )}
    </>
  );
}
