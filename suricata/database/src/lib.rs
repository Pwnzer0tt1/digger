// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

use std::{sync::mpsc, thread, time};

use diesel::{Connection, ConnectionError, PgConnection, QueryResult};
use diesel_migrations::{EmbeddedMigrations, MigrationHarness, embed_migrations};

pub mod schema;
pub mod models;


const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub trait OutputWriter {
    fn write_output(&self, conn: &mut PgConnection) -> QueryResult<usize>;
}

pub struct Database<T> {
    conn: PgConnection,
    rx: mpsc::Receiver<T>,
    count: usize,
    count_inserted: usize
}

impl<T: OutputWriter> Database<T> {
    /// Open Postgres database connection
    pub fn new(
        url: String, 
        rx: mpsc::Receiver<T>
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
    
    fn batch_write_output(&mut self) -> Result<(), diesel::result::Error> {
        while let Ok(buf) = self.rx.recv() {
            // Insert first event
            self.count += 1;
            self.count_inserted += buf.write_output(&mut self.conn)?;
            
            // Insert remaining events
            let batch = self
                .rx
                .try_iter()
                .map(|buf| buf.write_output(&mut self.conn))
                .collect::<Result<Vec<_>, _>>()?;
            self.count += batch.len();
            self.count_inserted += batch.iter().sum::<usize>();
        }
        Ok(())
    }
    
    /// Database thread entry
    pub fn run(&mut self) {
        log::debug!("Database thread started");
        if let Err(err) = self.batch_write_output() {
            log::error!("Failed to write batch of outputs: {err:?}");
        }
        log::info!(
            "Database thread finished: count={} inserted={}",
            self.count,
            self.count_inserted
        );
    }
}