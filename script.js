const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", function () {
    const isOpen = sidebar.classList.toggle("open");

    overlay.classList.toggle("show", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

overlay.addEventListener("click", closeMenu);

// Highlight navigation links when clicked
navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
        closeMenu();
    });
});

// Highlight the section currently being viewed
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
                const target = link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    target === "#" + entry.target.id
                );
            });
        }
    });
}, {
    rootMargin: "-25% 0px -60% 0px"
});

sections.forEach(function (section) {
    observer.observe(section);
});

// Automatically update the footer year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Contact form demonstration
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    formStatus.textContent =
        "Thank you! Your form was checked, but this demo does not send emails yet.";

    contactForm.reset();
});