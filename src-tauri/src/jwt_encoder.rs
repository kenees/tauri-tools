use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String,
    company: String,
    exp: usize,
}

#[command]
pub fn decode_jwt_token(token: String) -> Result<String, String> {
    let token_data = decode::<Claims>(
        &token,
        &DecodingKey::from_secret("secret".as_bytes()),
        &Validation::default(),
    );

    match token_data {
        Ok(data) => {
            let header_json = serde_json::to_string_pretty(&data.header).unwrap_or_default();
            let claims_json = serde_json::to_string_pretty(&data.claims).unwrap_or_default();
            Ok(format!("标头:\n{}\n\n载荷:\n{}", header_json, claims_json))
        }
        Err(err) => Err(format!("JWT解码失败: {}", err)),
    }
}

#[command]
pub fn encode_jwt_token(header: String, payload: String, secret: String) -> Result<String, String> {
    let header_value: Header = match serde_json::from_str(&header) {
        Ok(h) => h,
        Err(err) => return Err(format!("标头JSON格式错误: {}", err)),
    };

    // 尝试解析为Claims结构体，如果失败则使用通用的Value
    let claims_result: Result<Claims, _> = serde_json::from_str(&payload);
    let claims_value = match claims_result {
        Ok(c) => serde_json::to_value(c).unwrap_or_default(),
        Err(_) => {
            // 如果不是标准Claims格式，使用通用JSON
            match serde_json::from_str::<Value>(&payload) {
                Ok(v) => v,
                Err(err) => return Err(format!("载荷JSON格式错误: {}", err)),
            }
        }
    };

    // 根据头部中的算法选择不同的编码密钥
    let encoding_key = match &header_value.alg {
        &Algorithm::HS256 | &Algorithm::HS384 | &Algorithm::HS512 => {
            // HMAC算法使用纯文本密钥
            EncodingKey::from_secret(secret.as_bytes())
        }
        &Algorithm::RS256 | &Algorithm::RS384 | &Algorithm::RS512 => {
            // 尝试RSA PEM格式，如果失败则尝试其他格式
            match EncodingKey::from_rsa_pem(secret.as_bytes()) {
                Ok(key) => key,
                Err(_) => {
                    // 如果不是PEM格式，尝试作为base64解码
                    match base64::decode(&secret) {
                        Ok(der_bytes) => {
                            let key = EncodingKey::from_rsa_der(&der_bytes);
                            key
                        },
                        Err(_) => return Err("RSA密钥必须是有效的PEM或Base64 DER格式".to_string()),
                    }
                }
            }
        }
        &Algorithm::ES256 | &Algorithm::ES384 => {
            // EC算法处理
            match EncodingKey::from_ec_pem(secret.as_bytes()) {
                Ok(key) => key,
                Err(_) => match base64::decode(&secret) {
                    Ok(der_bytes) => {
                        let key = EncodingKey::from_ec_der(&der_bytes);
                        key
                    },
                    Err(_) => return Err("EC密钥必须是有效的PEM或Base64 DER格式".to_string()),
                },
            }
        }
        &Algorithm::PS256 | &Algorithm::PS384 | &Algorithm::PS512 => {
            // PS算法使用RSA
            match EncodingKey::from_rsa_pem(secret.as_bytes()) {
                Ok(key) => key,
                Err(_) => match base64::decode(&secret) {
                    Ok(der_bytes) => {
                        let key = EncodingKey::from_rsa_der(&der_bytes);
                        key
                    },
                    Err(_) => return Err("RSA-PS密钥必须是有效的PEM或Base64 DER格式".to_string()),
                },
            }
        }
        _ => return Err(format!("不支持的算法: {:?}", header_value.alg)),
    };

    match encode(&header_value, &claims_value, &encoding_key) {
        Ok(token) => Ok(token),
        Err(err) => Err(format!("JWT编码失败: {}", err)),
    }
}

