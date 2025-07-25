// Firebase Configuration and Integration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbqzF5Yxgy-_O13bNeRogIkLb4MThlBYE",
  authDomain: "hopewell-health-3bf9a.firebaseapp.com",
  projectId: "hopewell-health-3bf9a",
  storageBucket: "hopewell-health-3bf9a.firebasestorage.app",
  messagingSenderId: "500281950350",
  appId: "1:500281950350:web:0a77ec2c5ec06a76bc49df",
  measurementId: "G-RS8YX8146F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export functions for use in other files
export { db, analytics, collection, addDoc, serverTimestamp };
