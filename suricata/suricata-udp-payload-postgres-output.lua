-- Copyright (C) 2024  ANSSI
-- Copyright (C) 2025  A. Iooss
-- SPDX-License-Identifier: GPL-2.0-or-later
-- Modified by Pwnzer0tt1

-- This Suricata plugin logs UDP frames data to a PostgreSQL database.

local config = require("suricata.config")
local flow = require("suricata.flow")
local logger = require("suricata.log")
local packet = require("suricata.packet")

function init (args)
    local needs = {}
    needs["type"] = "packet"
    return needs
end

function setup (args)
    logger.notice("Initializing plugin UDP payload PostgreSQL Output")

    -- Open database connection
    luasql = require("luasql.postgres")
    env = assert(luasql.postgres())
    con = assert(env:connect("postgres", "postgres", "", "postgres"))

    -- packer counter for each flow
    flow_pkt_count = {}
    flow_pkt_count_total = 0
end

encode_bytea = function(str)
  return string.format("%s", str:gsub('.', function(byte)
    return string.format('%02x', string.byte(byte))
  end))
end

function log (args)
    local p = packet.get()
    local f = flow.get()

    -- drop if not UDP (17)
    -- https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
    local ipver, srcip, dstip, proto, sp, dp = p:tuple()
    if proto ~= 17 then
        return
    end

    -- get packet direction
    local ipver, srcip_flow, dstip_flow, proto, sp_flow, dp_flow = f:tuple()
    local direction = 1
    if srcip == srcip_flow and dstip == dstip_flow and sp == sp_flow and dp == dp_flow then
        direction = 0
    end

    -- create log entry
    local flow_id = f:id()
    if flow_pkt_count[flow_id] == nil then
        flow_pkt_count[flow_id] = 0
    else
        flow_pkt_count[flow_id] = flow_pkt_count[flow_id] + 1
    end
    local count = flow_pkt_count[flow_id]
    flow_pkt_count_total = flow_pkt_count_total + 1
    local data = p:payload()
    if #data == 0 then
        return
    end
    
    assert(con:execute(string.format([[INSERT INTO raw (flow_id, count, server_to_client, blob) VALUES (%s, %s, %s, decode('%s', 'hex')) ON CONFLICT (id) DO NOTHING;]], flow_id, count, direction, encode_bytea(data))))
end

function deinit (args)
    logger.notice("UDP payloads logged: " .. flow_pkt_count_total)
    con:close()
    env:close()
end