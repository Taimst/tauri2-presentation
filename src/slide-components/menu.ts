import { Menu } from "@tauri-apps/api/menu";
import {
  editSubmenu,
  fileSubmenu,
  predefinedMenu,
  quitMenu,
} from "../components/menus";

type MenuType = "show" | "change" | "hide";

interface MenuSwitchDetail {
  menu: string;
}

function isMenu(value: any): value is MenuType {
  return ["show", "change", "hide"].includes(value);
}

const EVENT_NAME = "triggerMenuChange";

const baseMenu = await Menu.new({
  items: [quitMenu],
});

const fullMenu = await Menu.new({
  items: [fileSubmenu, editSubmenu, predefinedMenu, quitMenu],
});

const emptyMenu = await Menu.new({
  items: [],
});

/**
 * Handles the switching of the available menus
 */
function switchMenu(event: CustomEvent<MenuSwitchDetail>) {
  const detailMenu = event.detail.menu;

  switch (detailMenu) {
    case "show":
      baseMenu.setAsAppMenu();
      break;
    case "change":
      fullMenu.setAsAppMenu();
      break;
    case "hide":
      emptyMenu.setAsAppMenu();
  }
}

document
  .querySelectorAll<HTMLButtonElement>("[data-menu-button]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const menu = button.dataset.action;
      if (!menu) {
        console.warn("No data-action on button!", button);
        return;
      }
      if (isMenu(menu)) {
        const detail: MenuSwitchDetail = { menu: menu };
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
      } else {
        console.warn("Invalid menu type", menu);
      }
    });
  });

// Listen for the custom event
window.addEventListener(EVENT_NAME, (e) => {
  switchMenu(e as CustomEvent<MenuSwitchDetail>);
});
