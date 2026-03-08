// @generated automatically by Diesel CLI.

diesel::table! {
    raw (id) {
        id -> Int4,
        flow_id -> Int8,
        count -> Nullable<Int4>,
        server_to_client -> Nullable<Int4>,
        blob -> Nullable<Bytea>,
    }
}
