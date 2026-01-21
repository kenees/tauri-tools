use tauri::command;

#[command]
pub fn encode_base64_text(text: String) -> Result<String, String> {
    Ok(base64::encode(text))
}

#[command]
pub fn decode_base64_text(encoded: String) -> Result<String, String> {
    match base64::decode(encoded) {
        Ok(decoded_bytes) => {
            match String::from_utf8(decoded_bytes) {
                Ok(decoded_text) => Ok(decoded_text),
                Err(_) => Err("解码失败：无效的UTF-8序列".to_string()),
            }
        }
        Err(_) => Err("解码失败：无效的Base64格式".to_string()),
    }
}

#[command]
pub fn validate_base64_image(data: String) -> Result<bool, String> {
    // 检查是否是有效的data URL格式
    if !data.starts_with("data:image/") {
        return Ok(false);
    }

    // 提取Base64部分
    if let Some(base64_part) = data.split(',').nth(1) {
        match base64::decode(base64_part) {
            Ok(_) => Ok(true),
            Err(_) => Ok(false),
        }
    } else {
        Ok(false)
    }
}

#[command]
pub fn get_image_info(base64_data: String) -> Result<String, String> {
    if !base64_data.starts_with("data:image/") {
        return Err("无效的图片数据格式".to_string());
    }

    // 提取MIME类型
    let mime_type = base64_data
        .split(',')
        .next()
        .unwrap_or("")
        .replace("data:", "")
        .replace(";base64", "");

    // 提取Base64数据
    if let Some(base64_part) = base64_data.split(',').nth(1) {
        match base64::decode(base64_part) {
            Ok(data) => {
                let size = data.len();
                let size_kb = size as f64 / 1024.0;
                let size_mb = size_kb / 1024.0;
                
                let size_str = if size_mb >= 1.0 {
                    format!("{:.2} MB", size_mb)
                } else {
                    format!("{:.2} KB", size_kb)
                };

                Ok(format!("类型: {}, 大小: {}", mime_type, size_str))
            }
            Err(_) => Err("无法解码图片数据".to_string()),
        }
    } else {
        Err("无效的Base64数据格式".to_string())
    }
}