use btleplug::api::{Central, Manager as _, Peripheral, ScanFilter};
use btleplug::platform::Manager;

#[tauri::command]
pub async fn scan_devices() -> Vec<String> {
    let manager = Manager::new().await.unwrap();
    let adapters = manager.adapters().await.unwrap();

    if adapters.is_empty() {
        return vec!["No adapters found".to_string()];
    }

    // let central = adapters.into_iter().nth(0).unwrap();
    // central.start_scan().await.unwrap();
    let central = adapters[0].clone();
    central.start_scan(ScanFilter::default()).await.unwrap();

    // 等待扫描
    tokio::time::sleep(std::time::Duration::from_secs(13)).await;

    let peripherals = central.peripherals().await.unwrap();

    let mut device_names = vec![];

    for p in peripherals {
        if let Ok(Some(props)) = p.properties().await {
            if let Some(name) = props.local_name {
                device_names.push(name);
            }
        }
    }

    device_names
}
