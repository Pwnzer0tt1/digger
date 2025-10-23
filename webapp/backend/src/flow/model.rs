use crate::models::{AppProto, Tag};
use serde::{Deserialize, Serialize};

use crate::models::{Alert, Event, Flow};


#[derive(Serialize)]
pub struct FlowData {
    pub flow: Flow,
    pub events: Vec<Event>,
    pub alerts: Vec<Alert>
}

#[derive(Deserialize)]
pub struct FlowsFilters {
    pub ts_to: Option<i64>,
    pub services: Option<Vec<String>>,
    pub app_proto: Option<String>,
    pub search: Option<String>,
    pub tags_require: Option<Vec<String>>,
    pub tags_deny: Option<Vec<String>>
}

#[derive(Serialize)]
pub struct FlowsList {
    pub flows: Vec<Flow>,
    pub app_protos: Vec<AppProto>,
    pub tags: Vec<Tag>
}