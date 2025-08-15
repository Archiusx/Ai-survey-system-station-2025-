// Handles survey creation, submission, and shareable link
import { db, auth } from './firebase-config.js';
import {
  collection, addDoc, doc, setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const surveyForm = document.getElementById('survey-form');
const errorDiv = document.getElementById('survey-error');
const shareDiv = document.getElementById('share-link');

// Helper: Get query param by name
function getQueryParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

// --- Survey Participant View (survey.html) ---
if (surveyForm) {
  // Client-side validation
  surveyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";

    // Validate fields
    const name = surveyForm.name.value.trim();
    const email = surveyForm.email.value.trim();
    const age = surveyForm.age.value.trim();
    const gender = surveyForm.gender.value;
    if (!name || !email || !age || !gender) {
      errorDiv.textContent = "Please fill in all required fields.";
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorDiv.textContent = "Please enter a valid email address.";
      return;
    }
    if (isNaN(age) || age < 1) {
      errorDiv.textContent = "Please enter a valid age.";
      return;
    }
    // Collect answers
    const answers = [];
    for (let i = 1; i <= 5; i++) {
      const el = surveyForm[`q${i}`];
      if (!el.value.trim()) {
        errorDiv.textContent = "Please answer all questions.";
        return;
      }
      answers.push(el.value.trim());
    }

    try {
      // The surveyId param identifies which survey this response is for
      const surveyId = getQueryParam('survey');
      if (!surveyId) {
        errorDiv.textContent = "Invalid survey link.";
        return;
      }
      // Store response in Firestore: surveys/{surveyId}/responses
      await addDoc(collection(db, 'surveys', surveyId, 'responses'), {
        name, email, age: Number(age), gender, answers, submittedAt: new Date()
      });
      window.location.href = "thankyou.html";
    } catch (err) {
      errorDiv.textContent = err.message.replace("Firebase: ", "");
    }
  });
}

// --- Survey Creator View (dashboard.html) ---
const createSurveyForm = document.getElementById('create-survey-form');
if (createSurveyForm) {
  createSurveyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = createSurveyForm.title.value.trim();
    const q1 = createSurveyForm.q1.value.trim();
    const q2 = createSurveyForm.q2.value.trim();
    const q3 = createSurveyForm.q3.value.trim();
    const q4 = createSurveyForm.q4.value.trim();
    const q5 = createSurveyForm.q5.value.trim();

    if (!title || !q1 || !q2 || !q3 || !q4 || !q5) {
      document.getElementById('create-survey-error').textContent = "All fields required.";
      return;
    }
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        // Create a new survey under 'surveys' collection
        const surveyRef = doc(collection(db, 'surveys'));
        await setDoc(surveyRef, {
          owner: user.uid,
          title,
          questions: [q1, q2, q3, q4, q5],
          createdAt: new Date()
        });
        // Show the shareable link
        const link = `${window.location.origin}/html/survey.html?survey=${surveyRef.id}`;
        document.getElementById('created-link').innerHTML =
          `<strong>Survey created! Share this link:</strong><br>
          <a href="${link}" target="_blank">${link}</a>`;
      } catch (err) {
        document.getElementById('create-survey-error').textContent = err.message;
      }
    });
  });
}