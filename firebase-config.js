// Firebase App and required SDKs (imported in HTML via CDN)
// This file exports initialized Firebase services for use in other scripts.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// TODO: Replace this config with your own Firebase credentials!
const firebaseConfig = {
  apiKey: "AIzaSyAguMSHPQwDepygCsEc0csZlDunLMQ6iIg",
  authDomain: "ai-smart-survey.firebaseapp.com",
  projectId: "ai-smart-survey",
  storageBucket: "ai-smart-survey.appspot.com",
  messagingSenderId: "746745525893",
  appId: "1:746745525893:web:ae04db4819a157afcc9bec",
  measurementId: "G-1V5FP4Z0T5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };