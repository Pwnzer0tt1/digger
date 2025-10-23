use diesel::{r2d2::{self, ConnectionManager, Pool}, PgConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};


const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn init() -> Pool<ConnectionManager<diesel::PgConnection>> {
    // Create Postgres connection
    let database_url = String::from("postgresql://postgres@postgres:5432/postgres");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder().build(manager).expect("Failed to create database connection pool.");
    {
        let mut conn = pool.get().expect("Couldn't get database connection from pool.");
        conn.run_pending_migrations(MIGRATIONS).unwrap();
    }

    pool
}