// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use diesel::prelude::*;

use crate::schema::{alert, other_event, flow};


#[derive(Insertable)]
#[diesel(table_name = flow)]
pub struct NewFlow<'a> {
    pub id: i64,
    pub ts_start: i64,
    pub ts_end: i64,
    pub src_ip: &'a str,
    pub src_port: Option<i32>,
    pub dest_ip: &'a str,
    pub dest_port: Option<i32>,
    pub proto: &'a str,
    pub app_proto: Option<&'a str>,
    pub metadata: Option<serde_json::Value>,
    pub extra_data: Option<serde_json::Value>
}

#[derive(Insertable)]
#[diesel(table_name = alert)]
pub struct NewAlert {
    pub flow_id: i64,
    pub timestamp: i64,
    pub extra_data: Option<serde_json::Value>
}

#[derive(Insertable)]
#[diesel(table_name = other_event)]
pub struct NewOtherEvent {
    pub flow_id: i64,
    pub timestamp: i64,
    pub event_type: String,
    pub extra_data: Option<serde_json::Value>
}