#[command]
pub fn validate_jwt_token(
    token: String,
    secret: String,
    issuer: Option<String>,
    audience: Option<String>,
) -> Result<String, String> {
    let mut validation = Validation::default();

    if let Some(iss) = issuer {
        validation.set_issuer(&[iss]);
    }

    if let Some(aud) = audience {
        validation.set_audience(&[aud]);
    }

    match decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    ) {
        Ok(data) => Ok(format!(
            "JWT验证成功\n标头: {}\n载荷: {}",
            serde_json::to_string(&data.header).unwrap_or_default(),
            serde_json::to_string(&data.claims).unwrap_or_default()
        )),
        Err(err) => Err(format!("JWT验证失败: {}", err)),
    }
}

#[command]
pub fn decode_jwt_token_generic(token: String) -> Result<String, String> {
    let parts: Vec<&str> = token.split('.').collect();
    if parts.len() != 3 {
        return Err("无效的JWT格式".to_string());
    }

    // 解码头部
    let header = match URL_SAFE_NO_PAD.decode(parts[0]) {
        Ok(data) => match String::from_utf8(data) {
            Ok(json) => match serde_json::from_str::<Value>(&json) {
                Ok(value) => serde_json::to_string_pretty(&value).unwrap_or_default(),
                Err(_) => json,
            },
            Err(_) => "头部解码失败".to_string(),
        },
        Err(_) => "头部Base64解码失败".to_string(),
    };

    // 解码载荷
    let payload = match URL_SAFE_NO_PAD.decode(parts[1]) {
        Ok(data) => match String::from_utf8(data) {
            Ok(json) => match serde_json::from_str::<Value>(&json) {
                Ok(value) => serde_json::to_string_pretty(&value).unwrap_or_default(),
                Err(_) => json,
            },
            Err(_) => "载荷解码失败".to_string(),
        },
        Err(_) => "载荷Base64解码失败".to_string(),
    };

    Ok(format!("标头:\n{}\n\n载荷:\n{}", header, payload))
}

#[command]
pub fn create_demo_jwt_token(
    header: String,
    payload: String,
    signature: String,
) -> Result<String, String> {
    use base64::engine::general_purpose::URL_SAFE_NO_PAD;
    use base64::Engine;

    // 解析JSON
    let header_obj: Value = match serde_json::from_str(&header) {
        Ok(v) => v,
        Err(e) => return Err(format!("标头JSON格式错误: {}", e)),
    };

    let payload_obj: Value = match serde_json::from_str(&payload) {
        Ok(v) => v,
        Err(e) => return Err(format!("载荷JSON格式错误: {}", e)),
    };

    // URL安全的Base64编码
    let encoded_header = URL_SAFE_NO_PAD.encode(header_obj.to_string());
    let encoded_payload = URL_SAFE_NO_PAD.encode(payload_obj.to_string());

    // 创建演示签名（在实际应用中应该使用真实的签名算法）
    let signing_input = format!("{}.{}", encoded_header, encoded_payload);
    let demo_signature = URL_SAFE_NO_PAD.encode(format!("{}{}", signature, signing_input));

    Ok(format!(
        "{}.{}.{}",
        encoded_header, encoded_payload, demo_signature
    ))
}

#[command]
pub fn encode_hs256_token(
    header: String,
    payload: String,
    secret: String,
) -> Result<String, String> {
    // 确保算法是HS256
    let mut header_obj: Value = match serde_json::from_str(&header) {
        Ok(v) => v,
        Err(_) => serde_json::json!({"alg": "HS256", "typ": "JWT"}),
    };

    // 强制设置算法为HS256
    header_obj["alg"] = serde_json::Value::String("HS256".to_string());

    let payload_obj: Value = match serde_json::from_str(&payload) {
        Ok(v) => v,
        Err(e) => return Err(format!("载荷JSON格式错误: {}", e)),
    };

    

    // 使用HS256算法编码
    let header_value = Header::new(Algorithm::HS256);
    let encoding_key = EncodingKey::from_secret(secret.as_bytes());

    match encode(&header_value, &payload_obj, &encoding_key) {
        Ok(token) => Ok(token),
        Err(err) => Err(format!("HS256编码失败: {}", err)),
    }
}
