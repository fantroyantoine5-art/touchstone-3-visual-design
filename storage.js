/* ==========================================================================
   storage.js — small localStorage helper shared by feature.js and validate.js
   ========================================================================== */

const STORAGE_KEYS = {
  PLAN: "apexFitnessPlan",       // array of class objects the user has added
  INTEREST: "apexPreferredInterest", // string used to pre-fill the contact form
};

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // localStorage can be unavailable (private browsing, storage full, etc.)
    console.warn("Unable to save to localStorage:", err);
  }
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("Unable to read from localStorage:", err);
    return fallback;
  }
}
