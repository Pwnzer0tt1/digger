# Copyright (C) 2023-2024  ANSSI
# SPDX-License-Identifier: CC0-1.0

# Modifications
# Copyright (C) 2025 Pwnzer0tt1
# This file has been modified from the original version.
# Licensed under GPL-3.0

# Build stage
FROM rust:1.87.0-alpine3.22 AS builder

WORKDIR /src/

RUN apk add --no-cache musl-dev libpq-dev

COPY Cargo.lock Cargo.toml /src/
COPY suricata-eve-postgres-output/ /src/suricata-eve-postgres-output/
COPY suricata-filedata-postgres-output/ /src/suricata-filedata-postgres-output/
COPY suricata-stream-postgres-output/ /src/suricata-stream-postgres-output/

RUN RUSTFLAGS="-C target-feature=-crt-static" cargo build --release


# Last stage
FROM alpine:3.23
RUN apk update
RUN apk add --no-cache netcat-openbsd libpq-dev lua5.4-sql-postgres
RUN apk add --no-cache suricata --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

COPY . /suricata
COPY --from=builder /src/target/release/*.so /suricata/

ENTRYPOINT ["/suricata/entrypoint.sh"]