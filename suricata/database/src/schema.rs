// @generated automatically by Diesel CLI.

diesel::table! {
    alert (id) {
        id -> Int4,
        flow_id -> Int8,
        tag -> Nullable<Text>,
        color -> Nullable<Text>,
        timestamp -> Int8,
        data -> Bytea,
    }
}

diesel::table! {
    filedata (sha256) {
        sha256 -> Bytea,
        blob -> Bytea,
    }
}

diesel::table! {
    flow (id) {
        id -> Int8,
        ts_start -> Int8,
        ts_end -> Int8,
        src_ip -> Text,
        src_port -> Nullable<Int4>,
        src_ipport -> Text,
        dest_ip -> Text,
        dest_port -> Nullable<Int4>,
        dest_ipport -> Text,
        proto -> Text,
        app_proto -> Nullable<Text>,
        data -> Bytea,
    }
}

diesel::table! {
    other_event (id) {
        id -> Int4,
        flow_id -> Int8,
        timestamp -> Int8,
        event_type -> Text,
        data -> Bytea,
    }
}

diesel::table! {
    raw (id) {
        id -> Int4,
        flow_id -> Int8,
        count -> Nullable<Int4>,
        server_to_client -> Nullable<Int4>,
        blob -> Nullable<Bytea>,
    }
}

diesel::table! {
    stats (id) {
        id -> Int4,
        timestamp -> Int8,
        data -> Bytea,
    }
}

diesel::allow_tables_to_appear_in_same_query!(alert, filedata, flow, other_event, raw, stats,);
