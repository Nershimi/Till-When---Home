import { useEffect, useState } from "react";

export default function Homepage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getTodayProducts"
    )
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

  return (
    <>
      <h1>Today trash</h1>
      <table>
        <thead>
          <th>מספר</th>
          <th>סוג מוצר</th>
          <th>חברה</th>
          <th>שם מוצר</th>
          <th>תאריך תפוגה</th>
        </thead>
        <tbody>
          {products.map((product, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
