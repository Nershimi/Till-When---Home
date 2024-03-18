import { getAuth, signOut } from "firebase/auth";
import app from "./initialApp.js";

const auth = getAuth(app);

export const signOutUser = () => {
  return signOut(auth)
    .then(() => {
      console.log("User sign-out");
    })
    .catch((error) => {
      // An error happened.
    });
};
