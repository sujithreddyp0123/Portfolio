const sectionLinks = [...document.querySelectorAll(".nav-links a")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const backToTop = document.querySelector(".back-to-top");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  document.documentElement.style.setProperty("--progress", `${percent}%`);
  backToTop.classList.toggle("visible", window.scrollY > 700);
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => navObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number.parseFloat(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const start = performance.now();
      const duration = 900;

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        let value = target >= 1000 ? Math.round(current).toLocaleString() : current.toFixed(target % 1 ? 1 : 0);
        element.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((element) => counterObserver.observe(element));

document.querySelectorAll("[data-expand]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-project]");
    card.classList.toggle("expanded");
    button.textContent = card.classList.contains("expanded") ? "Collapse" : "Expand";
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
