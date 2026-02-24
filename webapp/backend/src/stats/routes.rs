use actix_web::{get, web, Responder, Result};
use diesel::{r2d2::ConnectionManager, ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl, SelectableHelper};

use crate::{models::{StatsFlagsOut, StatsFlasgOutFlow, StatsSuricata}, schema, stats::model::StatsData};


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read);
    cfg.service(read_suricata);
}

#[get("/api/stats")]
async fn read(pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let mut conn = pool.get().unwrap();

    let flags_out = schema::alert::table
        .filter(schema::alert::tag.eq("FLAG OUT"))
        .select(StatsFlagsOut::as_select())
        .load(&mut conn)
        .expect("Error reading FLAG OUTs.");
    let flows_num: i64 = schema::flow::table
        .count()
        .get_result(&mut conn)
        .expect("Error while counting flows.");
    let flags_out_flows = schema::flow::table
        .filter(schema::flow::id.eq_any(flags_out.iter().map(|x| x.flow_id).collect::<Vec<i64>>()))
        .select(StatsFlasgOutFlow::as_select())
        .load(&mut conn)
        .expect("Error while reading flags out flows.");

    Ok(web::Json(StatsData {
        flags_out,
        flows_num,
        flags_out_flows
    }))
}

#[get("/api/stats/suricata")]
async fn read_suricata(pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let mut conn = pool.get().unwrap();

    let suricata = schema::stats::table
        .select(StatsSuricata::as_select())
        .load(&mut conn)
        .expect("Error while reading Suricata stats.");

    Ok(web::Json(suricata))
}