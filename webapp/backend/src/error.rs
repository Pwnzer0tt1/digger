use std::fmt;

use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::Serialize;
use serde_json::json;


#[derive(Debug, Serialize)]
pub struct ApiError {
    pub status_code: u16,
    pub message: String
}

impl ApiError {
    pub fn new(status_code: u16, message: String) -> Self {
        Self {
            status_code,
            message
        }
    }
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(self.message.as_str())
    }
}

impl ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        let status_code = match StatusCode::from_u16(self.status_code) {
            Ok(status_code) => status_code,
            Err(_) => StatusCode::INTERNAL_SERVER_ERROR
        };

        let message = match status_code.as_u16() < 500 {
            true => self.message.clone(),
            false => {
                println!("Error: `{}`", self.message);
                "Internal server error".to_string()
            }
        };

        HttpResponse::build(status_code).json(json!({ "message": message }))
    }
}