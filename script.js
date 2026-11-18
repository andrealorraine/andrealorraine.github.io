/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector(".topbar nav"); // style.css opens the menu with "nav.open"

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Highlight active nav link while scrolling ---------- */
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("#navList a");

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(s => observer.observe(s));
}

/* ---------- Contact form validation ---------- */
const form = document.getElementById("contactForm");

if (form) {
  const fields = {
    from: document.getElementById("from"),
    email: document.getElementById("email"),
    message: document.getElementById("message")
  };
  const errors = {
    from: document.getElementById("fromError"),
    email: document.getElementById("emailError"),
    message: document.getElementById("messageError")
  };
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    Object.values(errors).forEach(el => (el.textContent = ""));
    status.textContent = "";

    if (!fields.from.value.trim()) {
      errors.from.textContent = "Please enter your name.";
      valid = false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim());
    if (!emailOk) {
      errors.email.textContent = "Please enter a valid email address.";
      valid = false;
    }

    if (!fields.message.value.trim()) {
      errors.message.textContent = "Please write a message.";
      valid = false;
    }

    Object.keys(fields).forEach(k => fields[k].classList.toggle("invalid", !!errors[k].textContent));

    if (!valid) return;

    // Opens the visitor's email app with the message filled in
    const subject = encodeURIComponent("Portfolio message from " + fields.from.value.trim());
    const body = encodeURIComponent(
      fields.message.value.trim() + "\n\nFrom: " + fields.from.value.trim() +
      " (" + fields.email.value.trim() + ")"
    );
    window.location.href = "mailto:andrealorrainebuen@gmail.com?subject=" + subject + "&body=" + body;

    const name = fields.from.value.trim();
    status.textContent = "Thank you, " + name + "! Your message was sent.";
    form.reset();
  });
}

/* ---------- Projects loaded from projects.json ---------- */
async function loadProjects() {
  const list = document.getElementById("projectList");
  if (!list) return;

  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const projects = await res.json();

    list.innerHTML = projects.map(p => `
      <article class="box project" data-url="${p.liveUrl}">
        <img class="shot" src="${p.image}" alt="${p.alt}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p class="role-line"><strong>My role:</strong> ${p.role}</p>
        <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join("")}</ul>
        <a href="${p.liveUrl}" target="_blank" rel="noopener">View live project</a>
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" rel="noopener">View code on GitHub</a>` : ""}
      </article>
    `).join("");

    // Clicking anywhere on a card opens the live project
    list.addEventListener("click", e => {
      if (e.target.closest("a")) return; // links handle themselves
      const card = e.target.closest(".project");
      if (card) window.open(card.dataset.url, "_blank", "noopener");
    });
  } catch (err) {
    // keep the cards already written in index.html
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
