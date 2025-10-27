use crate::models::{Tag};
use serde::{Deserialize, Serialize};

use crate::models::{Alert, Event, Flow};


#[derive(Serialize)]
pub struct FlowData {
    pub flow: Flow,
    pub events: Vec<Event>,
    pub alerts: Vec<Alert>
}

#[derive(Deserialize)]
pub struct FlowsQuery {
    pub filters: String
}

#[derive(Deserialize, Debug)]
pub struct FlowsFilters {
    pub ts_to: String,
    pub services: Option<Vec<String>>,
    pub app_proto: Option<String>,
    pub search: Option<String>,
    pub tags_require: Vec<String>,
    pub tags_deny: Vec<String>
}

#[derive(Serialize)]
pub struct FlowsList {
    pub flows: Vec<Flow>,
    pub app_protos: Vec<Option<String>>,
    pub tags: Vec<Tag>
}