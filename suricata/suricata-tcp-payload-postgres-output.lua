-- This Suricata plugin logs TCP flows data to a PostgreSQL database.

local config = require("suricata.config")
local flow = require("suricata.flow")
local logger = require("suricata.log")

function init (args)
    return {streaming = "tcp"}
end

function setup (args)
    logger.notice("Initializing plugin TCP payload PostgreSQL Output")

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
    local data = args["stream"]["data"]
    local toclient = args["stream"]["to_client"]
    local f = flow.get()

    -- create log entry
    local flow_id = f:id()
    if flow_pkt_count[flow_id] == nil then
        flow_pkt_count[flow_id] = 0
    else
        flow_pkt_count[flow_id] = flow_pkt_count[flow_id] + 1
    end
    local count = flow_pkt_count[flow_id]
    flow_pkt_count_total = flow_pkt_count_total + 1

    if #data == 0 then
        return
    end
    local direction = 0
    if toclient then
        direction = 1
    end

    assert(con:execute(string.format([[INSERT INTO raw (flow_id, count, server_to_client, blob) VALUES (%s, %s, %s, decode('%s', 'hex')) ON CONFLICT (id) DO NOTHING;]], flow_id, count, direction, encode_bytea(data))))
end

function deinit (args)
    logger.notice("TCP payloads logged: " .. flow_pkt_count_total)
    con:close()
    env:close()
end