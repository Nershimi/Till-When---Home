import { useState } from "react";
import { handleSignIn } from "../../../../backend/sign-in.js";
import { useNavigate } from "react-router-dom";
import { handleResetPassword } from "../../../../backend/resetPassword.js";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

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
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Input
          type="email"
          label="Email"
          placeholder="Enter your Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type={showPass ? "text" : "password"}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showVisibilityToggle
          togglePasswordVisibility={() => setShowPass(!showPass)}
        />
        <Button type="submit">Login</Button>
        <Button type="button" onClick={handleResetPass}>
          Reset password
        </Button>
        <Button type="button" onClick={navigateToSignUp}>
          Sign up
        </Button>
      </form>
    </div>
  );
}
