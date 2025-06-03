import { alertBlock } from "../components/alert";
import { isLocale, switchLocale, trans } from "../components/translation";

const EVENT_NAME = "triggerLocaleSwitch";

interface LocaleSwitchDetail {
  locale: string;
}

/**
 * Update the "#locale" element with a test translation.
 */
async function updateTestLocale(): Promise<void> {
  const localeEl = document.getElementById("locale");
  if (!localeEl) return;
  localeEl.innerHTML = alertBlock("info", await trans("test"));
}

/**
 * Handles both custom-event and URL-param locale switches.
 */
async function handleLocaleSwitch(
  event: CustomEvent<LocaleSwitchDetail>,
): Promise<void> {
  const detailLocale = event.detail.locale;
  const urlLocale =
    new URLSearchParams(window.location.search).get("locale") ?? "de";
  const finalLocale = detailLocale || urlLocale;

  if (isLocale(finalLocale)) {
    await switchLocale(finalLocale);
    window.location.reload();
  } else {
    alert(
      (await trans("i18n.locale_not_valid")).replace("%locale%", finalLocale),
    );
  }
}

void updateTestLocale();

document
  .querySelectorAll<HTMLButtonElement>("[data-button-locale]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const locale = button.dataset.locale;
      if (!locale) {
        console.warn("Kein 'data-locale' am Button gefunden!", button);
        return;
      }
      const detail: LocaleSwitchDetail = { locale };
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
    });
  });

// Listen for the custom event
window.addEventListener(EVENT_NAME, (e) => {
  handleLocaleSwitch(e as CustomEvent<LocaleSwitchDetail>);
});
