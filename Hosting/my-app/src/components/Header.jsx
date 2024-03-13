import logo from "../assets/Logo.webp";
export default function Header() {
  return (
    <header id="header">
      <img src={logo} alt="Logo of website" />
      <h1>Till When</h1>
    </header>
  );
}
