// Handles dashboard: load user's surveys and their responses
import { db, auth } from './firebase-config.js';
import {
  collection, query, where, getDocs, doc, getDoc, getDocs as getSubDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { setupLogoutButton, requireAuth } from './auth.js';

// Ensure only logged-in users
requireAuth();

setupLogoutButton();

const surveysDiv = document.getElementById('surveys-list');
const responsesDiv = document.getElementById('responses-list');
const loader = document.getElementById('dashboard-loader');

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  // Load all surveys owned by this user
  try {
    loader.style.display = 'block';
    const q = query(collection(db, 'surveys'), where('owner', '==', user.uid));
    const snapshot = await getDocs(q);
    loader.style.display = 'none';
    if (snapshot.empty) {
      surveysDiv.innerHTML = "<em>You have not created any surveys yet.</em>";
      return;
    }
    // List surveys as clickable
    let html = '<ul>';
    snapshot.forEach(docSnap => {
      const survey = docSnap.data();
      html += `<li>
        <a href="#" data-id="${docSnap.id}" class="survey-link">${survey.title}</a>
      </li>`;
    });
    html += '</ul>';
    surveysDiv.innerHTML = html;

    // Listen for clicks to load responses
    document.querySelectorAll('.survey-link').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const surveyId = link.getAttribute('data-id');
        await loadResponses(surveyId);
      });
    });
  } catch (err) {
    surveysDiv.innerHTML = `<span class="error-msg">${err.message}</span>`;
  }
});

async function loadResponses(surveyId) {
  responsesDiv.innerHTML = "Loading responses...";
  try {
    // Get survey document (to show questions)
    const surveySnap = await getDoc(doc(db, 'surveys', surveyId));
    if (!surveySnap.exists()) {
      responsesDiv.innerHTML = "<em>Survey not found.</em>";
      return;
    }
    const survey = surveySnap.data();
    // List all responses
    const respSnap = await getDocs(collection(db, 'surveys', surveyId, 'responses'));
    if (respSnap.empty) {
      responsesDiv.innerHTML = "<em>No responses yet.</em>";
      return;
    }
    // Table of responses
    let html = `<h3>Responses to "${survey.title}"</h3>
      <table class="dashboard-table">
      <thead>
      <tr>
        <th>Name</th><th>Email</th><th>Age</th><th>Gender</th>`;
    survey.questions.forEach((q, i) => {
      html += `<th>Q${i + 1}</th>`;
    });
    html += `</tr></thead><tbody>`;
    respSnap.forEach(respDoc => {
      const r = respDoc.data();
      html += `<tr>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.age}</td>
        <td>${r.gender}</td>`;
      r.answers.forEach(ans => {
        html += `<td>${ans}</td>`;
      });
      html += `</tr>`;
    });
    html += "</tbody></table>";
    responsesDiv.innerHTML = html;
  } catch (err) {
    responsesDiv.innerHTML = `<span class="error-msg">${err.message}</span>`;
  }
}