type AlertType = "info" | "success" | "warning" | "error";

export function alertBlock(
  type: AlertType,
  text: string,
  img?: string,
  isSoft: boolean = false,
): string {
  const elem = document.createElement("div");
  elem.role = "alert";
  elem.classList.add("alert");

  if (isSoft) {
    elem.classList.add("alert-soft");
  }

  let defaultSVG;
  switch (type) {
    case "info":
      defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>`;
      elem.classList.add("alert-info");
      break;
    case "error":
      defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`;
      elem.classList.add("alert-error");
      break;
    case "success":
      defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;
      elem.classList.add("alert-success");
      break;
    case "warning":
      defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>`;
      elem.classList.add("alert-warning");
      break;
  }

  // Ensure a valid SVG is used (inline SVG or URL)
  const svgIcon = img && isValidSvg(img) ? img : defaultSVG;

  // Convert the SVG string into an actual DOM element
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(
    svgIcon,
    "image/svg+xml",
  ).documentElement;
  svgDoc.classList.add("alert-icon"); // Add class for styling
  elem.appendChild(svgDoc);

  // Insert text safely inside a <span>
  const textContainer = document.createElement("span");
  textContainer.innerHTML = text; // Allows inline HTML inside the text
  elem.appendChild(textContainer);

  return elem.outerHTML;
}

// Function to check if an image is a valid SVG (either inline or URL)
const isValidSvg = (img: string): boolean => {
  return img.trim().startsWith("<svg") || /\.(svg)$/i.test(img);
};
