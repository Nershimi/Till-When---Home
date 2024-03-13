// Correct imports for Firebase v9+ (modular SDK)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./config.js"; // Your Firebase configuration

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // If you're using Firebase Analytics

export default app;
