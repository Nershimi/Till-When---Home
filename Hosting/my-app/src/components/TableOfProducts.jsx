import { useState, useEffect } from "react";

export default function TableOfProducts({
  title,
  data,
  onSelectedProductsChange,
}) {
  const [selectedProducts, setSelectedProducts] = useState([]);

  function handleSelect(productId) {
    setSelectedProducts((prevProducts) => {
      if (prevProducts.includes(productId)) {
        return prevProducts.filter((id) => id !== productId);
      } else {
        return [...prevProducts, productId];
      }
    });
  }

  useEffect(() => {
    onSelectedProductsChange(selectedProducts);
  }, [selectedProducts, onSelectedProductsChange]);

  return (
    <>
      <h1>{title}</h1>
      <table>
        <thead>
          <th>מספר</th>
          <th>סוג מוצר</th>
          <th>חברה</th>
          <th>שם מוצר</th>
          <th>תאריך תפוגה</th>
          <th>בחר</th>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.productsType}</td>
              <td>{product.productName}</td>
              <td>{product.company}</td>
              <td>
                {new Date(
                  product.expiryDate._seconds * 1000
                ).toLocaleDateString()}
              </td>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleSelect(product.id)}
                  checked={selectedProducts.includes(product.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
