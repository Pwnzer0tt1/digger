// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use diesel::prelude::*;

use crate::schema::raw;


#[derive(Insertable)]
#[diesel(table_name = raw)]
pub struct NewRaw<'a> {
    pub flow_id: i64,
    pub count: Option<i32>,
    pub server_to_client: Option<i32>,
    pub blob: Option<&'a Vec<u8>>
}