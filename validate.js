/* ==========================================================================
   validate.js — custom JS validation for the consultation request form
   Runs on contact.html. Depends on storage.js being loaded first.
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById("consultation-form");
  if (!form) return; // only run on contact.html

  prefillInterest();

  form.addEventListener("submit", handleSubmit);

  // Clear a field's error as soon as the user starts fixing it
  ["fullname", "email", "phone"].forEach((fieldId) => {
    document.getElementById(fieldId).addEventListener("input", () => clearError(fieldId));
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Reset all errors before re-validating
  ["fullname", "email", "phone"].forEach(clearError);

  let isValid = true;

  if (fullname.length === 0) {
    showError("fullname", "Please enter your full name.");
    isValid = false;
  } else if (fullname.length < 2) {
    showError("fullname", "Name must be at least 2 characters.");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    showError("email", "Please enter a valid email address, like name@example.com.");
    isValid = false;
  }

  if (!isValidPhone(phone)) {
    showError("phone", "Please use the format 123-456-7890.");
    isValid = false;
  }

  if (isValid) {
    showSuccessMessage();
    event.target.reset();
    prefillInterest(); // restore the saved interest after the reset clears it
  } else {
    // Move focus to the first invalid field so users can correct it quickly
    const firstError = document.querySelector(".invalid");
    if (firstError) firstError.focus();
  }
}

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function isValidPhone(phone) {
  const pattern = /^\d{3}-\d{3}-\d{4}$/;
  return pattern.test(phone);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "-error");
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");
  if (errorEl) errorEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "-error");
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
  if (errorEl) errorEl.textContent = "";
}

function showSuccessMessage() {
  const successEl = document.getElementById("form-success");
  if (!successEl) return;
  successEl.textContent = "Thanks! Your consultation request has been received.";
  successEl.style.display = "block";
}

/* Reads the interest saved on the Services page (if any) and pre-selects it
   here, so a class the user showed interest in carries over to the form. */
function prefillInterest() {
  const preferred = loadFromStorage(STORAGE_KEYS.INTEREST, "");
  const select = document.getElementById("interest");
  if (preferred && select) {
    select.value = preferred;
  }
}

document.addEventListener("DOMContentLoaded", initContactForm);
