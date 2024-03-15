import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "./initialApp.js";

const auth = getAuth(app);
export const handleResetPassword = (email) => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
};
