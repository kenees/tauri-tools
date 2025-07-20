use btleplug::api::{Central, Manager as _, Peripheral, ScanFilter, WriteType, Characteristic};
use btleplug::platform::Manager as BtleplugManager;
use serde::{Serialize, Deserialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{command, window, Emitter, Manager};

#[derive(Serialize, Deserialize, Clone, Debug)] // 添加Debug以便日志输出
pub struct DeviceInfo {
    pub id: String,
    pub name: Option<String>,
    pub rssi: Option<i16>, // 添加RSSI字段
    pub service_count: Option<usize>, // 添加服务数量字段
    pub is_connectable: bool, // 添加可连接性字段
}

#[tauri::command]
pub async fn scan_devices(window: tauri::Window) -> Result<(), String> {
    println!("Starting BLE scan...");
    
    let manager = BtleplugManager::new().await.map_err(|e| e.to_string())?;
    let adapters = manager.adapters().await.map_err(|e| e.to_string())?;

    if adapters.is_empty() {
        println!("No BLE adapters found");
        window.emit("ble_scan_update", Vec::<DeviceInfo>::new()).map_err(|e| e.to_string())?;
        return Err("No adapters found".to_string());
    }

    let central = adapters[0].clone();
    central.start_scan(ScanFilter::default()).await.map_err(|e| e.to_string())?;
    println!("BLE scan started");

    let seen = Arc::new(Mutex::new(Vec::<String>::new()));
    let window_arc = Arc::new(window); // 使用Arc共享window

    for _ in 0..30 {
        let peripherals = central.peripherals().await.map_err(|e| e.to_string())?;
        let mut seen_guard = seen.lock().await;

        for p in peripherals {
            let id = p.id().to_string();
            if !seen_guard.contains(&id) {
                if let Ok(Some(props)) = p.properties().await {
                    let name = props.local_name.clone();
                    let rssi = props.rssi;
                    let service_count = props.services.len();
                    let is_connectable = false; // Field not available, set to default

                    let device = DeviceInfo { 
                        id: id.clone(), 
                        name,
                        rssi,
                        service_count: Some(service_count),
                        is_connectable,
                    };
                    
                    println!("Discovered device: {:?}", device);

                
                    // 克隆Arc以便在异步任务中使用
                    let window_clone = window_arc.clone();
                    
                    // 使用spawn确保emit操作不阻塞主循环
                    tokio::spawn(async move {
                        if let Err(e) = window_clone.emit("ble_scan_update", vec![device]) {
                            eprintln!("Failed to emit device: {}", e);
                        }
                    });
                    
                    seen_guard.push(id);
                }
            }
        }

        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    }

    println!("BLE scan completed");
    Ok(())
}

#[tauri::command]
pub async fn connect_device(id: String, data: Option<Vec<u8>>) -> Result<(), String> {
    println!("Connecting to device: {}", id);
    
    let manager = BtleplugManager::new().await.map_err(|e| e.to_string())?;
    let adapters = manager.adapters().await.map_err(|e| e.to_string())?;
    if adapters.is_empty() {
        return Err("No adapters found".to_string());
    }
    
    let central = adapters[0].clone();
    let peripherals = central.peripherals().await.map_err(|e| e.to_string())?;

    let Some(peripheral) = peripherals.into_iter().find(|p| p.id().to_string() == id) else {
        return Err("Device not found".to_string());
    };

    peripheral.connect().await.map_err(|e| e.to_string())?;
    println!("Connected to device: {}", id);
    
    peripheral.discover_services().await.map_err(|e| e.to_string())?;
    println!("Services discovered");

    // if let Some(data) = data {
    //     println!("Sending data: {:?}", data);
    //     // 实际发送数据需要根据设备特性修改
    //     for service in peripheral.services() {
    //         for characteristic in &service.characteristics {
    //             // 这里只是示例 - 实际应用中需要选择正确的特性
    //             if characteristic.properties.write {
    //                 peripheral.write(&characteristic, &data, WriteType::WithResponse)
    //                     .await
    //                     .map_err(|e| e.to_string())?;
    //                 println!("Data sent successfully");
    //                 break;
    //             }
    //         }
    //     }
    // }

    Ok(())
}