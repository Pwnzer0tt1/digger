// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

#include "decode.h"
#include "flow.h"
#include <stdint.h>


uint64_t get_flow_id(const Packet *p) {
    return FlowGetId(p->flow);
}

uint16_t get_packet_payload_len(const Packet *p) {
    return p->payload_len;
}

uint8_t *get_packet_payload(const Packet *p) {
    return p->payload;
}

uint8_t wrap_PKT_IS_TOCLIENT(const Packet *p) {
    return PKT_IS_TOCLIENT(p);
}

bool wrap_PacketIsTCP(const Packet *p) {
    return PacketIsTCP(p);
}