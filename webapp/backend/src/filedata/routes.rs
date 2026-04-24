use actix_web::{HttpResponse, Responder, Result, get, web};
use diesel::{prelude::*, r2d2::ConnectionManager};

use crate::{models::Filedata, schema::{self}, utils::decode_hex};


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read);
}

#[get("/api/filedata/{hash}")]
async fn read(path: web::Path<String>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let hash = decode_hex(&path.into_inner()).unwrap();
    
    let filedata = web::block(move || {
        let mut conn = pool.get().unwrap();
    
        schema::filedata::table
            .filter(schema::filedata::sha256.eq(hash))
            .select(Filedata::as_select())
            .get_result(&mut conn)
            .optional()
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;
    
    Ok(match filedata {
        Some(filedata) => HttpResponse::Ok().body(filedata.blob),
        None => HttpResponse::NotFound().body("No filedata found.")
    })
}