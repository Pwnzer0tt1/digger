// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use std::ffi::{CStr, c_char, c_int, c_uint, c_void};

use suricata_sys::sys::Flow;


pub const OUTPUT_STREAMING_FLAG_TO_CLIENT: u8 = 0x8;

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