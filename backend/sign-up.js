import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import app from "./initialApp.js"; // Import the initialized Firebase app

const auth = getAuth(app); // Get the auth instance
auth.useDeviceLanguage();

export const handleSignUp = (user, setError) => {
  return createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("User created:", user); // Handle the signed-in user

      return sendEmailVerification(auth.currentUser).then(() => {
        console.log("Email verification sent");
        return user;
      });
    })
    .catch((error) => {
      var errorMessage = error.message;
      setError(errorMessage);
      throw error;
    });
};
