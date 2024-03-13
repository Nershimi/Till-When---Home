import { useState } from "react";
import { handleSignUp } from "../../../../backend/Sing-up.js";
import { isEmailValid } from "../util/ValidateEmail.js";
import { isPasswordValid, compareFirstAndSecondPw } from "../util/password.js";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState();

  const emailValid = isEmailValid(email);
  const passwordValid = isPasswordValid(firstPassword);
  const isEqualPassword = compareFirstAndSecondPw(
    firstPassword,
    secondPassword
  );

  function handleShowPass() {
    if (!showPass) {
      setShowPass(true);
    } else {
      setShowPass(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid && passwordValid && isEqualPassword) {
      handleSignUp(email, firstPassword, setError);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          {!emailValid && email.length > 0 && <p>This mail not Valid</p>}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          {!passwordValid && firstPassword.length > 0 && (
            <p>This password not Valid</p>
          )}
          <input
            type={showPass ? "text" : "password"}
            value={firstPassword}
            onChange={(event) => setFirstPassword(event.target.value)}
          />
          <button type="button" onClick={handleShowPass}>
            Show/Hide
          </button>
        </div>
        <div>
          <label>Re-Password:</label>
          {!isEqualPassword && <p>Password not match</p>}
          <input
            type={showPass ? "text" : "password"}
            value={secondPassword}
            onChange={(event) => setSecondPassword(event.target.value)}
          />
        </div>
        <div>
          <label>Date of birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
