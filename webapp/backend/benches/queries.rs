use std::{collections::HashMap};

use backend::{config::CtfConfig, flow::{FlowWithAlerts, FlowsFilters, FlowsList, TickOp}, models::{FlowNoData, FlowTag, RawFlowID, Tag}, schema};
use diesel::{dsl, prelude::*, r2d2::{self, ConnectionManager, Pool}, sql_query, sql_types::Text};
use divan::Bencher;

fn main() {
    divan::main();
}

fn init_pool() -> Pool<ConnectionManager<diesel::PgConnection>> {
    // Create Postgres connection
    let database_url = String::from("postgresql://postgres@postgres:5432/postgres");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder().build(manager).expect("Failed to create database connection pool.");

    pool
}

#[divan::bench(args = [
    r#"{"tags_require":[],"tags_deny":[]}"#,
    r#"{"tags_require":["GET"],"tags_deny":[],"app_proto":"http"}"#,
    r#"{"tags_require":["PNG"],"tags_deny":[],"app_proto":"http","min_ts":"1777055280000000","max_ts":"1777055520000000","tick_op":"BetweenGeLe"}"#,
    r#"{"tags_require":["PATCH"],"tags_deny":["401"],"app_proto":"http","tick_op":"BetweenGeLe"}"#,
    r#"{"tags_require":[],"tags_deny":["UA Firefox","UA PyReq","UA Safari","UA Chrome"],"app_proto":"http","tick_op":"BetweenGeLe","search":"User-Agent: checker"}"#,
    r#"{"tags_require":["GET","201","PNG"],"tags_deny":["PATCH","401","Slow"]}"#
])]
fn bench_read_flows_query(bencher: Bencher, filter_string: &str) {
    let mut pool = init_pool();
    let ctf_config = CtfConfig {
        start_date: "2026-04-24T13:30:00.000Z".to_string(),
        end_date: "2026-04-24T20:30:00.000Z".to_string(),
        tick_length: 120,
        services: HashMap::new()
    };

    bencher.bench_local(move || {
        let mut conn = pool.get().unwrap();
        read_flows(&mut conn, filter_string, &ctf_config);
    });
}

fn read_flows(conn: &mut PgConnection, query_filters: &str, ctf_config: &CtfConfig) {
    let filters: FlowsFilters = match serde_json::from_str(&query_filters) {
        Ok(v) => v,
        Err(_) => {
            return;
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
    
    if filters.tags_deny.len() > 0 {
        /*
        let tags_deny_flow_ids = schema::alert::table
            .filter(schema::alert::tag.eq_any(filters.tags_deny))
            .select(schema::alert::flow_id)
            .load::<i64>(conn).unwrap();
        flows_query = flows_query.filter(schema::flow::id.ne_all(tags_deny_flow_ids));
        */
        flows_query = flows_query.filter(
            dsl::not(dsl::exists(
                schema::alert::table
                    .filter(schema::alert::flow_id.eq(schema::flow::id))
                    .filter(schema::alert::tag.eq_any(filters.tags_deny))
            ))
        );
    }
    
    if filters.tags_require.len() > 0 {
        /*
        let tags_require_flow_ids = schema::alert::table
            .filter(schema::alert::tag.eq_any(filters.tags_require))
            .select(schema::alert::flow_id)
            .load::<i64>(conn).unwrap();
        flows_query = flows_query.filter(schema::flow::id.eq_any(tags_require_flow_ids));
        */
        flows_query = flows_query.filter(
            dsl::exists(
                schema::alert::table
                    .filter(schema::alert::flow_id.eq(schema::flow::id))
                    .filter(schema::alert::tag.eq_any(filters.tags_require))
            )
        );
    }
    
    if let Some(search) = &filters.search {
        let matching_flow_ids = sql_query("SELECT flow_id FROM raw WHERE REGEXP_LIKE(ENCODE(\"blob\", 'escape'), $1);")
            .bind::<Text, _>(search.as_str())
            .load::<RawFlowID>(conn).unwrap();
        flows_query = flows_query.filter(schema::flow::id.eq_any(matching_flow_ids.iter().map(|x| x.flow_id)));
    }
    
    let flows = flows_query
        .select(FlowNoData::as_select())
        .limit(100)
        .order_by(schema::flow::ts_start.desc())
        .load(conn).unwrap();
    
    let alerts = FlowTag::belonging_to(&flows)
        .select(FlowTag::as_select())
        .load(conn).unwrap();

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
        .load(conn).unwrap();
    
    let tags = schema::alert::table
        .group_by((schema::alert::tag, schema::alert::color))
        .select(Tag::as_select())
        .order_by(schema::alert::color.asc())
        .load(conn).unwrap();
        
    let flows_list = FlowsList {
        flows: alerts_per_flows,
        app_protos,
        tags
    };
}