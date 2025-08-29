// Copyright (C) 2024  ANSSI
// Copyright (C) 2025  A. Iooss
// SPDX-License-Identifier: GPL-2.0-or-later

// Modifications
// Copyright (C) 2025 Pwnzer0tt1
// This file has been modified from the original version.
// Licensed under GPL-3.0

use diesel::{Connection, ConnectionError, PgConnection, QueryResult, RunQueryDsl};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::{thread, time};

use crate::models::{NewAlert, NewFlow, NewOtherEvent, NewStats};
use crate::schema::{alert, flow, other_event, stats};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();


/// Add one Eve event to the SQL database
fn write_event(conn: &mut PgConnection, buf: &str) -> QueryResult<usize> {
    let (event_type, _) = match buf.split_once(r#","event_type":""#) {
        Some((_, p)) => p,
        None => {
            match buf.split_once(r#", "event_type": ""#) {
                Some((_, p)) => p,
                None => {
                    println!("{:?}", buf);
                    return Ok(0);
                }
            }
        }
    }
    .split_once('"')
    .unwrap();

    let (_, timestamp_part) = match buf.split_once(r#""timestamp":""#) {
        Some(s) => s,
        None => match buf.split_once(r#""timestamp": ""#) {
            Some(s) => s,
            None => {
                println!("{:?}", buf);
                return Ok(0);
            }
        }
    };
    let (timestamp, _) = timestamp_part.split_once('"').unwrap();
    let timestamp = chrono::DateTime::parse_from_str(timestamp, "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();
    
    match event_type {
        "flow" => {
            let (_, flow_id_part) = buf.split_once(r#""flow_id":"#).expect("Missing flow_id field.");
            let (flow_id, _) = flow_id_part.split_once(',').unwrap();
            let flow_id = flow_id.parse().unwrap();

            let (_, ts_start_part) = match buf.split_once(r#""start":""#) {
                Some(v) => v,
                None => buf.split_once(r#""start": ""#).expect("Missing start field.")
            };
            let (ts_start, _) = ts_start_part.split_once('"').unwrap();
            let ts_start = chrono::DateTime::parse_from_str(ts_start, "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();

            let (_, ts_end_part) = match buf.split_once(r#""end":""#) {
                Some(v) => v,
                None => buf.split_once(r#""end": ""#).expect("Missing end field.")
            };
            let (ts_end, _) = ts_end_part.split_once('"').unwrap();
            let ts_end = chrono::DateTime::parse_from_str(ts_end, "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();

            let (_, src_ip_part) = buf.split_once(r#""src_ip":""#).expect("Missing src_ip field.");
            let (src_ip, _) = src_ip_part.split_once('"').unwrap();

            let mut src_ipport = src_ip.to_string() + ":";

            let src_port = match buf.split_once(r#""src_port":"#) {
                Some((_, s)) => match s.split_once(',') {
                    Some((s, _)) => {
                        src_ipport += s;
                        Some(s.parse().unwrap())
                    },
                    None => None
                },
                None => None
            };

            let (_, dest_ip_part) = buf.split_once(r#""dest_ip":""#).expect("Missing dest_ip field.");
            let (dest_ip, _) = dest_ip_part.split_once('"').unwrap();

            let mut dest_ipport = dest_ip.to_string() + ":";

            let dest_port = match buf.split_once(r#""dest_port":"#) {
                Some((_, s)) => match s.split_once(',') {
                    Some((s, _)) => {
                        dest_ipport += s;
                        Some(s.parse().unwrap())
                    },
                    None => None
                },
                None => None
            };

            let (_, proto_part) = match buf.split_once(r#""proto":""#) {
                Some(v) => v,
                None => buf.split_once(r#""proto": ""#).expect("Missing proto field.")
            };
            let (proto, _) = proto_part.split_once('"').unwrap();

            let app_proto = match buf.split_once(r#""app_proto":""#) {
                Some((_, s)) => match s.split_once('"') {
                    Some((s, _)) => Some(s),
                    None => None
                },
                None => None
            };

            let new_flow = NewFlow {
                id: flow_id,
                ts_start,
                ts_end,
                src_ip,
                src_port,
                src_ipport: &src_ipport,
                dest_ip,
                dest_port,
                dest_ipport: &dest_ipport,
                proto,
                app_proto,
                data: buf.as_bytes()
            };

            diesel::insert_into(flow::table)
                .values(&new_flow)
                .on_conflict_do_nothing()
                .execute(conn)
        },
        "alert" => {
            let (_, flow_id_part) = buf.split_once(r#""flow_id":"#).expect("Missing flow_id field.");
            let (flow_id, _) = flow_id_part.split_once(',').unwrap();
            let flow_id = flow_id.parse().unwrap();

            
            let tag: Option<&str> = match buf.split_once(r#""tag":[""#) {
                Some((_, s)) => match s.split_once('"') {
                    Some((s, _)) => Some(s),
                    None => None
                },
                None => None
            };

            let color: Option<&str> = match buf.split_once(r#""color":[""#) {
                Some((_, s)) => match s.split_once('"') {
                    Some((s, _)) => Some(s),
                    None => None
                },
                None => None
            };

            let new_alert = NewAlert {
                flow_id,
                timestamp,
                tag,
                color,
                data: buf.as_bytes()
            };

            diesel::insert_into(alert::table)
                .values(&new_alert)
                .on_conflict_do_nothing()
                .execute(conn)
        },
        "stats" => {
            let new_stats= NewStats {
                timestamp,
                data: buf.as_bytes()
            };

            diesel::insert_into(stats::table)
                .values(&new_stats)
                .execute(conn)
        },
        _ => {
            let (_, flow_id_part) = buf.split_once(r#""flow_id":"#).expect("Missing flow_id field.");
            let (flow_id, _) = flow_id_part.split_once(',').unwrap();
            let flow_id = flow_id.parse().unwrap();

            let new_other_event = NewOtherEvent {
                flow_id,
                timestamp,
                event_type,
                data: buf.as_bytes()
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
