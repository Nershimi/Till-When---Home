import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./initialApp.js";

const auth = getAuth(app);

export const handleSignIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(`${user.email} Succeeded to sign-in`); // Corrected typo here
    })
    .catch((error) => {
      throw error;
    });
};
