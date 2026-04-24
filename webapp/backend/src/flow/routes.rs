use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse, Responder, Result};
use diesel::{prelude::*, r2d2::ConnectionManager, sql_query, sql_types::Text};
use std::{fs, sync::Mutex};
use crate::{config::CtfConfig, flow::model::{FlowData, FlowWithAlerts, FlowsFilters, FlowsList, FlowsQuery, TickOp}, models::{Alert, Event, Flow, FlowTag, RawFlowID, ReadFlowRaw, Tag}, schema};


pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(read_flows);
    cfg.service(read_flow);
    cfg.service(read_flow_pcap);
    cfg.service(read_flow_raw);
}

#[get("/api/flow")]
async fn read_flows(query: web::Query<FlowsQuery>, ctf_config: web::Data<Mutex<CtfConfig>>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let filters: FlowsFilters = match serde_json::from_str(&query.filters) {
        Ok(v) => v,
        Err(_) => {
            return Ok(HttpResponse::BadRequest().body("Malformed filters."));
        }
    };

    let mut flows_query = schema::flow::table.into_boxed();
    
    if let Some(tick_op) = filters.tick_op {
        let min_ts: Option<i64> = match filters.min_ts {
            Some(v) => Some(v.parse().unwrap()),
            None => None
        };
        let max_ts: Option<i64> = match filters.max_ts {
            Some(v) => Some(v.parse().unwrap()),
            None => None
        };
        let ts: Option<i64> = match filters.ts {
            Some(v) => Some(v.parse().unwrap()),
            None => None
        };
        let ctf_config = ctf_config.lock().unwrap();
        if let (Some(min_ts), Some(max_ts)) = (min_ts, max_ts) {
            match tick_op {
                TickOp::BetweenGeLe => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(min_ts).and(schema::flow::ts_start.lt(max_ts + (ctf_config.tick_length * 1_000_000) as i64)));
                },
                TickOp::BetweenGeLt => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(min_ts).and(schema::flow::ts_start.lt(max_ts)));
                },
                TickOp::BetweenGtLe => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(min_ts + (ctf_config.tick_length * 1_000_000) as i64).and(schema::flow::ts_start.lt(max_ts + (ctf_config.tick_length * 1_000_000) as i64)));
                },
                TickOp::BetweenGtLt => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(min_ts + (ctf_config.tick_length * 1_000_000) as i64).and(schema::flow::ts_start.lt(max_ts)));
                },
                _ => {}
            };
        }
        if let Some(ts) = ts {
            match tick_op {
                TickOp::Eq => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(ts).and(schema::flow::ts_start.lt(ts + (ctf_config.tick_length * 1_000_000) as i64)));
                },
                TickOp::Ge => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(ts));
                },
                TickOp::Gt => {
                    flows_query = flows_query.filter(schema::flow::ts_start.ge(ts + (ctf_config.tick_length * 1_000_000) as i64));
                },
                TickOp::Le => {
                    flows_query = flows_query.filter(schema::flow::ts_start.lt(ts + (ctf_config.tick_length * 1_000_000) as i64));
                },
                TickOp::Lt => {
                    flows_query = flows_query.filter(schema::flow::ts_start.lt(ts));
                },
                TickOp::Ne => {
                    flows_query = flows_query.filter(schema::flow::ts_start.lt(ts).or(schema::flow::ts_start.ge(ts + (ctf_config.tick_length * 1_000_000) as i64)));
                },
                _ => {}
            }
        }
    }

    if let Some(app_proto) = &filters.app_proto {
        flows_query = flows_query.filter(schema::flow::app_proto.eq(app_proto.to_owned()));
    }

    if let Some(services) = &filters.services {
        let mut filter_services: Vec<String> = Vec::new();
        if services.len() == 0 {
            let ctf_config = ctf_config.lock().unwrap();
            
            // Filter flows related to no services
            for s in ctf_config.services.values() {
                for ipp in s.ipports.clone() {
                    filter_services.push(ipp.to_string());
                }
            }
            flows_query = flows_query.filter(schema::flow::src_ipport.ne_all(filter_services.clone()).and(schema::flow::dest_ipport.ne_all(filter_services)));
        }
        else {
            filter_services = services.to_vec();
            flows_query = flows_query.filter(schema::flow::src_ipport.eq_any(filter_services.clone()).or(schema::flow::dest_ipport.eq_any(filter_services)));
        }
    }
    
    let flows_list = web::block(move || -> Result<FlowsList, diesel::result::Error> {
        let mut conn = pool.get().unwrap();
    
        if filters.tags_deny.len() > 0 {
            let tags_deny_flow_ids = schema::alert::table
                .filter(schema::alert::tag.eq_any(filters.tags_deny))
                .select(schema::alert::flow_id)
                .load::<i64>(&mut conn)?;
            flows_query = flows_query.filter(schema::flow::id.ne_all(tags_deny_flow_ids));
        }
    
        if filters.tags_require.len() > 0 {
            let tags_require_flow_ids = schema::alert::table
                .filter(schema::alert::tag.eq_any(filters.tags_require))
                .select(schema::alert::flow_id)
                .load::<i64>(&mut conn)?;
            flows_query = flows_query.filter(schema::flow::id.eq_any(tags_require_flow_ids));
        }
    
        if let Some(search) = &filters.search {
            let matching_flow_ids = sql_query("SELECT flow_id FROM raw WHERE REGEXP_LIKE(ENCODE(\"blob\", 'escape'), $1);")
                .bind::<Text, _>(search.as_str())
                .load::<RawFlowID>(&mut conn)?;
            flows_query = flows_query.filter(schema::flow::id.eq_any(matching_flow_ids.iter().map(|x| x.flow_id)));
        }
    
        let flows = flows_query
            .select(Flow::as_select())
            .limit(100)
            .order_by(schema::flow::ts_start.desc())
            .load(&mut conn)?;
    
        let alerts = FlowTag::belonging_to(&flows)
            .select(FlowTag::as_select())
            .load(&mut conn)?;
    
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
            .load(&mut conn)?;
    
        let tags = schema::alert::table
            .group_by((schema::alert::tag, schema::alert::color))
            .select(Tag::as_select())
            .order_by(schema::alert::color.asc())
            .load(&mut conn)?;
        
        Ok(FlowsList {
            flows: alerts_per_flows,
            app_protos,
            tags
        })
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;
    
    Ok(HttpResponse::Ok().json(flows_list))
}

#[get("/api/flow/{id}")]
async fn read_flow(flow_id: web::Path<i64>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let flow_id = flow_id.into_inner();
    
    let flow_data = web::block(move || -> Result<Option<FlowData>, diesel::result::Error> {
        let mut conn = pool.get().unwrap();
    
        let flow = schema::flow::table
            .filter(schema::flow::id.eq(flow_id))
            .select(Flow::as_select())
            .first::<Flow>(&mut conn)
            .optional()?;
        
        if flow.is_none() {
            return Ok(None);
        }
    
        let events = schema::other_event::table
            .filter(schema::other_event::flow_id.eq(flow_id))
            .select(Event::as_select())
            .order_by(schema::other_event::id.asc())
            .load(&mut conn)?;
    
        let alerts = schema::alert::table
            .filter(schema::alert::flow_id.eq(flow_id))
            .select(Alert::as_select())
            .order_by(schema::alert::id.asc())
            .load(&mut conn)?;
        
        Ok(Some(FlowData { 
            flow: flow.unwrap(),
            events,
            alerts
        }))
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;

    Ok(match flow_data {
        Some(flow_data) => HttpResponse::Ok().json(flow_data),
        None => HttpResponse::NotFound().body("Flow not found.")
    })
}

#[get("/api/flow/{id}/pcap")]
async fn read_flow_pcap(req: HttpRequest, flow_id: web::Path<i64>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let flow_id = flow_id.into_inner();
    
    let flow = web::block(move || {
        let mut conn = pool.get().unwrap();
        
        schema::flow::table
            .filter(schema::flow::id.eq(flow_id))
            .select(schema::flow::ts_start)
            .get_result::<i64>(&mut conn)
            .optional()
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;
    
    match flow {
        Some(flow) => {
            let flow_us = flow as f64 / 1000.0;
            let mut flow_pcap_file: Option<String> = None;
            for entry in fs::read_dir("../suricata/output/pcaps").unwrap() {
                let entry = entry.unwrap();
                let filename = entry.file_name().into_string().unwrap();
                let strs: Vec<&str> = filename.split(".").collect();
                let pcap_us: f64 = strs[2].parse().unwrap();
                
                if pcap_us > flow_us {
                    break;
                }
                
                flow_pcap_file = Some(filename.to_string());
            }
            
            if flow_pcap_file.is_none() {
                // Error file not found
                return Ok(HttpResponse::NotFound().body("PCAP file not found."));
            }
            
            let file = NamedFile::open_async(format!("../../suricata/output/pcaps/{}", flow_pcap_file.unwrap())).await?;
            Ok(file.into_response(&req))
        },
        None => Ok(HttpResponse::NotFound().body("No flow id found."))
    }
}

#[get("/api/flow/{id}/raw")]
async fn read_flow_raw(flow_id: web::Path<i64>, pool: web::Data<diesel::r2d2::Pool<ConnectionManager<PgConnection>>>) -> Result<impl Responder> {
    let flow_id = flow_id.into_inner();
    
    let raw = web::block(move || {
        let mut conn = pool.get().unwrap();
        
        schema::raw::table
            .filter(schema::raw::flow_id.eq(flow_id))
            .select(ReadFlowRaw::as_select())
            .order_by(schema::raw::count.asc())
            .load::<ReadFlowRaw>(&mut conn)
    })
    .await?
    .map_err(actix_web::error::ErrorInternalServerError)?;
    
    Ok(web::Json(raw))
}