const glow = document.querySelector(".cursor-glow");

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--glow-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--glow-y", `${event.clientY}px`);
});

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  document.documentElement.style.setProperty("--scroll-progress", `${percent}%`);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".metrics strong").forEach((metric) => {
  const original = metric.textContent.trim();
  const value = Number.parseFloat(original.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(value)) return;

  const suffix = original.replace(/[0-9.]/g, "");
  let started = false;
  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || started) return;
      started = true;
      const startedAt = performance.now();
      const duration = 950;

      function tick(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = value * eased;
        const formatted = Number.isInteger(value) ? Math.round(current) : current.toFixed(1);
        metric.textContent = `${formatted}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      counterObserver.disconnect();
    },
    { threshold: 0.4 }
  );

  counterObserver.observe(metric);
});

if (!window.matchMedia("(pointer: fine)").matches && glow) {
  glow.remove();
}
