use actix_web::{get, post, delete, web, App, HttpResponse, HttpServer, Responder};


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
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
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello worlddddd!")
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