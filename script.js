requestAnimationFrame(() => {
  document.body.classList.add("loaded");
});

const observedElements = document.querySelectorAll(".observe");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  observedElements.forEach((element) => observer.observe(element));
} else {
  observedElements.forEach((element) => element.classList.add("in-view"));
}

document.querySelectorAll(".skill-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const card = trigger.closest(".skill-card");
    const willOpen = !card.classList.contains("is-open");

    document.querySelectorAll(".skill-card.is-open").forEach((openCard) => {
      openCard.classList.remove("is-open");
      openCard.querySelector(".skill-trigger").setAttribute("aria-expanded", "false");
    });

    card.classList.toggle("is-open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
});

const projectStage = document.querySelector(".project-stage");

if (projectStage) {
  const carousel = projectStage.querySelector(".project-carousel");
  const projectCards = [...projectStage.querySelectorAll(".project-card")];
  const projectCounter = projectStage.querySelector(".current-project");
  let activeProject = 0;
  let dragStart = null;
  let didDrag = false;

  const renderProjects = () => {
    projectCards.forEach((card, index) => {
      const distance = (index - activeProject + projectCards.length) % projectCards.length;
      card.classList.remove("is-active", "is-prev", "is-next");
      card.classList.add(distance === 0 ? "is-active" : distance === 1 ? "is-next" : "is-prev");
      card.setAttribute("aria-hidden", String(distance !== 0));
    });

    projectCounter.textContent = String(activeProject + 1).padStart(2, "0");
  };

  const moveProjects = (direction) => {
    activeProject = (activeProject + direction + projectCards.length) % projectCards.length;
    renderProjects();
  };

  projectStage.querySelector(".carousel-prev").addEventListener("click", () => moveProjects(-1));
  projectStage.querySelector(".carousel-next").addEventListener("click", () => moveProjects(1));

  projectCards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      if (!didDrag && index !== activeProject) {
        activeProject = index;
        renderProjects();
      }
    });
  });

  projectStage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveProjects(-1);
    if (event.key === "ArrowRight") moveProjects(1);
  });

  projectStage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a")) return;
    dragStart = event.clientX;
    didDrag = false;
    projectStage.classList.add("is-dragging");
    projectStage.setPointerCapture(event.pointerId);
  });

  projectStage.addEventListener("pointermove", (event) => {
    if (dragStart === null) return;
    const distance = event.clientX - dragStart;
    didDrag = Math.abs(distance) > 6;
    carousel.style.transform = `rotateY(${distance * 0.018}deg)`;
  });

  const endProjectDrag = (event) => {
    if (dragStart === null) return;
    const distance = event.clientX - dragStart;
    carousel.style.transform = "";
    projectStage.classList.remove("is-dragging");
    dragStart = null;

    if (Math.abs(distance) > 45) moveProjects(distance < 0 ? 1 : -1);
    window.setTimeout(() => { didDrag = false; }, 0);
  };

  projectStage.addEventListener("pointerup", endProjectDrag);
  projectStage.addEventListener("pointercancel", endProjectDrag);
  renderProjects();
}
