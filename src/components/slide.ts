const componentModules = import.meta.glob("/src/components/*.ts");

const baseDirComponents = "/src/components/";
const baseDirSlides = "/src/slides/";

interface SlideData {
  id: string;
  url: string;
  scripts?: string[]; // Array of script URLs for this slide
}

const slidesData: SlideData[] = [
  { id: "slide-1", url: `${baseDirSlides}slide-1.html` },
  { id: "slide-2", url: `${baseDirSlides}slide-2.html` },
  {
    id: "slide-3",
    url: `${baseDirSlides}slide-3.html`,
    scripts: [`${baseDirComponents}file-dialog.ts`],
  },
  {
    id: "slide-4",
    url: `${baseDirSlides}slide-4.html`,
    scripts: [`${baseDirComponents}canvas-save-demo.ts`],
  },
];

const slideContainer = document.getElementById(
  "slide-container",
) as HTMLElement;
let currentSlide = 0;

// Function to dynamically load and display a slide
async function loadSlide(index: number) {
  const slideData = slidesData[index];
  if (!slideData) return;

  // Check if the slide is already in the DOM.
  let slideElement = document.getElementById(slideData.id);
  if (!slideElement) {
    slideElement = document.createElement("section");
    slideElement.id = slideData.id;
    slideElement.className = "card bg-base-100 shadow-xl p-10";
    slideContainer.appendChild(slideElement);

    try {
      // Fetch external HTML and insert into the slide element
      const response = await fetch(slideData.url);
      slideElement.innerHTML = await response.text();

      // If the slide has associated scripts, load each one
      if (slideData.scripts && Array.isArray(slideData.scripts)) {
        for (const scriptUrl of slideData.scripts) {
          const importer = componentModules[scriptUrl];
          if (importer) {
            try {
              const module = await importer();
              if (module.init) {
                module.init();
              }
            } catch (error) {
              alert(`Error loading script ${scriptUrl}: ${error}`);
            }
          }
        }
      }
    } catch (error) {
      slideElement.innerHTML = `<p class="text-red-500">Error loading slide content.</p>`;
    }
  }

  // Hide all slides and show only the active one
  document.querySelectorAll("section").forEach((slide) => {
    slide.style.display = slide.id === slideData.id ? "block" : "none";
  });
}

// Navigation event listeners
document.getElementById("prev")?.addEventListener("click", () => {
  currentSlide = Math.max(0, currentSlide - 1);
  loadSlide(currentSlide);
});

document.getElementById("next")?.addEventListener("click", () => {
  currentSlide = Math.min(slidesData.length - 1, currentSlide + 1);
  loadSlide(currentSlide);
});

// Handle navigation menu clicks
function setupNavEvents(navId: string) {
  document.getElementById(navId)?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "A") {
      event.preventDefault();
      const targetId = target.getAttribute("href")?.replace("#", "");
      const index = slidesData.findIndex((slide) => slide.id === targetId);
      if (index !== -1) {
        currentSlide = index;
        loadSlide(currentSlide);
      }
      target.blur();
    }
  });
}

// Setup event listeners for both menus
setupNavEvents("main-nav-normal");
setupNavEvents("main-nav-small");

// Load the first slide initially
loadSlide(currentSlide);
