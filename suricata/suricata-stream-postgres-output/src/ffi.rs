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

/// VLAN max encapsulation layer count/index
pub const VLAN_MAX_LAYERS: usize = 3;

#[repr(C)]
union FlowAddress {
    address_un_data32: [u32; 4],
    address_un_data16: [u16; 8],
    address_un_data8: [u8; 16]
}

type Port = u16;

#[repr(C)]
#[derive(Debug, Clone, Copy)]
struct Icmp_s {
    r#type: u8,
    code: u8
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
struct Esp {
    spi: u32
}

#[repr(C)]
union Sp {
    sp: Port,
    icmp_s: Icmp_s,
    esp: Esp
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
struct Icmp_d {
    r#type: u8,
    code: u8
}

#[repr(C)]
union Dp {
    dp: Port,
    icmp_d: Icmp_d
}

/// Local Thread ID
type FlowThreadId = u16;

/// The C code uses a struct with two bit fields of 44-bits (seconds) and 20-bits (microseconds), this means the memory size used is 64-bits
/// ```c
/// typedef struct {
///     uint64_t secs : 44;
///     uint64_t usecs : 20;
/// } SCTime_t;
/// ```
#[repr(C)]
pub struct SCTime(u64);

impl SCTime {
    pub fn secs(&self) -> u64 {
        self.0 & 0xfffffffffff
    }
    
    pub fn usecs(&self) -> u64 {
        self.0 >> 44
    }
}

type FlowStateType = c_ushort; // unsigned short

/// The only implementation used at the moment is the one for x86_64 architecture.
/// Use definition of pthread_mutex_t on musl-dev used on Alpine Linux https://git.musl-libc.org/cgit/musl/tree/arch
/// The real C implementation uses a struct with a union field, for this Rust implementation the only important thigs is to have the proper offsets in the `Flow` struct, this means we only need a type with the same size.
///
/// Definition taken from musl-dev `bits/alltypes.h` for x86_64 architecture:
/// ```c
/// typedef struct { 
///     union { 
///         int __i[sizeof(long)==8?10:6];
///         volatile int __vi[sizeof(long)==8?10:6];
///         volatile void *volatile __p[sizeof(long)==8?5:6]; 
///     } __u; 
/// } pthread_mutex_t;
/// ```
struct PthreadMutexT {
    __u: [c_int; if size_of::<c_long>() == 8 { 10 } else { 6 }]
}
type SCMutex = PthreadMutexT;

type AppProto = u16;

/// Rust representation of `suricata/src/flow.h` `Flow` struct
#[repr(C)]
pub struct Flow {
    src: FlowAddress,
    dst: FlowAddress,
    sp: Sp,
    dp: Dp,
    proto: u8,
    recursion_level: u8,
    vlan_id: [u16; VLAN_MAX_LAYERS],
    vlan_idx: u8,
    ffr: u8, // The C code uses a union between a struct with two bit fields 4-bits and a u8, this means the memory size used is 8-bits
    thread_id: [FlowThreadId; 2],
    pub flow_hash: u32,
    livedev: *mut c_void, // The C code contains a pointer to `LiveDevice` struct
    next: *mut Flow, // Pointer to a Flow struct
    flags: u64,
    file_flags: u16,
    protodetect_dp: u16,
    timeout_policy: u32,
    lastts: SCTime,
    flow_state: FlowStateType,
    tenant_id: u32,
    probing_parser_toserver_alproto_masks: u32,
    probing_parser_toclient_alproto_masks: u32,
    parent_id: i64,
    protoctx: *mut c_void,
    m: SCMutex, 
    protomap: u8,
    flow_end_flags: u8,
    alproto: AppProto,
    alproto_ts: AppProto,
    alproto_tc: AppProto,
    alproto_orig: AppProto,
    alproto_expect: AppProto,
    de_ctx_version: u32,
    min_ttl_toserver: u8,
    max_ttl_toserver: u8,
    min_ttl_toclient: u8,
    max_ttl_toclient: u8,
    applied_exception_policy: u8,
    alparser: *mut c_void, // The C code contains a pointer to `AppLayerParserState` type
    alstate: *mut c_void,
    sgh_toclient: *mut c_void, // The C code contains a pointer to `SigGroupHead` const struct
    sgh_toserver: *mut c_void, // The C code contains a pointer to `SigGroupHead` const struct
    flowvar: *mut c_void, // The C code contains a pointer to `GenericVar` type
    fb: *mut c_void, // The C code contains a pointer to `FlowBucket` struct
    pub startts: SCTime,
    todstpktcnt: u32,
    tosrcpktcnt: u32,
    todstbytecnt: u64,
    tosrcbytecnt: u64,
    storage: [*mut c_void; 0] // The C code contains a flexible array member `Storage storage[]`
}

/// Rust implementation of suricata/src/flow.h static inline `FlowGetId` function
/// ```c
/// static inline uint64_t FlowGetId(const Flow *f)
/// {
///     uint64_t id = (uint64_t)(SCTIME_SECS(f->startts) & 0xFFFF) << 48 |
///                   (uint64_t)(SCTIME_USECS(f->startts) & 0xFFFF) << 32 | (uint64_t)f->flow_hash;
///     /* reduce to 51 bits as JavaScript and even JSON often seem to
///      * max out there. */
///     id &= 0x7ffffffffffffLL;
///     return id;
/// }
/// ```
pub fn flow_get_id(f: Flow) -> u64 {
    let mut id: u64 = (f.startts.secs() & 0xFFFF) << 48 | (f.startts.usecs() & 0xFFFF) << 32 | f.flow_hash as u64;
    id &= 0x7ffffffffffff;
    id
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