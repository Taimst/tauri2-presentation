import { ask, open } from "@tauri-apps/plugin-dialog";
import { alertBlock } from "../components/alert";

export function init() {
  // Setup event listener for the dangerous action button
  const dangerousActionBtn = document.getElementById("dangerousAction");
  if (dangerousActionBtn && !dangerousActionBtn.dataset.listener) {
    dangerousActionBtn.dataset.listener = "true";
    dangerousActionBtn.addEventListener("click", async () => {
      const answer = await ask(
        "This action cannot be reverted. Are you sure?",
        {
          title: "Dangerous!",
          kind: "warning",
        },
      );
      const filePathEl = document.getElementById("filePath");
      if (filePathEl) {
        filePathEl.innerHTML = answer
          ? alertBlock("error", "Error 1337! WHAT HAVE YOU DONE!")
          : alertBlock(
              "info",
              "Bet you don't have what it takes ;-)",
              undefined,
              true,
            );
      }
    });
  }

  // Setup event listener for the Open File button
  const openFileButton = document.getElementById("openFileButton");
  if (openFileButton && !openFileButton.dataset.listener) {
    openFileButton.dataset.listener = "true";
    openFileButton.addEventListener("click", async () => {
      const file = await open({ multiple: false, directory: false });
      const filePathEl = document.getElementById("filePath");
      if (filePathEl) {
        filePathEl.innerHTML = file
          ? alertBlock("success", `Selected file: ${file}`)
          : alertBlock("info", "No file selected.");
      }
    });
  }
}
