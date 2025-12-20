mod ble;
mod jwt;
mod logcat;

use tauri::Manager;
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
        .setup(|app| {
            let splash_window = app.get_webview_window("splashscreen").unwrap();
            let main_window = app.get_webview_window("main").unwrap();

            // 监听应用准备就绪事件
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                // 模拟应用初始化时间
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

                // 关闭启动页面并显示主窗口
                if let Some(splash) = app_handle.get_webview_window("splashscreen") {
                    splash.close().unwrap();
                }
                if let Some(main) = app_handle.get_webview_window("main") {
                    main.show().unwrap();
                }
            });

            Ok(())
        })
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
