/* ==========================================================================
   feature.js — Class Schedule filter + "My Fitness Plan" tracker
   Runs on services.html. Depends on storage.js being loaded first.
   ========================================================================== */

/* Data: the class schedule is managed as an array of objects. */
const classSchedule = [
  { id: 1, name: "Sunrise HIIT", category: "cardio", day: "Mon / Wed / Fri", time: "6:00 AM" },
  { id: 2, name: "Strength Foundations", category: "strength", day: "Tue / Thu", time: "5:30 PM" },
  { id: 3, name: "Power Yoga Flow", category: "recovery", day: "Mon / Wed", time: "7:00 PM" },
  { id: 4, name: "Spin & Sculpt", category: "cardio", day: "Saturday", time: "9:00 AM" },
  { id: 5, name: "Olympic Lifting Lab", category: "strength", day: "Wed / Fri", time: "6:00 PM" },
  { id: 6, name: "Mobility & Recovery", category: "recovery", day: "Sunday", time: "10:00 AM" },
];

/* The user's saved selections, also managed as an array of objects. */
let myPlan = [];

/* Maps a class category to the matching <option> value on the contact
   page's "Primary Area of Interest" select, so a plan selection can
   meaningfully pre-fill the form later. */
const categoryToInterest = {
  cardio: "classes",
  strength: "training",
  recovery: "classes",
};

function initClassFeature() {
  const list = document.getElementById("class-list");
  if (!list) return; // only run this feature on services.html

  myPlan = loadFromStorage(STORAGE_KEYS.PLAN, []);
  setupFilterButtons();
  renderClasses("all");
  renderPlan();
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderClasses(btn.dataset.category);
    });
  });
}

function getActiveCategory() {
  const activeBtn = document.querySelector(".filter-btn.active");
  return activeBtn ? activeBtn.dataset.category : "all";
}

function renderClasses(category) {
  const list = document.getElementById("class-list");
  list.innerHTML = "";

  const filtered =
    category === "all"
      ? classSchedule
      : classSchedule.filter((classItem) => classItem.category === category);

  filtered.forEach((classItem) => list.appendChild(buildClassCard(classItem)));
}

function buildClassCard(classItem) {
  const alreadyAdded = myPlan.some((item) => item.id === classItem.id);

  const card = document.createElement("article");
  card.className = "class-card";
  card.innerHTML = `
    <h3>${classItem.name}</h3>
    <p class="class-meta">${classItem.day} &middot; ${classItem.time}</p>
    <span class="tag tag-${classItem.category}">${classItem.category}</span>
    <button type="button" class="btn plan-btn" ${alreadyAdded ? "disabled" : ""}>
      ${alreadyAdded ? "Added to Plan \u2713" : "Add to My Plan"}
    </button>
  `;

  card.querySelector(".plan-btn").addEventListener("click", () => addToPlan(classItem));
  return card;
}

function addToPlan(classItem) {
  const alreadyAdded = myPlan.some((item) => item.id === classItem.id);
  if (alreadyAdded) return;

  myPlan.push(classItem);
  saveToStorage(STORAGE_KEYS.PLAN, myPlan);

  // Remember the category so the contact form can pre-fill a relevant interest
  saveToStorage(STORAGE_KEYS.INTEREST, categoryToInterest[classItem.category] || "");

  renderPlan();
  renderClasses(getActiveCategory());
}

function removeFromPlan(id) {
  myPlan = myPlan.filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.PLAN, myPlan);
  renderPlan();
  renderClasses(getActiveCategory());
}

function renderPlan() {
  const planList = document.getElementById("plan-list");
  const planCount = document.getElementById("plan-count");
  const emptyMsg = document.getElementById("plan-empty");

  planList.innerHTML = "";
  planCount.textContent = myPlan.length;
  emptyMsg.style.display = myPlan.length === 0 ? "block" : "none";

  myPlan.forEach((item) => {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = `${item.name} \u2014 ${item.day}, ${item.time}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromPlan(item.id));

    li.appendChild(label);
    li.appendChild(removeBtn);
    planList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", initClassFeature);
