# Build stage
FROM rust:1.87.0-alpine3.22 AS builder

WORKDIR /src/

RUN apk add --no-cache musl-dev libpq-dev

COPY Cargo.lock Cargo.toml /src/
COPY suricata-eve-postgres-output/ /src/suricata-eve-postgres-output/
COPY suricata-filedata-postgres-output/ /src/suricata-filedata-postgres-output/

RUN RUSTFLAGS="-C target-feature=-crt-static" cargo build --release


# Last stage
FROM alpine:20250108
RUN apk update
RUN apk add --no-cache suricata netcat-openbsd libpq-dev lua5.4-sql-postgres

COPY . /suricata
COPY --from=builder /src/target/release/*.so /suricata/

ENTRYPOINT ["/suricata/entrypoint.sh"]