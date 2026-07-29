# Dev container for frontend
FROM node:24-alpine3.23 AS frontend-dev

WORKDIR /frontend
COPY ./frontend .
RUN rm -rf node_modules package-lock.json && npm i
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Dev container for backend
FROM rust:1.97-alpine3.23 AS backend-dev

WORKDIR /backend
RUN apk add --no-cache musl-dev libpq-dev watchexec
COPY ./backend .
EXPOSE 8000
ENV RUSTFLAGS="-C target-feature=-crt-static"
CMD ["watchexec", "-r", "-w", "src", "-e", "rs", "--", "cargo", "run"]

# Build frontend prod stage
FROM node:24-alpine3.23 AS frontend-prod

WORKDIR /frontend
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

# Build backend prod stage
FROM rust:1.97-alpine3.23 AS backend-prod

WORKDIR /backend
RUN apk add --no-cache musl-dev libpq-dev
COPY ./backend/ .
RUN RUSTFLAGS="-C target-feature=-crt-static" cargo build --release

# Final prod stage
FROM alpine:3.23 AS prod

RUN apk update
RUN apk add --no-cache libpq-dev libgcc

COPY --from=frontend-prod /frontend/build /frontend/build
COPY --from=backend-prod /backend/target/release/backend /backend/backend

EXPOSE 8000
CMD ["/backend/backend"]