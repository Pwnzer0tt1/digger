// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use std::ffi::{CStr, c_char, c_int, c_long, c_uint, c_ushort, c_void};

// Bindings for Suricata 8.0.0
pub const SC_PACKAGE_VERSION: &CStr = c"8.0.0";
pub const SC_API_VERSION: u64 = 0x0800;

/// Rust representation of a C plugin.
#[repr(C)]
#[allow(non_snake_case)]
pub struct SCPlugin {
    pub version: u64,
    pub suricata_version: *const c_char,
    pub name: *const c_char,
    pub plugin_version: *const c_char,
    pub license: *const c_char,
    pub author: *const c_char,
    pub Init: extern "C" fn()
}

#[repr(C)]
pub struct Flow {
    _opaque: [u8; 0]
}

pub type LoggerId = c_uint;
pub const LOGGER_USER: LoggerId = 27;
pub type SCStreamingLogger = extern "C" fn(
    *mut *mut c_void, // ThreadVars *
    thread_data: *mut *mut c_void,
    f: *const Flow, // Flow *
    data: *const u8,
    data_len: u32,
    tx_id: u64,
    flags: u8
) -> c_int;

#[repr(C)]
pub enum SCOutputStreamingType {
    StreamingTcpData = 0,
    StreamingHttpBodies = 1
}

extern "C" {
    pub fn wrap_FlowGetId(flow: *const Flow) -> u64;
    
    pub fn SCOutputRegisterStreamingLogger(
        logger_id: LoggerId,
        name: *const c_char,
        LogFunc: SCStreamingLogger,
        initdata: *mut c_void,
        stream_type: SCOutputStreamingType,
        ThreadInit: extern "C" fn(*mut *mut c_void, *const *mut c_void, *mut *mut c_void) -> c_int,
        ThreadDeinit: extern "C" fn(*mut *mut c_void, *mut *mut c_void)
    ) -> c_int;
}