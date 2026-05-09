use std::sync::Mutex;
use actix_web::{delete, get, post, web, Responder, Result};
use std::{collections::HashMap, fs::File, io::{Read, Write}};
use chrono::Duration;
use serde::{Deserialize, Serialize};


const CONFIG_PATH: &str = "./config/ctf_config.json";

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
    pub fn load(&mut self) -> std::io::Result<()> {
        *self = match File::open(CONFIG_PATH) {
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
    pub fn save(&self) -> std::io::Result<()> {
        let mut file = File::create(CONFIG_PATH)?;
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


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read);
    cfg.service(update);
    cfg.service(read_services);
    cfg.service(update_services);
    cfg.service(delete_services);
}

#[get("/api/config")]
async fn read(ctf_config: web::Data<Mutex<CtfConfig>>) -> Result<impl Responder> {
    let ctf_config = ctf_config.lock().unwrap();

    Ok(web::Json(ctf_config.to_owned()))
}

#[post("/api/config")]
async fn update(new_ctf_config: web::Json<NewCtfConfig>, ctf_config: web::Data<Mutex<CtfConfig>>) -> Result<impl Responder> {
    let mut ctf_config = ctf_config.lock().unwrap();
    ctf_config.start_date = new_ctf_config.start_date.clone();
    ctf_config.end_date = new_ctf_config.end_date.clone();
    ctf_config.tick_length = new_ctf_config.tick_length;
    
    if let Err(_e) = ctf_config.save() {
        println!("Error: Can't save JSON to `./config/ctf_config.json`.");
    }

    Ok(web::Json(ctf_config.to_owned()))
}

#[get("/api/config/services")]
async fn read_services(ctf_config: web::Data<Mutex<CtfConfig>>) -> Result<impl Responder> {
    let ctf_config = ctf_config.lock().unwrap();

    Ok(web::Json(ctf_config.services.to_owned())) 
}

#[post("/api/config/services")]
async fn update_services(new_service: web::Json<NewService>, ctf_config: web::Data<Mutex<CtfConfig>>) -> Result<impl Responder> {
    let mut ctf_config = ctf_config.lock().unwrap();
    ctf_config.services.insert(new_service.name.clone(), Service {
        ipports: new_service.ipports.clone(),
        color: new_service.color.clone()
    });

    if let Err(_e) = ctf_config.save() {
        println!("Error: Can't save JSON to `./config/ctf_config.json`.");
    }

    Ok(web::Json(ctf_config.to_owned())) 
}

#[derive(Deserialize)]
struct DeleteService {
    name: String
}

#[delete("/api/config/services")]
async fn delete_services(query: web::Query<DeleteService>, ctf_config: web::Data<Mutex<CtfConfig>>) -> Result<impl Responder> {
    let mut ctf_config = ctf_config.lock().unwrap();
    ctf_config.services.remove(&query.name);

    if let Err(_e) = ctf_config.save() {
        println!("Error: Can't save JSON to `./config/ctf_config.json`.");
    }
    
    Ok(web::Json(ctf_config.services.to_owned())) 
}