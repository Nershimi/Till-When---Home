import { isUserLogin } from "./isUserLogin.js";

export const getUserToken = async () => {
  try {
    const user = await isUserLogin();
    if (user) {
      const userToken = await user.getIdToken();
      return userToken;
    } else {
      throw new Error("User not logged in");
    }
  } catch (error) {
    throw new Error("Error getting user token: " + error.massage);
  }
};
