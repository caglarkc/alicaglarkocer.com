const revealItems = document.querySelectorAll(".reveal-up");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

const hero = document.querySelector(".project-hero");
const visual = document.querySelector(".hero-visual");

if (hero && visual && matchMedia("(pointer:fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visual.style.transform = `rotateX(${-y * 2.5}deg) rotateY(${x * 3.5}deg)`;
  });
  hero.addEventListener("pointerleave", () => { visual.style.transform = ""; });
}

document.querySelectorAll(".demo-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const product = form.dataset.product || "Proje";
    const subjectText = form.dataset.subject || product + " demo erişim talebi";
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(
      `Ad: ${data.get("name")}\nE-posta: ${data.get("email")}\nŞirket / ekip: ${data.get("company") || "-"}\nİlgi alanı: ${data.get("interest") || "-"}\n\nMesaj:\n${data.get("message") || "Demo erişimi hakkında bilgi almak istiyorum."}`
    );
    window.location.href = `mailto:alicaglarkocer@gmail.com?subject=${subject}&body=${body}`;
  });
});
