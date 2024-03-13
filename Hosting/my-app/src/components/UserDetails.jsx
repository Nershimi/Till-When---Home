import { useNavigate } from "react-router-dom";

export default function UserDetails() {
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
    </div>
  );
}
