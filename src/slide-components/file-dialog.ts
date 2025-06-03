import { ask, open } from "@tauri-apps/plugin-dialog";
import { alertBlock } from "../components/alert";

export function init() {
  // Setup event listener for the dangerous action button
  const dangerousActionBtn = document.getElementById("dangerousAction");
  if (dangerousActionBtn && !dangerousActionBtn.dataset.listener) {
    dangerousActionBtn.dataset.listener = "true";
    dangerousActionBtn.addEventListener("click", async () => {
      const answer = await ask(
        "Diese Aktion kann nicht rückgängig gemacht werden. Bist Du Dir sicher?",
        {
          title: "Gefährlich!",
          kind: "warning",
        },
      );
      const filePathEl = document.getElementById("filePath");
      if (filePathEl) {
        filePathEl.innerHTML = answer
          ? alertBlock("error", "WAS HAST DU GETAN!!")
          : alertBlock("info", "Nochmal gut gegangen...", undefined, true);
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
          ? alertBlock("success", `Ausgewählte Datei: ${file}`)
          : alertBlock("info", "Keine Datei ausgewählt.");
      }
    });
  }
}
