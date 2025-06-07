export const baseDirComponents = "./slide-components";
export const baseDirSlides = "./src/slides";

interface SlideData {
  id: string;
  url: string;
  scripts?: string[];
  title?: string;
}

export const slidesData: SlideData[] = [
  {
    id: "introduction",
    url: `${baseDirSlides}/introduction.html`,
    title: "Einführung",
  },
  {
    id: "was-ist-tauri",
    url: `${baseDirSlides}/was-ist-tauri.html`,
    title: "Was ist Tauri",
  },
  {
    id: "wie-funktioniert-tauri",
    url: `${baseDirSlides}/wie-funktioniert-tauri.html`,
    title: "Wie funktioniert Tauri",
  },
  {
    id: "electron-exkurs",
    url: `${baseDirSlides}/electron-exkurs.html`,
  },
  {
    id: "electron-comparison",
    url: `${baseDirSlides}/electron-comparison.html`,
    title: "Vergleich mit Electron",
  },
  { id: "unbundled-webview", url: `${baseDirSlides}/unbundled-webview.html` },
  {
    id: "isolation-pattern",
    url: `${baseDirSlides}/isolation-pattern.html`,
    title: "Isolation Pattern",
  },
  {
    id: "developing",
    url: `${baseDirSlides}/developing.html`,
    title: "Entwicklung",
  },
  {
    id: "menu",
    url: `${baseDirSlides}/menu.html`,
    scripts: [
      `${baseDirComponents}/menu.ts`,
      `${baseDirComponents}/fullscreen.ts`,
    ],
    title: "Menü",
  },
  {
    id: "file-dialog",
    url: `${baseDirSlides}/file-dialog.html`,
    scripts: [`${baseDirComponents}/file-dialog.ts`],
    title: "Datei-Dialog",
  },
  {
    id: "permissions",
    url: `${baseDirSlides}/permissions.html`,
    title: "Berechtigungen",
  },
  {
    id: "image-save",
    url: `${baseDirSlides}/image-save.html`,
    scripts: [`${baseDirComponents}/canvas-save-demo.ts`],
    title: "Bild speichern",
  },
  {
    id: "i18n",
    url: `${baseDirSlides}/i18n.html`,
    scripts: [`${baseDirComponents}/i18n.ts`],
    title: "Internationalisierung",
  },
  { id: "plugins", url: `${baseDirSlides}/plugins.html`, title: "Plugins" },
  { id: "finish", url: `${baseDirSlides}/finish.html`, title: "Abschluss" },
];
