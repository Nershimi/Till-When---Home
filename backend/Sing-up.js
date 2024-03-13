import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "./initialApp.js"; // Import the initialized Firebase app

const auth = getAuth(app); // Get the auth instance

export const handleSignUp = (email, password, setError) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user); // Handle the signed-in user
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      setError(errorMessage); // Pass the error message to the setError callback
    });
};
