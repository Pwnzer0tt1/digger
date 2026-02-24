# Build frontend stage
FROM node:22-alpine3.22 AS frontend

WORKDIR /frontend

COPY ./frontend/package*.json ./

RUN npm ci

COPY ./frontend .

RUN npm run build


# Build backend stage
FROM rust:1.87.0-alpine3.22 AS backend

WORKDIR /backend

RUN apk add --no-cache musl-dev libpq-dev

COPY ./backend/ .

RUN RUSTFLAGS="-C target-feature=-crt-static" cargo build --release


# Final stage
FROM alpine:3.22

RUN apk update
RUN apk add --no-cache libpq-dev libgcc

COPY --from=frontend /frontend/build /frontend/build
COPY --from=backend /backend/target/release/backend /backend/backend

EXPOSE 8000

CMD ["/backend/backend"]