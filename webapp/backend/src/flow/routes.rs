use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse, Responder, ResponseError, Result};
use diesel::{prelude::*, r2d2::ConnectionManager, sql_query, sql_types::Text};
use std::{fs, sync::Mutex};
use crate::{config::CtfConfig, error::ApiError, flow::model::{FlowData, FlowWithAlerts, FlowsFilters, FlowsList, FlowsQuery}, models::{Alert, Event, Flow, FlowTag, RawFlowID, ReadFlowRaw, Tag}, schema};


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read_flows);
    cfg.service(read_flow);
    cfg.service(read_flow_pcap);
    cfg.service(read_flow_raw);
}

#[get("/api/flow")]
async fn read_flows(query: web::Query<FlowsQuery>, ctf_config: web::Data<Mutex<CtfConfig>>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> impl Responder {
    let ctf_config = ctf_config.lock().unwrap();
    let mut conn = pool.get().unwrap();
    
    let filters: FlowsFilters = match serde_json::from_str(&query.filters) {
        Ok(v) => v,
        Err(_) => {
            return ApiError::new(404, "Malformed filters.".to_string()).error_response();
        }
    };
    println!("{:#?}", filters);

    let ts_to: i64 = filters.ts_to.parse().unwrap();
    let mut predicate = schema::flow::ts_start.lt(ts_to);
    
    if let Some(app_proto) = &filters.app_proto {
        predicate.and(schema::flow::app_proto.eq(app_proto));
    }

    if let Some(services) = &filters.services {
        let mut filter_services: Vec<String> = Vec::new();
        if services.len() == 0 {
            // Filter flows related to no services
            for s in ctf_config.services.values() {
                for ipp in s.ipports.clone() {
                    filter_services.push(ipp.to_string());
                }
            }
        }
        else {
            filter_services = services.to_vec();
        }
        predicate.and(schema::flow::src_ipport.ne_all(filter_services.clone()).and(schema::flow::dest_ipport.ne_all(filter_services)));
    }

    if filters.tags_deny.len() > 0 {
        let tags_deny_flow_ids = schema::alert::table
            .filter(schema::alert::tag.eq_any(filters.tags_deny))
            .select(schema::alert::flow_id)
            .load::<i64>(&mut conn)
            .expect("Error while selecting alerts.");
        predicate.and(schema::flow::id.ne_all(tags_deny_flow_ids));
    }

    if filters.tags_require.len() > 0 {
        let tags_require_flow_ids = schema::alert::table
            .filter(schema::alert::tag.eq_any(filters.tags_require))
            .select(schema::alert::flow_id)
            .load::<i64>(&mut conn)
            .expect("Error while selecting alerts.");
        predicate.and(schema::flow::id.eq_any(tags_require_flow_ids));
    }

    if let Some(search) = &filters.search {
        let matching_flow_ids = sql_query("SELECT flow_id FROM raw WHERE REGEXP_LIKE(ENCODE(\"blob\", 'escape'), ?);")
            .bind::<Text, _>(search.as_str())
            .load::<RawFlowID>(&mut conn)
            .expect("Error while selecting blob.");
        predicate.and(schema::flow::id.eq_any(matching_flow_ids.iter().map(|x| x.flow_id)));
    }

    println!("{:#?}", predicate);

    let flows = schema::flow::table
        .filter(predicate)
        .select(Flow::as_select())
        .limit(100)
        .order_by(schema::flow::ts_start.desc())
        .load(&mut conn)
        .expect("Error while selecting flows.");

    let alerts = FlowTag::belonging_to(&flows)
        .select(FlowTag::as_select())
        .load(&mut conn)
        .unwrap();

    let alerts_per_flows = alerts
        .grouped_by(&flows)
        .into_iter()
        .zip(flows)
        .map(|(alerts, flow)| FlowWithAlerts { flow, alerts })
        .collect::<Vec<FlowWithAlerts>>();

    let app_protos = schema::flow::table
        .filter(schema::flow::app_proto.ne("failed"))
        .group_by(schema::flow::app_proto)
        .select(schema::flow::app_proto)
        .load(&mut conn)
        .expect("Error while selecting protos.");

    let tags = schema::alert::table
        .group_by((schema::alert::tag, schema::alert::color))
        .select(Tag::as_select())
        .order_by(schema::alert::color.asc())
        .load(&mut conn)
        .expect("Error while selecting tags.");

    HttpResponse::Ok().json(FlowsList {
        flows: alerts_per_flows,
        app_protos,
        tags
    })
}

#[get("/api/flow/{id}")]
async fn read_flow(flow_id: web::Path<i64>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let flow_id = flow_id.into_inner();

    let flow = schema::flow::table
        .filter(schema::flow::id.eq(flow_id))
        .select(Flow::as_select())
        .first::<Flow>(&mut conn)
        .optional()
        .expect("Error while selecting flow.");
    
    if flow.is_none() {
        return ApiError::new(404, "Flow id not found.".to_string()).error_response();
    }

    let events = schema::other_event::table
        .filter(schema::other_event::flow_id.eq(flow_id))
        .select(Event::as_select())
        .order_by(schema::other_event::id.asc())
        .load(&mut conn)
        .expect("Error while selecting events.");

    let alerts = schema::alert::table
        .filter(schema::alert::flow_id.eq(flow_id))
        .select(Alert::as_select())
        .order_by(schema::alert::id.asc())
        .load(&mut conn)
        .expect("Error while selecting alerts.");

    HttpResponse::Ok().json(FlowData { 
        flow: flow.unwrap(),
        events,
        alerts
    })
}

#[get("/api/flow/{id}/pcap")]
async fn read_flow_pcap(req: HttpRequest, flow_id: web::Path<i64>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    let flow_id = flow_id.into_inner();
    
    let flow = schema::flow::table
        .filter(schema::flow::id.eq(flow_id))
        .select(schema::flow::ts_start)
        .load::<i64>(&mut conn)
        .expect("Error while selecting flow.");
    
    if flow.len() == 0 {
        // Error flow_id invalid
        return ApiError::new(404, "Flow id not found. ".to_string()).error_response();
    }
    
    let flow_us = flow[0] as f64 / 1000.0;
    let mut flow_pcap_file: Option<String> = None;
    for entry in fs::read_dir("../suricata/output/pcaps").unwrap() {
        let entry = entry.unwrap();
        let filename = entry.file_name().into_string().unwrap();
        let (pcap_us, _) = filename.split_once(".").unwrap();
        let pcap_us: f64 = pcap_us.parse().unwrap();
        
        if pcap_us > flow_us {
            break;
        }
        
        flow_pcap_file = Some(filename.to_string());
    }
    
    if flow_pcap_file.is_none() {
        // Error file not found
        return ApiError::new(404, "PCAP file not found.".to_string()).error_response();
    }
    
    match NamedFile::open(format!("../../suricata/output/pcaps/{}", flow_pcap_file.unwrap())) {
        Ok(f) => f.into_response(&req),
        Err(_) => ApiError::new(500, "Can't open PCAP file.".to_string()).error_response()
    }
}

#[get("/api/flow/{id}/raw")]
async fn read_flow_raw(flow_id: web::Path<i64>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let mut conn = pool.get().unwrap();
    let flow_id = flow_id.into_inner();
    
    let res = schema::raw::table
        .filter(schema::raw::flow_id.eq(flow_id))
        .select(ReadFlowRaw::as_select())
        .order_by(schema::raw::count.asc())
        .load::<ReadFlowRaw>(&mut conn)
        .expect("Error selecting raw flow data.");
    
    Ok(web::Json(res))
}