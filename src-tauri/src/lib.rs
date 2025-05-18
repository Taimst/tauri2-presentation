// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use include_dir::{include_dir, Dir};
use once_cell::sync::Lazy;
use parking_lot::RwLock;
use serde_json::Value;
use std::collections::HashMap;

/// embed lang files
static LOCALES_DIR: Dir = include_dir!("$CARGO_MANIFEST_DIR/lang");

/// parse JSON files
static TRANSLATIONS: Lazy<HashMap<String, Value>> = Lazy::new(|| {
    let mut m = HashMap::new();
    for file in LOCALES_DIR.files() {
        if file.path().extension().and_then(|e| e.to_str()) == Some("json") {
            let code = file
                .path()
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap()
                .to_string();
            let json: Value =
                serde_json::from_slice(file.contents()).expect("invalid JSON in lang file");
            m.insert(code, json);
        }
    }
    m
});

/// set locale (default german)
static CURRENT_LOCALE: Lazy<RwLock<String>> = Lazy::new(|| RwLock::new("de".to_string()));

/// Switches the active locale if it’s been loaded.
pub fn set_locale(locale: &str) -> Result<(), String> {
    if TRANSLATIONS.contains_key(locale) {
        *CURRENT_LOCALE.write() = locale.to_string();
        Ok(())
    } else {
        Err(t("i18n.locale_not_valid").replace("%locale", locale))
    }
}

/// Grabs a key like `"greeting.hello"` from the current locale’s JSON,
/// falls back to `"de"`, then finally to returning the key itself.
pub fn t(key: &str) -> String {
    // build a JSON‐pointer path: "foo.bar" → "/foo/bar"
    let pointer = key.replace('.', "/");
    // 1) try current
    if let Some(json) = TRANSLATIONS
        .get(&*CURRENT_LOCALE.read())
        .and_then(|v| v.pointer(&format!("/{}", pointer)))
        .and_then(|v| v.as_str())
    {
        return json.to_string();
    }
    // 2) fallback to de
    if let Some(json) = TRANSLATIONS
        .get("de")
        .and_then(|v| v.pointer(&format!("/{}", pointer)))
        .and_then(|v| v.as_str())
    {
        return json.to_string();
    }
    // 3) ultimate fallback
    key.to_string()
}

/// 4. Expose these as Tauri commands:
#[tauri::command]
fn get_translation(key: String) -> String {
    t(&key)
}

#[tauri::command]
fn change_locale(locale: String) -> Result<(), String> {
    set_locale(&locale)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_translation, change_locale])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
