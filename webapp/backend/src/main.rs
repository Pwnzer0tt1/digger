use std::sync::{Arc, Mutex};

use actix_web::{get, post, delete, web, App, HttpResponse, HttpServer, Responder};
use backend::config::CtfConfig;
use diesel::{r2d2::{self, ConnectionManager}, PgConnection};


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();

    // Create Postgres connection
    let database_url = std::env::var("DATABASE_URL").unwrap_or(String::from("postgresql://postgres@postgres:5432/postgres"));
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder().build(manager).expect("Failed to create database connection pool.");
    
    // Init CTF configuration and load existing JSON
    let mut ctf_config= CtfConfig::new();
    ctf_config.load("./ctf_config.json").expect("IO error while loading CTF configuration.");

    let static_files = String::from("../frontend/build");

    let server = HttpServer::new(move || {
        let app = App::new()
            .service(get_config)
            .service(set_config)
            .service(set_services)
            .service(del_services)
            .service(get_filedata)
            .service(get_flows)
            .service(get_flow)
            .service(get_flow_pcap)
            .service(get_flow_raw)
            .service(get_stats)
            .service(get_stats_suricata)
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(Arc::new(Mutex::new(ctf_config.clone()))));

        if cfg!(not(debug_assertions)) {
            return app.service(
                actix_files::Files::new("/", static_files.clone())
                    .index_file("index.html")
                    .default_handler(
                        actix_files::NamedFile::open(
                            vec![static_files.clone(), "index.html".to_string()].join("/")
                        )
                        .expect("index.html not found.")
                    )
            );
        }

        app
    })
    .bind(("127.0.0.1", 8080))?
    .run();

    println!("Server is running at http://127.0.0.1:8080/");

    server.await
}

#[get("/api/config")]
async fn get_config() -> impl Responder {
    HttpResponse::Ok().body("GET config")
}

#[post("/api/config")]
async fn set_config() -> impl Responder {
    HttpResponse::Ok().body("POST config")
}

#[post("/api/config/services")]
async fn set_services() -> impl Responder {
    HttpResponse::Ok().body("POST services")
} 

#[delete("/api/config/services")]
async fn del_services() -> impl Responder {
    HttpResponse::Ok().body("DELETE services")
}

#[get("/api/filedata/{hash}")]
async fn get_filedata(filedata: web::Path<(String)>) -> impl Responder {
    HttpResponse::Ok().body("GET filedata")
}

#[get("/api/flow")]
async fn get_flows() -> impl Responder {
    HttpResponse::Ok().body("GET flows")
}

#[get("/api/flow/{id}")]
async fn get_flow(flow: web::Path<(i64)>) -> impl Responder {
    HttpResponse::Ok().body("GET flows")
}

#[get("/api/flow/{id}/pcap")]
async fn get_flow_pcap(flow: web::Path<(i64)>) -> impl Responder {
    HttpResponse::Ok().body("GET flows")
}

#[get("/api/flow/{id}/raw")]
async fn get_flow_raw(flow: web::Path<(i64)>) -> impl Responder {
    HttpResponse::Ok().body("GET flows")
}

#[get("/api/stats")]
async fn get_stats() -> impl Responder {
    HttpResponse::Ok().body("GET stats")
}

#[get("/api/stats/suricata")]
async fn get_stats_suricata() -> impl Responder {
    HttpResponse::Ok().body("GET stats Suricata")
}