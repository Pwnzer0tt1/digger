use diesel::{Connection, ConnectionError, PgConnection, QueryResult, RunQueryDsl};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::{thread, time};

use crate::models::{NewAlert, NewOtherEvent, NewFlow};
use crate::schema::{alert, other_event, flow};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();


/// Add one Eve event to the SQL database
fn write_event(conn: &mut PgConnection, buf: &str) -> QueryResult<usize> {
    // Parse EVE JSON to untyped JSON object
    // After some benchmarks, it was concluded that serde_json parsing is around 30x faster than regex_lite captures (crate originally used in shovel).
    // regex create is generally faster compared to serde_json (1.5x-2x times) but having an already parsed JSON is more convinient.
    // Parsing to generic type serde_json::Value is slower than parsing into a typed struct
    // TODO: Create struct for parsing EVE JSON format
    let Ok(eve_json): Result<serde_json::Value, serde_json::Error> = serde_json::from_str(buf) else {
        log::warn!("Failed to parse EVE JSON.");
        return Ok(0);
    };

    // Ignore events that don't have event_type field, such as stats.
    let event_type = match eve_json.get("event_type") {
        Some(v) => v.as_str().unwrap(),
        None => return Ok(0)
    };

    let timestamp = chrono::DateTime::parse_from_str(eve_json.get("timestamp").expect("Missing timestamp.").as_str().unwrap(), "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();
    let flow_id = match eve_json.get("flow_id") {
        Some(v) => v.as_i64().unwrap(),
        None => return Ok(0)
    };

    match event_type {
        "flow" => {
            let src_ip = eve_json.get("src_ip").expect("Missing src_ip").as_str().unwrap();
            let src_port: Option<i32> = match eve_json.get("src_port") {
                Some(v) => Some(v.as_i64().unwrap().try_into().unwrap()),
                None => None
            };
            let dest_ip = eve_json.get("dest_ip").expect("Missing dest_ip").as_str().unwrap();
            let dest_port: Option<i32> = match eve_json.get("dest_port") {
                Some(v) => Some(v.as_i64().unwrap().try_into().unwrap()),
                None => None
            };

            let proto = eve_json.get("proto").unwrap().as_str().unwrap();
            let app_proto = match eve_json.get("app_proto") {
                Some(v) => Some(v.as_str().unwrap()),
                None => None
            };
            let metadata = eve_json.get("metadata").cloned();
            let extra_data = eve_json.get("flow").cloned();

            let ts_start = chrono::DateTime::parse_from_str(extra_data.as_ref().unwrap().get("start").expect("Missing start timestamp.").as_str().unwrap(), "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();
            let ts_end = chrono::DateTime::parse_from_str(extra_data.as_ref().unwrap().get("end").expect("Missing end timestamp.").as_str().unwrap(), "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();

            let new_flow = NewFlow {
                id: flow_id,
                ts_start,
                ts_end,
                src_ip,
                src_port,
                dest_ip,
                dest_port,
                proto,
                app_proto,
                metadata,
                extra_data,
            };

            diesel::insert_into(flow::table)
                .values(&new_flow)
                .on_conflict_do_nothing()
                .execute(conn)
        },
        "alert" => {
            let new_alert = NewAlert {
                flow_id,
                timestamp,
                extra_data: eve_json.get("alert").cloned()
            };

            diesel::insert_into(alert::table)
                .values(&new_alert)
                .on_conflict_do_nothing()
                .execute(conn)
        },
        _ => {
            let new_other_event = NewOtherEvent {
                flow_id,
                timestamp,
                event_type: event_type.to_string(),
                extra_data: eve_json.get(event_type).cloned()
            };

            diesel::insert_into(other_event::table)
                .values(&new_other_event)
                .on_conflict_do_nothing()
                .execute(conn)
        }
    }
}

pub struct Database {
    conn: PgConnection,
    rx: std::sync::mpsc::Receiver<String>,
    count: usize,
    count_inserted: usize,
}

impl Database {
    /// Open Postgres database connection.
    pub fn new(
        url: String,
        rx: std::sync::mpsc::Receiver<String>,
    ) -> Result<Self, ConnectionError> {
        // Lazy, wait for PostgreSQL container to start
        thread::sleep(time::Duration::from_secs(5));

        let mut conn = PgConnection::establish(&url)?;
        conn.run_pending_migrations(MIGRATIONS).unwrap();

        Ok(Self {
            conn,
            rx,
            count: 0,
            count_inserted: 0,
        })
    }

    fn batch_write_events(&mut self) -> Result<(), diesel::result::Error> {
        while let Ok(buf) = self.rx.recv() {
            // Insert first event
            self.count += 1;
            self.count_inserted += write_event(&mut self.conn, &buf)?;

            // Insert remaining events
            let batch = self
                .rx
                .try_iter()
                .map(|buf| write_event(&mut self.conn, &buf))
                .collect::<Result<Vec<_>, _>>()?;
            self.count += batch.len();
            self.count_inserted += batch.iter().sum::<usize>();
        }
        Ok(())
    }

    /// Database thread entry
    pub fn run(&mut self) {
        log::debug!("Database thread started");
        if let Err(err) = self.batch_write_events() {
            log::error!("Failed to write batch of events: {err:?}");
        }
        log::info!(
            "Database thread finished: count={} inserted={}",
            self.count,
            self.count_inserted
        );
    }
}
