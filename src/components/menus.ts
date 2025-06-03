import { MenuItem, PredefinedMenuItem, Submenu } from "@tauri-apps/api/menu";
import { alertBlock } from "./alert";
import { trans } from "./translation";

function getActionElement(id = "btn-action"): HTMLElement | null {
  return document.getElementById(id);
}

export const fileSubmenu = await Submenu.new({
  text: "File",
  items: [
    await MenuItem.new({
      id: "new",
      text: "Neu",
      action: () => {
        console.log("New clicked");
      },
    }),
    await MenuItem.new({
      id: "open",
      text: "Öffnen",
      action: () => {
        console.log("Open clicked");
      },
    }),
    await MenuItem.new({
      id: "save_as",
      text: "Speichern als...",
      action: () => {
        console.log("Save As clicked");
      },
    }),
  ],
});

export const editSubmenu = await Submenu.new({
  text: "Edit",
  items: [
    await MenuItem.new({
      id: "undo",
      text: "Undo",
      action: () => {
        console.log("Undo clicked");
      },
    }),
    await MenuItem.new({
      id: "redo",
      text: "Redo",
      action: () => {
        console.log("Redo clicked");
      },
    }),
  ],
});

export const predefinedMenu = await Submenu.new({
  text: "OS Eigen",
  items: [
    await PredefinedMenuItem.new({
      text: "Ausschneiden",
      item: "Cut",
    }),
    await PredefinedMenuItem.new({
      text: "Einfügen",
      item: "Paste",
    }),
  ],
});

export const quitMenu = await MenuItem.new({
  id: "quit",
  text: "Quit",
  action: async () => {
    console.log("Quit pressed");
    const elem = getActionElement();
    if (elem === null) return;
    if (elem.children.length > 0) {
      elem.innerHTML = "";
    } else {
      elem.innerHTML = alertBlock(
        "warning",
        await trans("menu.info_msg_quit_success"),
      );
    }
  },
});
