interface ComponentModule {
  init: () => void;
}

const componentModules = import.meta.glob("./slide-components/*.ts");
const baseDirComponents = "./slide-components";
const baseDirSlides = "./src/slides";

interface SlideData {
  id: string;
  url: string;
  scripts?: string[];
}

const slidesData: SlideData[] = [
  { id: "introduction", url: `${baseDirSlides}/introduction.html` },
  { id: "benefits", url: `${baseDirSlides}/benefits.html` },
  {
    id: "menu",
    url: `${baseDirSlides}/menu.html`,
    scripts: [`${baseDirComponents}/menu.ts`],
  },
  {
    id: "file-dialog",
    url: `${baseDirSlides}/file-dialog.html`,
    scripts: [`${baseDirComponents}/file-dialog.ts`],
  },
  {
    id: "image-save",
    url: `${baseDirSlides}/image-save.html`,
    scripts: [`${baseDirComponents}/canvas-save-demo.ts`],
  },
  {
    id: "i18n",
    url: `${baseDirSlides}/i18n.html`,
    scripts: [`${baseDirComponents}/i18n.ts`],
  },
  { id: "plugins", url: `${baseDirSlides}/plugins.html` },
];

const slideContainer = document.getElementById(
  "slide-container",
) as HTMLElement;

// Read and parse the `slide` query param:
const params = new URLSearchParams(window.location.search);
let currentSlide = 0;
const paramSlide = params.get("slide");
if (paramSlide) {
  // try as index
  const idx = parseInt(paramSlide, 10);
  if (!isNaN(idx) && idx >= 0 && idx < slidesData.length) {
    currentSlide = idx;
  } else {
    // fallback: try matching by slide id
    const byId = slidesData.findIndex((s) => s.id === paramSlide);
    if (byId !== -1) currentSlide = byId;
  }
}

// Update the URL without reloading:
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

  // Show only this slide:
  document.querySelectorAll("section").forEach((sec) => {
    (sec as HTMLElement).style.display =
      sec.id === slideData.id ? "block" : "none";
  });

  updateUrl(index);
}

// Generate a nav menu that uses `?slide=<index>` links:
function generateNavigation(navId: string) {
  const navEl = document.getElementById(navId);
  if (!navEl) return;
  navEl.innerHTML = "";

  slidesData.forEach((slide, idx) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `?slide=${idx}`; // fallback link
    a.dataset.index = idx.toString(); // for SPA clicks
    a.textContent = slide.id
      .split(/[-_]/)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

    if (idx === currentSlide) {
      a.classList.add("link-primary");
    }

    li.appendChild(a);
    navEl.appendChild(li);
  });
}

// Hook nav clicks to load slides without full reload:
function setupNavEvents(navId: string) {
  document.getElementById(navId)?.addEventListener("click", (e) => {
    const tgt = e.target as HTMLElement;
    if (tgt.tagName === "A") {
      e.preventDefault();
      const idx = tgt.dataset.index;
      if (idx != null) {
        const i = parseInt(idx, 10);
        if (!isNaN(i)) {
          currentSlide = i;
          loadSlide(i);

          // Update active class:
          document
            .querySelectorAll(`#${navId} a`)
            .forEach((el) => el.classList.remove("link-primary"));
          (
            document.querySelector(
              `#${navId} a[data-index="${i}"]`,
            ) as HTMLElement
          )?.classList.add("link-primary");
        }
      }
      tgt.blur();
    }
  });
}

// Prev / Next buttons:
document.getElementById("prev")?.addEventListener("click", () => {
  currentSlide = Math.max(0, currentSlide - 1);
  loadSlide(currentSlide);
});
document.getElementById("next")?.addEventListener("click", () => {
  currentSlide = Math.min(slidesData.length - 1, currentSlide + 1);
  loadSlide(currentSlide);
});

// Initialize everything:
generateNavigation("main-nav-normal");
generateNavigation("main-nav-small");
setupNavEvents("main-nav-normal");
setupNavEvents("main-nav-small");
loadSlide(currentSlide);
