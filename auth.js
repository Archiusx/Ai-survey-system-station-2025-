// Handles authentication for login and logout

import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Login handler for login.html
export function setupLoginForm() {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!email || !password) {
      errorDiv.textContent = "Both fields are required.";
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      errorDiv.textContent = err.message.replace("Firebase: ", "");
    }
  });
}

// Logout handler for dashboard.html
export function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// Check authentication state for protected pages
export function requireAuth(redirect = "login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = redirect;
    }
  });
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}