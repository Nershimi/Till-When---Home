import { useState } from "react";
import { handleSignUp } from "../../../../backend/sign-up.js";
import { isEmailValid } from "../util/ValidateEmail.js";
import { isPasswordValid, compareFirstAndSecondPw } from "../util/password.js";
import { useNavigate } from "react-router-dom";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import "../sign-in.css";

export default function SignUp() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    dateOfBirth: "",
    fullName: "",
    reason: "",
  });
  const [secondPassword, setSecondPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState();
  const [hasInteractedFullName, setHasInteractedFullName] = useState(false);
  const [hasInteractedDate, setHasInteractedDate] = useState(false);
  const [hasInteractedReason, setHasInteractedReason] = useState(false);
  const navigate = useNavigate();

  const emailValid = isEmailValid(newUser.email);
  const passwordValid = isPasswordValid(newUser.password);
  const isEqualPassword = compareFirstAndSecondPw(
    newUser.password,
    secondPassword
  );

  const notEmptyFiled =
    newUser.dateOfBirth.length > 0 &&
    newUser.fullName.length > 0 &&
    newUser.reason.length > 0;

  async function saveUserDetails() {
    try {
      const response = await fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/saveUserPersonalDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      if (response.ok) {
        console.log(response);
        setNewUser({
          email: "",
          password: "",
          dateOfBirth: "",
          fullName: "",
          reason: "",
        });
      } else {
        throw new Error("Failed to save personal user details");
      }
    } catch (error) {
      console.error("Error save personal user details: ", error);
      alert("Failed to save personal user details");
    }
  }

  const navigateToSignIn = () => {
    navigate("/sign-in");
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid && passwordValid && isEqualPassword && notEmptyFiled) {
      handleSignUp(newUser, setError)
        .then((user) => {
          saveUserDetails();
          navigateToSignIn();
        })
        .catch((error) => {
          console.error("Sign up failed:", error);
        });
    } else {
      setHasInteractedDate(true);
      setHasInteractedReason(true);
    }
  }

  return (
    <div className="signin-wrapper">
      <div className="signin-container">
        <h1>Sign-up</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={newUser.email}
            onChange={(event) =>
              setNewUser((prevUser) => ({
                ...prevUser,
                email: event.target.value,
              }))
            }
            placeholder="Enter your email"
            error={
              !emailValid && newUser.email.length > 0 && "This mail not Valid"
            }
          />
          <Input
            type={showPass ? "text" : "password"}
            value={newUser.password}
            onChange={(event) =>
              setNewUser((prevUser) => ({
                ...prevUser,
                password: event.target.value,
              }))
            }
            placeholder="Enter your password"
            error={
              !passwordValid &&
              newUser.password.length > 0 &&
              "This password not Valid"
            }
            showVisibilityToggle
            togglePasswordVisibility={() => setShowPass(!showPass)}
          />
          <Input
            type={showPass ? "text" : "password"}
            value={secondPassword}
            onChange={(event) => setSecondPassword(event.target.value)}
            placeholder="Re-enter your password"
            error={!isEqualPassword && "Password not match"}
          />
          <Input
            type="text"
            value={newUser.fullName}
            placeholder="Your full name"
            onChange={(event) => {
              setNewUser((prevUser) => ({
                ...prevUser,
                fullName: event.target.value,
              }));
              setHasInteractedFullName(true);
            }}
            error={
              hasInteractedFullName &&
              newUser.fullName.length <= 0 &&
              "Missing name"
            }
          />
          <Input
            type="date"
            value={newUser.dateOfBirth}
            onChange={(event) => {
              setNewUser((prevUser) => ({
                ...prevUser,
                dateOfBirth: event.target.value,
              }));
            }}
            error={hasInteractedDate && "Missing date of birth"}
          />
          {hasInteractedReason && (
            <p style={{ color: "red" }}>Missing reason to sign-up</p>
          )}
          <select
            value={newUser.reason}
            onChange={(event) =>
              setNewUser((prevUser) => ({
                ...prevUser,
                reason: event.target.value,
              }))
            }
          >
            <option value="" disabled selected>
              Select reason to sign-up
            </option>
            <option value=" I tired of throwing away products">
              I tired of throwing away products
            </option>
            <option value=" I want to control which products I have">
              I want to control which products I have
            </option>
            <option value="I forget to throw out expired products">
              I forget to throw out expired products
            </option>
            <option value="I want him to offer me recipes">
              I want him to offer me recipes
            </option>
          </select>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button type="submit">Sign up</Button>
        </form>
      </div>
    </div>
  );
}
