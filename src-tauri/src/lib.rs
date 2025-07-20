mod jwt;
mod logcat;
mod ble;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    println!("hello, {}", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            jwt::encode_jwt,
            jwt::decode_jwt,
            logcat::list_devices,
            logcat::start_logcat,
            ble::scan_devices,
            ble::connect_device,
            // ble::disconnect_device,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
