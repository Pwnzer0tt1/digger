use serde::Serialize;

use crate::models::{StatsFlagsOut, StatsFlasgOutFlow};


#[derive(Serialize)]
pub struct StatsData {
    pub flags_out: Vec<StatsFlagsOut>,
    pub flows_num: i64,
    pub flags_out_flows: Vec<StatsFlasgOutFlow>
}