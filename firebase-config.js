// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7lF5GST9b6UHzj7NC8uO8SET8TwSUt-Y",
  authDomain: "apex-global-logistics-company.firebaseapp.com",
  databaseURL: "https://apex-global-logistics-company-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "apex-global-logistics-company",
  storageBucket: "apex-global-logistics-company.firebasestorage.app",
  messagingSenderId: "1090302812907",
  appId: "1:1090302812907:web:e31667aee6e9a76a63d4ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };