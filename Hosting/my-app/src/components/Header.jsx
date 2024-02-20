import logo from "../assets/Products-To-Trash.png";
export default function Header() {
  return (
    <header id="header">
      <img src={logo} alt="Logo of website" />
      <h1>Products to trash</h1>
    </header>
  );
}
