// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use std::{thread, time};

use diesel::{Connection, ConnectionError, PgConnection, QueryResult, RunQueryDsl};
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};

use crate::{Stream, models::NewRaw, schema::raw};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

/// Add one stream to the SQL database
fn write_stream(
    conn: &mut PgConnection,
    stream: &Stream
) -> QueryResult<usize> {
    diesel::insert_into(raw::table)
        .values(NewRaw {
            flow_id: stream.flow_id,
            count: Some(stream.count),
            server_to_client: Some(stream.server_to_client),
            blob: Some(&stream.blob)
        })
        .on_conflict_do_nothing()
        .execute(conn)
}

pub struct Database {
    conn: PgConnection,
    rx: std::sync::mpsc::Receiver<Stream>,
    count: usize,
    count_inserted: usize
}

impl Database {
    pub fn new(
        url: String,
        rx: std::sync::mpsc::Receiver<Stream>
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
    
    fn batch_write_stream(&mut self) -> Result<(), diesel::result::Error> {
        while let Ok(stream) = self.rx.recv() {
            // Insert first stream
            self.count += 1;
            self.count_inserted += write_stream(&mut self.conn, &stream)?;
            
            // Insert remainig stream
            let batch = self
                .rx
                .try_iter()
                .map(|stream| write_stream(&mut self.conn, &stream))
                .collect::<Result<Vec<_>, _>>()?;
            self.count += batch.len();
            self.count_inserted += batch.iter().sum::<usize>();
        }
        Ok(())
    }
    
    /// Database thread entry
    pub fn run(&mut self) {
        log::debug!("Database thread started");
        if let Err(err) = self.batch_write_stream() {
            log::error!("Failed to write batch: {err:?}");
        }
        log::info!(
            "Database thread finished: count={} inserted={}",
            self.count,
            self.count_inserted
        )
    }
}