use diesel::prelude::*;
use serde::Serialize;

use crate::schema::{alert, filedata, flow, other_event, raw};

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = filedata)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Filedata {
    pub sha256: Vec<u8>,
    pub blob: Vec<u8>
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = raw)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct ReadFlowRaw {
    pub server_to_client: Option<i32>,
    pub blob: Option<Vec<u8>>
}

#[derive(Queryable, Selectable, Serialize, Identifiable)]
#[diesel(table_name = flow)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Flow {
    pub id: i64,
    pub ts_start: i64,
    pub ts_end: i64,
    pub src_ipport: String,
    pub dest_port: Option<i32>,
    pub dest_ipport: String,
    pub proto: String,
    pub app_proto: Option<String>,
    pub data: Vec<u8>
}

#[derive(Queryable, Selectable, Serialize, Identifiable)]
#[diesel(table_name = flow)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct FlowNoData {
    pub id: i64,
    pub ts_start: i64,
    pub ts_end: i64,
    pub src_ipport: String,
    pub dest_port: Option<i32>,
    pub dest_ipport: String,
    pub proto: String,
    pub app_proto: Option<String>
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = other_event)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Event {
    pub event_type: String,
    pub data: Vec<u8>
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = alert)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Alert {
    pub color: Option<String>,
    pub data: Vec<u8>
}

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = alert)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Tag {
    pub tag: Option<String>,
    pub color: Option<String>
}

#[derive(Queryable, Selectable, Serialize, Associations, Identifiable)]
#[diesel(belongs_to(Flow))]
#[diesel(belongs_to(FlowNoData, foreign_key = flow_id))]
#[diesel(table_name = alert)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct FlowTag {
    pub id: i32,
    pub tag: Option<String>,
    pub flow_id: i64
}

#[derive(Queryable, QueryableByName, Selectable, Serialize)]
#[diesel(table_name = raw)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct RawFlowID {
    pub flow_id: i64
}