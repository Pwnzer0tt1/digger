use diesel::prelude::*;

use crate::schema::filedata;


#[derive(Insertable)]
#[diesel(table_name = filedata)]
pub struct NewFiledata<'a> {
    pub sha256: Vec<u8>,
    pub blob: &'a Vec<u8>
}