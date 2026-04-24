// Copyright (C) 2024  ANSSI
// Copyright (C) 2025  A. Iooss
// SPDX-License-Identifier: GPL-2.0-or-later

// Modifications
// Copyright (C) 2025 Pwnzer0tt1
// This file has been modified from the original version.
// Licensed under GPL-3.0

mod ffi;

use std::ffi::{CStr, c_char, c_int, c_void};
use std::fmt::Debug;
use std::sync::mpsc;

use database::{models, schema, Database, OutputWriter};
use diesel::RunQueryDsl;
use suricata_sys::sys::{SC_API_VERSION, SC_PACKAGE_VERSION, SCPlugin};


// Default configuration values.
const DEFAULT_DATABASE_URI: &str = "postgresql://postgres@postgres:5432/postgres";
const DEFAULT_BUFFER_SIZE: &str = "1000";

#[derive(Debug, Clone)]
struct Config {
    db_url: String,
    buffer: usize,
}

impl Config {
    fn new() -> Self {
        Self {
            db_url: std::env::var("DATABASE_URL").unwrap_or(DEFAULT_DATABASE_URI.into()),
            buffer: std::env::var("EVE_BUFFER")
                .unwrap_or(DEFAULT_BUFFER_SIZE.into())
                .parse()
                .expect("EVE_BUFFER is not an integer"),
        }
    }
}

struct EveString(String);

