# Copyright (C) 2023-2024  ANSSI
# SPDX-License-Identifier: CC0-1.0

# Modifications
# Copyright (C) 2025 Pwnzer0tt1
# This file has been modified from the original version.
# Licensed under GPL-3.0

# Plugins build stage
FROM rust:1.93-alpine3.23 AS builder

RUN apk update
RUN apk add --no-cache gcc musl-dev pkgconf pcre2-dev make jansson-dev libpcap-dev libcap-ng-dev libunwind-dev lz4-dev file-dev rust cargo

# Compile from source LibYAML because not found in Alpine registry
RUN wget http://pyyaml.org/download/libyaml/yaml-0.2.5.tar.gz -P /tmp
RUN tar xzvf /tmp/yaml-0.2.5.tar.gz
WORKDIR /yaml-0.2.5/
RUN ./configure
RUN make
RUN make install

# Build Suricata headers
WORKDIR /
RUN wget https://www.openinfosecfoundation.org/download/suricata-8.0.3.tar.gz -P /tmp
RUN tar xzvf /tmp/suricata-8.0.3.tar.gz
WORKDIR /suricata-8.0.3/
RUN ./configure

WORKDIR /src/

RUN apk update
RUN apk add --no-cache libpq-dev

COPY Cargo.lock Cargo.toml /src/
COPY suricata-eve-postgres-output/ /src/suricata-eve-postgres-output/
COPY suricata-filedata-postgres-output/ /src/suricata-filedata-postgres-output/
COPY suricata-stream-postgres-output/ /src/suricata-stream-postgres-output/
COPY suricata-packet-postgres-output/ /src/suricata-packet-postgres-output/

RUN RUSTFLAGS="-C target-feature=-crt-static" cargo build --release


# Last stage
FROM alpine:3.23
RUN apk update
RUN apk add --no-cache netcat-openbsd libpq-dev lua5.4-sql-postgres
RUN apk add --no-cache suricata --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

COPY . /suricata
COPY --from=builder /src/target/release/*.so /suricata/

ENTRYPOINT ["/suricata/entrypoint.sh"]