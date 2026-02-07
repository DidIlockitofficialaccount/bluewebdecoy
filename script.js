// BlueAirplane marketing site JS
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggleBtn = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");

  if (toggleBtn && menu) {
    const setExpanded = (isExpanded) => {
      toggleBtn.setAttribute("aria-expanded", String(isExpanded));
      menu.classList.toggle("is-open", isExpanded);
    };

    toggleBtn.addEventListener("click", () => {
      const expandedNow = toggleBtn.getAttribute("aria-expanded") === "true";
      setExpanded(!expandedNow);
    });

    // Close menu when clicking a link
    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      setExpanded(false);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setExpanded(false);
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      const clickedInside = e.target.closest(".nav");
      if (!clickedInside) setExpanded(false);
    });
  }

  // Smooth scroll for internal anchors
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });

  // Reveal on scroll (SwiftUI-ish fade up)
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Copy-to-clipboard helper (email)
  const toast = document.getElementById("toast");
  let toastTimer = null;

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-showing");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-showing"), 1400);
  };

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;

    const value = btn.getAttribute("data-copy");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied ✨");
    } catch {
      // Fallback if clipboard is blocked
      const tmp = document.createElement("input");
      tmp.value = value;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      tmp.remove();
      showToast("Copied ✨");
    }
  });
})();