impl OutputWriter for EveString {
    fn write_output(&self, conn: &mut diesel::PgConnection) -> diesel::QueryResult<usize> {
        let (event_type, _) = match self.0.split_once(r#","event_type":""#) {
            Some((_, p)) => p,
            None => {
                match self.0.split_once(r#", "event_type": ""#) {
                    Some((_, p)) => p,
                    None => {
                        println!("{:?}", self.0);
                        return Ok(0);
                    }
                }
            }
        }
        .split_once('"')
        .unwrap();
    
        let (_, timestamp_part) = match self.0.split_once(r#""timestamp":""#) {
            Some(s) => s,
            None => match self.0.split_once(r#""timestamp": ""#) {
                Some(s) => s,
                None => {
                    println!("{:?}", self.0);
                    return Ok(0);
                }
            }
        };
        let (timestamp, _) = timestamp_part.split_once('"').unwrap();
        let timestamp = chrono::DateTime::parse_from_str(timestamp, "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();
        match event_type {
            "flow" => {
                let (_, flow_id_part) = self.0.split_once(r#""flow_id":"#).expect("Missing flow_id field.");
                let (flow_id, _) = flow_id_part.split_once(',').unwrap();
                let flow_id = flow_id.parse().unwrap();
    
                let (_, ts_start_part) = match self.0.split_once(r#""start":""#) {
                    Some(v) => v,
                    None => self.0.split_once(r#""start": ""#).expect("Missing start field.")
                };
                let (ts_start, _) = ts_start_part.split_once('"').unwrap();
                let ts_start = chrono::DateTime::parse_from_str(ts_start, "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();
    
                let (_, ts_end_part) = match self.0.split_once(r#""end":""#) {
                    Some(v) => v,
                    None => self.0.split_once(r#""end": ""#).expect("Missing end field.")
                };
                let (ts_end, _) = ts_end_part.split_once('"').unwrap();
                let ts_end = chrono::DateTime::parse_from_str(ts_end, "%Y-%m-%dT%H:%M:%S%.6f%z").unwrap().timestamp_micros();
    
                let (_, src_ip_part) = self.0.split_once(r#""src_ip":""#).expect("Missing src_ip field.");
                let (src_ip, _) = src_ip_part.split_once('"').unwrap();
    
                let mut src_ipport = src_ip.to_string() + ":";
    
                let src_port = match self.0.split_once(r#""src_port":"#) {
                    Some((_, s)) => match s.split_once(',') {
                        Some((s, _)) => {
                            src_ipport += s;
                            Some(s.parse().unwrap())
                        },
                        None => None
                    },
                    None => None
                };
    
                let (_, dest_ip_part) = self.0.split_once(r#""dest_ip":""#).expect("Missing dest_ip field.");
                let (dest_ip, _) = dest_ip_part.split_once('"').unwrap();
    
                let mut dest_ipport = dest_ip.to_string() + ":";
    
                let dest_port = match self.0.split_once(r#""dest_port":"#) {
                    Some((_, s)) => match s.split_once(',') {
                        Some((s, _)) => {
                            dest_ipport += s;
                            Some(s.parse().unwrap())
                        },
                        None => None
                    },
                    None => None
                };
    
                let (_, proto_part) = match self.0.split_once(r#""proto":""#) {
                    Some(v) => v,
                    None => self.0.split_once(r#""proto": ""#).expect("Missing proto field.")
                };
                let (proto, _) = proto_part.split_once('"').unwrap();
    
                let app_proto = match self.0.split_once(r#""app_proto":""#) {
                    Some((_, s)) => match s.split_once('"') {
                        Some((s, _)) => Some(s),
                        None => None
                    },
                    None => None
                };
    
                let new_flow = models::NewFlow {
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
                    data: self.0.as_bytes()
                };
    
                diesel::insert_into(schema::flow::table)
                    .values(&new_flow)
                    .on_conflict_do_nothing()
                    .execute(conn)
            },
            "alert" => {
                let (_, flow_id_part) = self.0.split_once(r#""flow_id":"#).expect("Missing flow_id field.");
                let (flow_id, _) = flow_id_part.split_once(',').unwrap();
                let flow_id = flow_id.parse().unwrap();
    
                
                let tag: Option<&str> = match self.0.split_once(r#""tag":[""#) {
                    Some((_, s)) => match s.split_once('"') {
                        Some((s, _)) => Some(s),
                        None => None
                    },
                    None => None
                };
    
                let color: Option<&str> = match self.0.split_once(r#""color":[""#) {
                    Some((_, s)) => match s.split_once('"') {
                        Some((s, _)) => Some(s),
                        None => None
                    },
                    None => None
                };
    
                let new_alert = models::NewAlert {
                    flow_id,
                    timestamp,
                    tag,
                    color,
                    data: self.0.as_bytes()
                };
    
                diesel::insert_into(schema::alert::table)
                    .values(&new_alert)
                    .on_conflict_do_nothing()
                    .execute(conn)
            },
            "stats" => {
                let new_stats = models::NewStats {
                    timestamp,
                    data: self.0.as_bytes()
                };
    
                diesel::insert_into(schema::stats::table)
                    .values(&new_stats)
                    .execute(conn)
            },
            _ => {
                let (_, flow_id_part) = self.0.split_once(r#""flow_id":"#).expect("Missing flow_id field.");
                let (flow_id, _) = flow_id_part.split_once(',').unwrap();
                let flow_id = flow_id.parse().unwrap();
    
                let new_other_event = models::NewOtherEvent {
                    flow_id,
                    timestamp,
                    event_type,
                    data: self.0.as_bytes()
                };
    
                diesel::insert_into(schema::other_event::table)
                    .values(&new_other_event)
                    .on_conflict_do_nothing()
                    .execute(conn)
            }
        }
    }
}

struct Context {
    tx: mpsc::SyncSender<EveString>
}

extern "C" fn output_init(_conf: *const c_void, threaded: bool, _data: *mut *mut c_void) -> c_int {
    assert!(
        !threaded,
        "PostgreSQL output plugin does not support threaded EVE yet"
    );
    0
}

extern "C" fn output_deinit(_data: *const c_void) {}

extern "C" fn output_write(
    buffer: *const c_char,
    buffer_len: c_int,
    _init_data: *const c_void,
    thread_data: *mut c_void
) -> c_int {
    // Handle FFI arguments
    let context = unsafe { thread_data.cast::<Context>().as_ref() }.expect("null thread_data pointer");
    let text = unsafe {
        str::from_utf8_unchecked(
            CStr::from_bytes_with_nul_unchecked(std::slice::from_raw_parts(
                buffer.cast(),
                buffer_len.unsigned_abs().saturating_add(1) as usize
            ))
            .to_bytes()
        )
    };

    // Send text buffer to database thread
    if let Err(err) = context.tx.send(EveString(text.to_owned())) {
        panic!("Failed to send Eve record to database thread: {err:?}");
    }
    0
}

extern "C" fn output_thread_init(
    _data: *const c_void,
    _thread_id: c_int,
    thread_data: *mut *mut c_void,
) -> c_int {
    // Load configuration
    let config = Config::new();

    let (tx, rx) = mpsc::sync_channel(config.buffer);
    let mut database_client = match Database::new(config.db_url, rx) {
        Ok(client) => client,
        Err(err) => {
            log::error!("Failed to initialize database client: {:?}", err);
            panic!()
        }
    };
    std::thread::spawn(move || database_client.run());
    let context_ptr = Box::into_raw(Box::new(Context { tx }));

    unsafe {
        *thread_data = context_ptr.cast();
    }
    0
}

extern "C" fn output_thread_deinit(_data: *const c_void, thread_data: *mut c_void) {
    let context = unsafe { Box::from_raw(thread_data as *mut Context) };
    log::debug!("SQL Eve output finished");
    std::mem::drop(context);
}

extern "C" fn plugin_init() {
    // Init Rust logger
    // don't log using `suricata` crate to reduce build time.
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    // Register new eve filetype, then we can use it with `eve-log.filetype=postgres`
    let file_type = ffi::SCEveFileType {
        name: c"postgres".as_ptr(),
        Init: output_init,
        ThreadInit: output_thread_init,
        Write: output_write,
        ThreadDeinit: output_thread_deinit,
        Deinit: output_deinit,
        pad: [0, 0],
    };
    let file_type_ptr = Box::into_raw(Box::new(file_type));
    if !unsafe { ffi::SCRegisterEveFileType(file_type_ptr) } {
        log::error!("Failed to register PostgreSQL plugin");
    }
}

/// Plugin entrypoint, registers [`plugin_init`] function in Suricata
#[unsafe(no_mangle)]
extern "C" fn SCPluginRegister() -> *const SCPlugin {
    let plugin = SCPlugin {
        version: SC_API_VERSION,
        suricata_version: SC_PACKAGE_VERSION.as_ptr().cast::<c_char>(),
        name: c"Eve PostgreSQL Output".as_ptr(),
        plugin_version: c"0.1.0".as_ptr(),
        license: c"GPL-3.0".as_ptr(),
        author: c"Pwnzer0tt1".as_ptr(),
        Init: Some(plugin_init),
    };
    Box::into_raw(Box::new(plugin))
}
