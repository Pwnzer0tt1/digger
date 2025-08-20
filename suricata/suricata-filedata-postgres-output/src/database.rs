use std::{thread, time};

use crate::{models::NewFiledata, schema::filedata, Filedata};
use diesel::{Connection, ConnectionError, PgConnection, QueryResult, RunQueryDsl};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

/// Add one filedata payload to the SQL database
fn write_filedata(
    conn: &mut PgConnection,
    filedata: &Filedata,
) -> QueryResult<usize> {
    diesel::insert_into(filedata::table)
        .values(NewFiledata {
            sha256: filedata.sha256.to_vec(),
            blob: &filedata.blob
        })
        .on_conflict_do_nothing()
        .execute(conn)
}

pub struct Database {
    conn: PgConnection,
    rx: std::sync::mpsc::Receiver<Filedata>,
    count: usize,
    count_inserted: usize,
}

impl Database {
    pub fn new(
        url: String,
        rx: std::sync::mpsc::Receiver<Filedata>,
    ) -> Result<Self, ConnectionError> {
        // Lazy, wait for PostgreSQL container to start
        thread::sleep(time::Duration::from_secs(5));

        let mut conn = PgConnection::establish(&url)?;
        conn.run_pending_migrations(MIGRATIONS).unwrap();

        Ok(Self {
            conn,
            rx,
            count: 0,
            count_inserted: 0,
        })
    }

    fn batch_write_filedata(&mut self) -> Result<(), diesel::result::Error> {
        while let Ok(filedata) = self.rx.recv() {
            // Insert first filedata
            self.count += 1;
            self.count_inserted += write_filedata(&mut self.conn, &filedata)?;

            // Insert remaining filedata
            let batch = self
                .rx
                .try_iter()
                .map(|filedata| write_filedata(&mut self.conn, &filedata))
                .collect::<Result<Vec<_>, _>>()?;
            self.count += batch.len();
            self.count_inserted += batch.iter().sum::<usize>();
        }
        Ok(())
    }

    /// Database thread entry
    pub fn run(&mut self) {
        log::debug!("Database thread started");
        if let Err(err) = self.batch_write_filedata() {
            log::error!("Failed to write batch: {err:?}");
        }
        log::info!(
            "Database thread finished: count={} inserted={}",
            self.count,
            self.count_inserted
        );
    }
}