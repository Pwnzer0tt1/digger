use actix_web::{get, web, Responder, Result};
use diesel::{prelude::*, r2d2::ConnectionManager};

use crate::{models::Filedata, schema::{self}, utils::decode_hex};


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read);
}

#[get("/api/filedata/{hash}")]
async fn read(path: web::Path<String>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let mut conn = pool.get().unwrap();
    let hash = decode_hex(&path.into_inner()).unwrap();


    let res = schema::filedata::table
        .filter(schema::filedata::sha256.eq(hash))
        .select(Filedata::as_select())
        .get_result(&mut conn)
        .expect("Error selecting filedata.");

    Ok(res.blob)
}