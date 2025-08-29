// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use diesel::prelude::*;

use crate::schema::{alert, other_event, flow, stats};


#[derive(Insertable)]
#[diesel(table_name = flow)]
pub struct NewFlow<'a> {
    pub id: i64,
    pub ts_start: i64,
    pub ts_end: i64,
    pub src_ip: &'a str,
    pub src_port: Option<i32>,
    pub src_ipport: &'a str,
    pub dest_ip: &'a str,
    pub dest_port: Option<i32>,
    pub dest_ipport: &'a str,
    pub proto: &'a str,
    pub app_proto: Option<&'a str>,
    pub data: &'a [u8]
}

#[derive(Insertable)]
#[diesel(table_name = alert)]
pub struct NewAlert<'a> {
    pub flow_id: i64,
    pub timestamp: i64,
    pub tag: Option<&'a str>,
    pub color: Option<&'a str>,
    pub data: &'a [u8]
}

#[derive(Insertable)]
#[diesel(table_name = other_event)]
pub struct NewOtherEvent<'a> {
    pub flow_id: i64,
    pub timestamp: i64,
    pub event_type: &'a str,
    pub data: &'a [u8]
}

#[derive(Insertable)]
#[diesel(table_name = stats)]
pub struct NewStats<'a> {
    pub timestamp: i64,
    pub data: &'a [u8]
}