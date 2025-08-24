// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use diesel::prelude::*;

use crate::schema::filedata;


#[derive(Insertable)]
#[diesel(table_name = filedata)]
pub struct NewFiledata<'a> {
    pub sha256: Vec<u8>,
    pub blob: &'a Vec<u8>
}