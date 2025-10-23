use std::sync::Mutex;

use actix_web::{App, HttpServer, web};
use backend::{
    config::{self, CtfConfig}, db, filedata, flow, stats
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Create Postgres connections pool
    let pool = db::init();

    // Init CTF configuration and load existing JSON
    let mut ctf_config = CtfConfig::new();
    ctf_config
        .load("./ctf_config.json")
        .expect("IO error while loading CTF configuration.");

    let static_files = String::from("../frontend/build");

    let server = HttpServer::new(move || {
        let app = App::new()
            .configure(config::init_routes)
            .configure(filedata::init_routes)
            .configure(stats::init_routes)
            .configure(flow::init_routes)
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(Mutex::new(ctf_config.clone())));

        if cfg!(not(debug_assertions)) {
            return app.service(
                actix_files::Files::new("/", static_files.clone())
                    .index_file("index.html")
                    .default_handler(
                        actix_files::NamedFile::open(
                            vec![static_files.clone(), "index.html".to_string()].join("/"),
                        )
                        .expect("index.html not found."),
                    ),
            );
        }

        app
    })
    .bind(("0.0.0.0", 8000))?
    .run();

    println!("Server is running at http://0.0.0.0:8000/");

    server.await
}