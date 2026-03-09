// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use std::{thread, time};

use diesel::{Connection, ConnectionError, PgConnection, QueryResult, RunQueryDsl};
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};

use crate::{Payload, models::NewRaw, schema::raw};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

// Add one packet to the SQL database
fn write_packet(
    conn: &mut PgConnection,
    payload: &Payload
) -> QueryResult<usize> {
    diesel::insert_into(raw::table)
        .values(NewRaw {
            flow_id: payload.flow_id,
            count: Some(payload.count),
            server_to_client: Some(payload.server_to_client),
            blob: Some(&payload.blob)
        })
        .on_conflict_do_nothing()
        .execute(conn)
}

pub struct Database {
    conn: PgConnection,
    rx: std::sync::mpsc::Receiver<Payload>,
    count: usize,
    count_inserted: usize
}

impl Database {
    pub fn new(
        url: String,
        rx: std::sync::mpsc::Receiver<Payload>
    ) -> Result<Self, ConnectionError> {
        // Lazy, wait for PostgreSQL container to start
        thread::sleep(time::Duration::from_secs(5));
        
        let mut conn = PgConnection::establish(&url)?;
        conn.run_pending_migrations(MIGRATIONS).unwrap();
        
        Ok(Self {
            conn,
            rx,
            count: 0,
            count_inserted: 0
        })
    }
    
    fn batch_write_packet(&mut self) -> Result<(), diesel::result::Error> {
        while let Ok(payload) = self.rx.recv() {
            // Insert first payload
            self.count += 1;
            self.count_inserted += write_packet(&mut self.conn, &payload)?;
            
            // Insert remainig payload
            let batch = self
                .rx
                .try_iter()
                .map(|payload| write_packet(&mut self.conn, &payload))
                .collect::<Result<Vec<_>, _>>()?;
            self.count += batch.len();
            self.count_inserted += batch.iter().sum::<usize>();
        }
        Ok(())
    }
    
    /// Database thread entry
    pub fn run(&mut self) {
        log::debug!("Database thread started");
        if let Err(err) = self.batch_write_packet() {
            log::error!("Failed to write batch: {err:?}");
        }
        log::info!(
            "Database thread finished: count={} inserted={}",
            self.count,
            self.count_inserted
        )
    }
}