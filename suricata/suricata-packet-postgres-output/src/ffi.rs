// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use std::ffi::{CStr, c_char, c_int, c_uint, c_void};


#[repr(C)]
#[derive(Debug, Copy, Clone)]
pub struct Packet {
    _opaque: [u8; 0]
}

pub const FLOW_PKT_TOCLIENT: u8 = 0x2;

pub type LoggerId = c_uint;
pub const LOGGER_USER: LoggerId = 26;
pub type PacketLogger = extern "C" fn(
    *mut *mut c_void, // ThreadVars *
    thread_data: *mut *mut c_void,
    p: *const Packet
) -> c_int;

pub type PacketLogCondition = extern "C" fn(
    *mut *mut c_void, // ThreadVars *
    thread_data: *mut *mut c_void,
    p: *const Packet
) -> bool;

extern "C" {
    pub fn get_flow_id(packet: *const Packet) -> u64;
    pub fn get_packet_payload_len(packet: *const Packet) -> u16;
    pub fn get_packet_payload(packet: *const Packet) -> *const u8;
    pub fn wrap_PKT_IS_TOCLIENT(packet: *const Packet) -> u8;
    pub fn wrap_PacketIsTCP(packet: *const Packet) -> bool;
    
    pub fn SCOutputRegisterPacketLogger(
        logger_id: LoggerId,
        name: *const c_char,
        LogFunc: PacketLogger,
        ConditionFunc: PacketLogCondition,
        initdata: *mut c_void,
        ThreadInit: extern "C" fn(*mut *mut c_void, *const *mut c_void, *mut *mut c_void) -> c_int,
        ThreadDeinit: extern "C" fn(*mut *mut c_void, *mut *mut c_void)
    ) -> c_int;
}