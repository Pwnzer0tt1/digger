// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

mod ffi;

use std::{collections::HashMap, ffi::{c_char, c_int, c_void}, slice, sync::mpsc};

use database::{models, schema, Database, OutputWriter};
use diesel::RunQueryDsl;
use suricata_sys::sys::{SC_API_VERSION, SC_PACKAGE_VERSION, SCPlugin};


// Default configuration values.
const DEFAULT_DATABASE_URI: &str = "postgresql://postgres@postgres:5432/postgres"; 
const DEFAULT_BUFFER_SIZE: &str = "1000";

#[derive(Debug, Clone)]
struct Config {
    db_url: String,
    buffer: usize
}

impl Config {
    fn new() -> Self {
        Self {
            db_url: std::env::var("DATABASE_URL").unwrap_or(DEFAULT_DATABASE_URI.into()),
            buffer: std::env::var("UDP_BUFFER")
                .unwrap_or(DEFAULT_BUFFER_SIZE.into())
                .parse()
                .expect("UDP_BUFFER is not an integer"),
        }
    }
}

struct Payload {
    flow_id: i64,
    count: i32,
    server_to_client: i32,
    blob: Vec<u8>
}

impl OutputWriter for Payload {
    fn write_output(&self, conn: &mut diesel::PgConnection) -> diesel::QueryResult<usize> {
        diesel::insert_into(schema::raw::table)
            .values(models::NewRaw {
                flow_id: self.flow_id,
                count: Some(self.count),
                server_to_client: Some(self.server_to_client),
                blob: Some(&self.blob)
            })
            .on_conflict_do_nothing()
            .execute(conn)
    }
}

struct Context {
    tx: mpsc::SyncSender<Payload>,
    flow_packet_counter: HashMap<i64, i32>
}

extern "C" fn packet_log(
    _thread_vars: *mut *mut c_void, // ThreadVars *
    thread_data: *mut *mut c_void,
    p: *const ffi::Packet
) -> c_int {
    // Handle FFI arguments
    let p = unsafe { p.as_ref() }.expect("null pkt pointer");
    // Get packet payload len
    let data_len = unsafe { ffi::get_packet_payload_len(p) };
    // Get packet payload pointer
    let data = unsafe { ffi::get_packet_payload(p) };
    let data_slice = if data.is_null() || data_len == 0 {
        &[]
    } else { 
        unsafe { slice::from_raw_parts(data, data_len as usize) }
    };
    
    let context = unsafe { thread_data.cast::<Context>().as_mut() }.expect("null thread_data pointer");
    
    // Get flow_id
    let flow_id = unsafe { ffi::get_flow_id(p) as i64 };
    let count = match context.flow_packet_counter.get_mut(&flow_id) {
        Some(count) => {
            *count += 1;
            *count
        },
        None => {
            context.flow_packet_counter.insert(flow_id, 0);
            0
        }
    };
    
    let direction = unsafe { ffi::wrap_PKT_IS_TOCLIENT(p) >> 1 };
    
    // Send packet payload to database thread
    let payload = Payload {
        flow_id,
        count,
        server_to_client: direction as i32,
        blob: data_slice.to_owned()
    };
    if let Err(err) = context.tx.send(payload) {
        panic!("Failed to send packet to database thread: {err:?}");
    }
    
    0
}

/// TCP traffic is managed by the streaming output plugin, packet output is used for UDP
extern "C" fn packet_condition(
    _thread_vars: *mut *mut c_void, // ThreadVars *
    _thread_data: *mut *mut c_void,
    p: *const ffi::Packet
) -> bool {
    unsafe { !ffi::wrap_PacketIsTCP(p) }
}

extern "C" fn packet_thread_init(
    _thread_vars: *mut *mut c_void, // ThreadVars *
    _initdata: *const *mut c_void,
    thread_data: *mut *mut c_void
) -> c_int {
    // Load configuration
    let config = Config::new();
    
    // Create thread context
    let (tx, rx) = mpsc::sync_channel(config.buffer);
    let mut database_client = match Database::new(config.db_url, rx) {
        Ok(client) => client,
        Err(err) => panic!("Failed to initialize database client: {err:?}")
    };
    std::thread::spawn(move || database_client.run());
    let context_ptr = Box::into_raw(Box::new(Context {
        tx,
        flow_packet_counter: HashMap::new(),
    }));
    
    unsafe {
        *thread_data = context_ptr.cast();
    }
    0
}

extern "C" fn packet_thread_deinit(
    _thread_vars: *mut *mut c_void,
    thread_data: *mut *mut c_void
) {
    let context = unsafe { Box::from_raw(thread_data.cast::<Context>()) };
    log::info!("PostgreSQL output finished");
    std::mem::drop(context);
}

extern "C" fn plugin_init() {
    // Init Rust logger
    // don't log using `suricata` crate to reduce build time.
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    
    // Register new TCP stream logger
    if !unsafe {
        ffi::SCOutputRegisterPacketLogger(
            ffi::LOGGER_USER,
            c"udp-postgres".as_ptr(),
            packet_log,
            packet_condition,
            std::ptr::null_mut(),
            packet_thread_init,
            packet_thread_deinit
        )
    } == 0
    {
        log::error!("Failed to register postgres plugin");
    }
}

/// Plugin entrypoint, registers [`plugin_init`] function in Suricata
#[no_mangle]
extern "C" fn SCPluginRegister() -> *const SCPlugin {
    let plugin = SCPlugin {
        version: SC_API_VERSION,
        suricata_version: SC_PACKAGE_VERSION.as_ptr().cast::<c_char>(),
        name: c"UDP packet data PostgreSQL Output".as_ptr(),
        plugin_version: c"0.1.0".as_ptr(),
        license: c"GPL-3.0".as_ptr(),
        author: c"Pwnzer0tt1".as_ptr(),
        Init: Some(plugin_init)
    };
    Box::into_raw(Box::new(plugin))
}