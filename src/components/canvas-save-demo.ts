import { writeFile } from "@tauri-apps/plugin-fs";
import { alertBlock } from "./alert";
import { save } from "@tauri-apps/plugin-dialog";

export function init() {
  // Setup event listener for saving the canvas image
  const saveImageButton = document.getElementById("saveImageButton");
  if (saveImageButton && !saveImageButton.dataset.listener) {
    saveImageButton.dataset.listener = "true";
    saveImageButton.addEventListener("click", async () => {
      const dataUrl = canvas.toDataURL("image/png");
      const imageData = dataURLtoUint8Array(dataUrl);

      const selectedPath = await save({
        title: "Save your image",
        filters: [{ name: "Image", extensions: ["png", "jpeg", "jpg"] }],
      });

      if (selectedPath) {
        const msg = document.getElementById("message");
        try {
          await writeFile(selectedPath, imageData);
          if (msg)
            msg.innerHTML = alertBlock("success", "Image saved successfully!");
        } catch (error) {
          if (msg)
            msg.innerHTML = alertBlock("error", "Error saving file: " + error);
        }
      }
    });
  }
}

// Setup canvas drawing logic for Slide 4
const canvas = document.getElementById("demoCanvas") as HTMLCanvasElement;
if (canvas) {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ff5722";
    ctx.fillRect(20, 20, 260, 160);
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Here could be your file", 25, 100);
  }
}

/**
 * Helper: Converts a data URL to a Uint8Array (binary format).
 */
function dataURLtoUint8Array(dataUrl: string): Uint8Array {
  const base64Index = dataUrl.indexOf(";base64,") + ";base64,".length;
  const base64 = dataUrl.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
