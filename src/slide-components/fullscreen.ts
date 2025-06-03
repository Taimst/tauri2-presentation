import { Window } from "@tauri-apps/api/window";

export function init() {
  const fullScreenBtn = document.getElementById("set-fullscreen");
  if (fullScreenBtn) {
    fullScreenBtn.addEventListener("click", async () => {
      try {
        // Aktuelles Fenster holen und DevTools öffnen
        await Window.getCurrent().setFullscreen(
          !(await Window.getCurrent().isFullscreen()),
        );
      } catch (err) {
        console.error("Fehler beim Setzen des Fullscreens:", err);
      }
    });
  }
}
