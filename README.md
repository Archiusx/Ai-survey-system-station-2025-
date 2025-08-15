# Smart Survey Web App

A modern multi-page AI-powered survey app built with HTML, CSS, JavaScript, and Firebase.

## 📁 Project Structure

```
/project-root
  /css/style.css
  /js/firebase-config.js
  /js/auth.js
  /js/survey.js
  /js/dashboard.js
  /html/index.html
  /html/survey.html
  /html/thankyou.html
  /html/login.html
  /html/dashboard.html
```

## 🚀 How to Run Locally

1. **Clone/download the project and arrange files as shown above.**
2. **Firebase Setup:**
   - Go to the [Firebase Console](https://console.firebase.google.com/), create a project.
   - Enable **Authentication** (Email/Password) and **Firestore Database**.
   - Copy your Firebase config object and replace it in `/js/firebase-config.js`.
3. **Open `/html/index.html` in your browser.**
   - All pages work locally via file:// or via a simple http server (like `python -m http.server`).

## 🌎 Deploy to Firebase Hosting

1. Install Firebase CLI:  
   `npm i -g firebase-tools`
2. In project root, run:
   ```
   firebase login
   firebase init hosting
   ```
   - Set `public` to `/html` or `/` as per your structure, set as SPA = `n`.
3. Deploy:  
   `firebase deploy`

## 💡 Notes

- Only authenticated creators can access dashboard and create surveys.
- Each survey generates a unique shareable link.
- All survey responses are stored securely in Firestore.
- Make sure to set Firestore Security Rules to restrict access only to survey owners.

---

**Feel free to customize and expand the app!**