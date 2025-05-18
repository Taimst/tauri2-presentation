import { invoke } from "@tauri-apps/api/core";

type LocaleType = "de" | "en";

export function isLocale(value: any): value is LocaleType {
  return ["de", "en"].includes(value);
}

export async function switchLocale(locale: LocaleType = "de") {
  await invoke("change_locale", { locale: locale });
}

export async function trans(key: string): Promise<string> {
  return await invoke("get_translation", { key: key });
}
