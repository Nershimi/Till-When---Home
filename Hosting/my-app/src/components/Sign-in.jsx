import { useState } from "react";
import { handleSignIn } from "../../../../backend/sign-in.js";
import { useNavigate } from "react-router-dom";
import { handleResetPassword } from "../../../../backend/resetPassword.js";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import "../sign-in.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const navigateToHomepage = () => {
    navigate("/");
  };
  const navigateToSignUp = () => {
    navigate("/sign-up");
  };

  function handleSubmit(e) {
    e.preventDefault();
    handleSignIn(email, password)
      .then(() => {
        navigateToHomepage();
      })
      .catch(() => {
        setError("Username or password are not valid");
        window.scrollTo(0, 0);
      });
  }

  function handleResetPass(e) {
    e.preventDefault();
    handleResetPassword(email);
    console.log("Send reset password");
  }

  return (
    <div className="signin-container">
      <h1>Sign-in</h1>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Input
          className="input-field"
          type="email"
          // label="Email"
          placeholder="Enter your Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          className="input-field"
          type={showPass ? "text" : "password"}
          // label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showVisibilityToggle
          togglePasswordVisibility={() => setShowPass(!showPass)}
        />
        <div className="button-row">
          <Button type="submit" className="button">
            Login
          </Button>
          <Button type="button" className="button" onClick={navigateToSignUp}>
            Sign Up
          </Button>
        </div>
        <Button
          type="button"
          className="button reset-password"
          onClick={handleResetPass}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
