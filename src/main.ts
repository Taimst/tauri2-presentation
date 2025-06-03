import { slidesData } from "./components/slides";

interface ComponentModule {
  init: () => void;
}

const componentModules = import.meta.glob("./slide-components/*.ts");

const slideContainer = document.getElementById(
  "slide-container",
) as HTMLElement;

// Read and parse the `slide` query param:
const params = new URLSearchParams(window.location.search);
let currentSlide = 0;
const paramSlide = params.get("slide");
if (paramSlide) {
  const idx = parseInt(paramSlide, 10);
  if (!isNaN(idx) && idx >= 0 && idx < slidesData.length) {
    currentSlide = idx;
  } else {
    const byId = slidesData.findIndex((s) => s.id === paramSlide);
    if (byId !== -1) currentSlide = byId;
  }
}

function updateUrl(index: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("slide", index.toString());
  window.history.replaceState({}, "", url);
}

// Load and display a slide by index:
async function loadSlide(index: number) {
  const slideData = slidesData[index];
  if (!slideData) return;

  let slideEl = document.getElementById(slideData.id);
  if (!slideEl) {
    slideEl = document.createElement("section");
    slideEl.id = slideData.id;
    slideEl.className = "card bg-base-100 shadow-xl p-10";
    slideContainer.appendChild(slideEl);

    try {
      const resp = await fetch(slideData.url);
      slideEl.innerHTML = await resp.text();

      if (slideData.scripts) {
        for (const scriptUrl of slideData.scripts) {
          const importer = componentModules[scriptUrl];
          if (importer) {
            const mod = (await importer()) as ComponentModule;
            mod.init?.();
          }
        }
      }
    } catch {
      slideEl.innerHTML =
        '<p class="text-red-500">Error loading slide content.</p>';
    }
  }

  // Nur den aktuellen Slide anzeigen, alle anderen verbergen
  document.querySelectorAll("section").forEach((sec) => {
    (sec as HTMLElement).style.display =
      sec.id === slideData.id ? "block" : "none";
  });

  updateUrl(index);
}

function updateActiveNav() {
  const navIds = ["main-nav-normal", "main-nav-small"];

  navIds.forEach((navId) => {
    document
      .querySelectorAll(`#${navId} a`)
      .forEach((el) => el.classList.remove("link-primary"));

    const activeLink = document.querySelector(
      `#${navId} a[data-index="${currentSlide}"]`,
    ) as HTMLElement;
    if (activeLink) {
      activeLink.classList.add("link-primary");
    }
  });
}

// Generate a nav menu that uses `?slide=<index>` links:
function generateNavigation(navId: string) {
  const navEl = document.getElementById(navId);
  if (!navEl) return;
  navEl.innerHTML = "";

  slidesData.forEach((slide, idx) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `?slide=${idx}`; // Fallback-Link
    a.dataset.index = idx.toString(); // Für SPA-Klicks

    // ◀︎ hier prüfen wir zuerst, ob slide.title existiert
    a.textContent = slide.title
      ? slide.title
      : slide.id
          .split(/[-_]/)
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ");

    li.appendChild(a);
    navEl.appendChild(li);
  });

  updateActiveNav();
}

// Hook nav clicks to load slides without full reload:
function setupNavEvents(navId: string) {
  document.getElementById(navId)?.addEventListener("click", (e) => {
    const tgt = e.target as HTMLElement;
    if (tgt.tagName === "A" && tgt.dataset.index != null) {
      e.preventDefault();
      const i = parseInt(tgt.dataset.index, 10);
      if (!isNaN(i)) {
        currentSlide = i;
        loadSlide(i);
        updateActiveNav();
      }
      tgt.blur();
    }
  });
}

// Prev / Next buttons:
document.getElementById("prev")?.addEventListener("click", () => {
  currentSlide = Math.max(0, currentSlide - 1);
  loadSlide(currentSlide);
  updateActiveNav();
});
document.getElementById("next")?.addEventListener("click", () => {
  currentSlide = Math.min(slidesData.length - 1, currentSlide + 1);
  loadSlide(currentSlide);
  updateActiveNav();
});

// Initialize everything:
generateNavigation("main-nav-normal");
generateNavigation("main-nav-small");
setupNavEvents("main-nav-normal");
setupNavEvents("main-nav-small");
loadSlide(currentSlide);
