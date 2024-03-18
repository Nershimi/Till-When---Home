import { useState } from "react";
import { handleSignUp } from "../../../../backend/sign-up.js";
import { isEmailValid } from "../util/ValidateEmail.js";
import { isPasswordValid, compareFirstAndSecondPw } from "../util/password.js";
import { useNavigate } from "react-router-dom";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import "../sign-in.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const emailValid = isEmailValid(email);
  const passwordValid = isPasswordValid(firstPassword);
  const isEqualPassword = compareFirstAndSecondPw(
    firstPassword,
    secondPassword
  );

  const navigateToSignIn = () => {
    navigate("/sign-in");
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid && passwordValid && isEqualPassword) {
      handleSignUp(email, firstPassword, setError);
      navigateToSignIn();
    }
  }

  return (
    <div className="signin-container">
      <h1>Sign-up</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          // label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          error={!emailValid && email.length > 0 && "This mail not Valid"}
        />
        <Input
          type={showPass ? "text" : "password"}
          // label="Password"
          value={firstPassword}
          onChange={(event) => setFirstPassword(event.target.value)}
          placeholder="Enter your password"
          error={
            !passwordValid &&
            firstPassword.length > 0 &&
            "This password not Valid"
          }
          showVisibilityToggle
          togglePasswordVisibility={() => setShowPass(!showPass)}
        />
        <Input
          type={showPass ? "text" : "password"}
          // label="Password"
          value={secondPassword}
          onChange={(event) => setSecondPassword(event.target.value)}
          placeholder="Re-enter your password"
          error={!isEqualPassword && "Password not match"}
        />
        <Input
          type="date"
          // label="Date of birth"
          value={dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}
