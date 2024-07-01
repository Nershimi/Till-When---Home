import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function NaviBar({}) {
  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/homepage");
  };
  const navigateToAddProduct = () => {
    navigate("/add-products");
  };

  const navigateToUserDetails = () => {
    navigate("/my-details");
  };

  return (
    <div>
      <Button onClick={navigateToHomepage}>Home</Button>
      <Button onClick={navigateToAddProduct}>Add-products</Button>
      <Button onClick={navigateToUserDetails}>My details</Button>
    </div>
  );
}
