use regex::Regex;
use serde::Serialize;
use std::collections::HashMap;
use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::Window;
use tauri::{command, window, Emitter, Manager};

#[derive(Serialize)]
pub struct DeviceInfo {
    serial: String,
    model: String,
    android_version: String,
    sdk_version: String,
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
pub async fn list_devices() -> Result<Vec<DeviceInfo>, String> {
    let output = Command::new("adb")
        .arg("devices")
        .output()
        .map_err(|e| format!("adb devices fail: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut devices = vec![];

    for line in stdout.lines() {
        if line.ends_with("device") && !line.starts_with("List of devices") {
            let serial = line
                .split_whitespace()
                .next()
                .unwrap_or_default()
                .to_string();
            let model = get_prop(&serial, "ro.product.model").unwrap_or("Unknown".into());
            let android_version =
                get_prop(&serial, "ro.build.version.release").unwrap_or("Unknown".into());
            let sdk_version = get_prop(&serial, "ro.build.version.sdk").unwrap_or("Unknown".into());

            devices.push(DeviceInfo {
                serial,
                model,
                android_version,
                sdk_version,
            });
        }
    }

    Ok(devices)
}

fn get_prop(serial: &str, key: &str) -> Option<String> {
    let output = Command::new("adb")
        .arg("-s")
        .arg(serial)
        .arg("shell")
        .arg("getprop")
        .arg(key)
        .output()
        .ok()?;
    Some(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

#[tauri::command]
pub async fn start_logcat(window: tauri::Window, serial: String) -> Result<(), String> {
    thread::spawn(move || {
        let pid_map = Arc::new(Mutex::new(get_pid_package_map(&serial)));

        let child = Command::new("adb")
            .args(&["-s", &serial, "logcat", "-v", "threadtime"])
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .spawn();

        if let Ok(mut child) = child {
            if let Some(stdout) = child.stdout.take() {
                let reader = BufReader::new(stdout);

                for line in reader.lines() {
                    if let Ok(line) = line {
                        println!("{}", &line);

                        // 用正则提取字段
                        let re = regex::Regex::new(
                            r"(?x)
                                ^(\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3}) # timestamp
                                \s+(\d+)\s+(\d+)                          # pid, tid
                                \s+([VDIWEF])\s+                          # level
                                (\S+):\s+(.*)$                            # tag: message
                            ",
                        )
                        .unwrap();

                        if let Some(caps) = re.captures(&line) {
                            let timestamp = caps.get(1).unwrap().as_str();
                            let pid = caps.get(2).unwrap().as_str().to_string();
                            let tid = caps.get(3).unwrap().as_str();
                            let level = caps.get(4).unwrap().as_str();
                            let tag = caps.get(5).unwrap().as_str();
                            let message = caps.get(6).unwrap().as_str();

                            let pkg = {
                                let map = pid_map.lock().unwrap();
                                map.get(&pid).cloned()
                            };

                            let package_name = if let Some(pkg) = pkg {
                                pkg
                            } else {
                                // 如果没找到，刷新一次 map
                                let new_map = get_pid_package_map(&serial);
                                let mut map = pid_map.lock().unwrap();
                                *map = new_map;
                                map.get(&pid).cloned().unwrap_or_else(|| "".to_string())
                            };

                            // 构建格式化行（注意字段对齐）
                            let formatted = format!(
                                "<span style='color: rgb(183,197,219); margin-right: 10px'>{:<23}</span>  
                                <span style='display: inline-block; width: 80px; color: rgb(183,197,219); margin-right: 10px'>{:>5}-{:>5}</span>  
                                <span style='width: 250px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; color: rgb(0, 183, 247)'; margin-right: 10px>{:<25}</span> 
                                <span style='width: 450px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; color: rgb(0, 183, 247)'; margin-right: 10px>{:<35}</span> 
                                <span style='display: inline-block; background:rgb(183,197,219); width: 20px; text-align: center; color: red'>{:<1}</span>
                                <span style='colro: rgb(0, 107, 108)'>{}</span>",
                                timestamp, pid, tid, tag, package_name, level, message
                            );

                            // 发给前端
                            let _ = window.emit("logcat-line", formatted);
                        }
                    }
                }
            }
        } else {
            let _ = window.emit("logcat-error", "无法启动 adb logcat");
        }
    });

    Ok(())
}

/// 查询设备上的进程列表，返回 PID → 包名 的映射表
fn get_pid_package_map(serial: &str) -> HashMap<String, String> {
    let output = Command::new("adb")
        .args(&["-s", serial, "shell", "ps"])
        .output()
        .expect("Failed to run adb shell ps");

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut map = HashMap::new();

    for line in stdout.lines().skip(1) {
        // Android ps 输出格式为：
        // USER      PID   PPID  VSZ     RSS   WCHAN    ADDR S NAME
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() >= 9 {
            let pid = parts[1].to_string();
            let package = parts[8].to_string(); // 最后字段一般是进程名（包名）
            map.insert(pid, package);
        }
    }

    map
}
