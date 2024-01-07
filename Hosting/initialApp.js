// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { firebaseConfig } from "../backened/config.js";

// Initialize Firebase
export const initialApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(initialApp);
