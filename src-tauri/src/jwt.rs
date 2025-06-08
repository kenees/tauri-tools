use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,    // 主题 （用户ID）
    pub exp: usize,     // 过期时间
    pub iat: usize,     // 签发时间
    #[serde(skip_serializing_if = "Option::is_none")] 
    pub custom: Option<serde_json::Value>, // 自定义数据
} 

#[derive(Debug, Error)]
pub enum JwtError {
    #[error("Token generation failed: {0}")]
    GenerationFailed(String),
    #[error("Token validation failed: {0}")]
    ValidationFailed(String),
}


pub fn generate_jwt(
    secret: &str,
    subject: &str,
    expires_in_hours: i64,
    custom_data: Option<serde_json::Value>,
) -> Result<String, JwtError> {
    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + Duration::hours(expires_in_hours)).timestamp() as usize;

    let claims = Claims {
        sub: subject.to_string(),
        exp,
        iat,
        custom: custom_data,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| JwtError::GenerationFailed(e.to_string()))
}


pub fn validate_jwt(secret: &str, token: &str) -> Result<Claims, JwtError> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    )
    .map(|data| data.claims)
    .map_err(|e| JwtError::ValidationFailed(e.to_string()))
}

#[tauri::command]
pub async fn encode_jwt(
    secret: String,
    subject: String,
    expires_in_hours: i64,
    custom_data: Option<Value>,
) -> Result<String, String> {
    generate_jwt(&secret, &subject, expires_in_hours, custom_data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn decode_jwt(secret: String, token: String) -> Result<Claims, String> {
    validate_jwt(&secret, &token).map_err(|e| e.to_string())
}