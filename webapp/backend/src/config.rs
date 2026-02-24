use std::{collections::HashMap, fs::File, io::{Read, Write}};
use chrono::Duration;
use serde::{Deserialize, Serialize};

mod routes;

pub use routes::init_routes;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewService {
    pub name: String,
    pub ipports: Vec<IpPort>,
    pub color: String
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewCtfConfig {
    pub start_date: String,
    pub end_date: String,
    pub tick_length: u32
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CtfConfig {
    pub start_date: String,
    pub end_date: String,
    pub tick_length: u32,
    pub services: HashMap<String, Service>
}

impl CtfConfig {
    /// Return struct with default values.
    pub fn new() -> Self {
        let now = chrono::Utc::now();
        let eight_hours = now + Duration::hours(8);
        CtfConfig {
            start_date: now.format("%Y-%m-%dT%H:%M").to_string(),
            end_date: eight_hours.format("%Y-%m-%dT%H:%M").to_string(),
            tick_length: 120,
            services: HashMap::new()
        }
    }

    /// Deserialize JSON in given path.
    /// If file doesn't exists, default values are loaded.
    /// If serialization fails a struct with default values is returned.
    pub fn load(&mut self, path: &str) -> std::io::Result<()> {
        *self = match File::open(path) {
            Ok(mut f) => {
                let mut cnt = String::new();
                f.read_to_string(&mut cnt)?;

                match serde_json::from_str(&cnt) {
                    Ok(v) => v,
                    Err(_) => Self::new()
                }
            },
            Err(_) => Self::new()
        };

        Ok(())
    }

    /// Serialize struct to given path.
    pub fn save(&self, path: &str) -> std::io::Result<()> {
        let mut file = File::create(path)?;
        let serialized = serde_json::to_string(self).unwrap();
        file.write_all(serialized.as_bytes())?;

        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Service {
    pub ipports: Vec<IpPort>,
    pub color: String
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IpPort {
    pub ip: String,
    pub port: u16
}

impl IpPort {
    pub fn to_string(&self) -> String {
        self.ip.clone() + ":" + &self.port.to_string()
    }
}