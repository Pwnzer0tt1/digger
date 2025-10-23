use std::sync::Mutex;

use actix_web::{delete, get, post, web, Responder, Result};
use serde::Deserialize;

use crate::config::{CtfConfig, NewCtfConfig, NewService, Service};


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read);
    cfg.service(update);
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
    
    if let Err(_e) = ctf_config.save("./ctf_config.json") {
        println!("Error: Can't save JSON to `ctf_config.json`.");
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

    Ok(web::Json(ctf_config.services.to_owned())) 
}

#[derive(Deserialize)]
struct DeleteService {
    name: String
}

#[delete("/api/config/services")]
async fn delete_services(query: web::Query<DeleteService>, ctf_config: web::Data<Mutex<CtfConfig>>) -> Result<impl Responder> {
    let mut ctf_config = ctf_config.lock().unwrap();

    ctf_config.services.remove(&query.name);
    
    Ok(web::Json(ctf_config.services.to_owned())) 
}