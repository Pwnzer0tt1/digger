-- CreateTable
CREATE TABLE "flow" (
    "id" BIGINT NOT NULL,
    "ts_start" BIGINT NOT NULL,
    "ts_end" BIGINT NOT NULL,
    "src_ip" TEXT NOT NULL,
    "src_port" INTEGER,
    "src_ipport" TEXT NOT NULL,
    "dest_ip" TEXT NOT NULL,
    "dest_port" INTEGER,
    "dest_ipport" TEXT NOT NULL,
    "proto" TEXT NOT NULL,
    "app_proto" TEXT,
    "data" BYTEA NOT NULL,

    CONSTRAINT "flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other_event" (
    "id" SERIAL NOT NULL,
    "flow_id" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "event_type" TEXT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "other_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert" (
    "id" SERIAL NOT NULL,
    "flow_id" BIGINT NOT NULL,
    "tag" TEXT,
    "color" TEXT,
    "timestamp" BIGINT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw" (
    "id" SERIAL NOT NULL,
    "flow_id" BIGINT NOT NULL,
    "count" INTEGER,
    "server_to_client" INTEGER,
    "blob" BYTEA,

    CONSTRAINT "raw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filedata" (
    "sha256" BYTEA NOT NULL,
    "blob" BYTEA NOT NULL,

    CONSTRAINT "filedata_pkey" PRIMARY KEY ("sha256")
);

-- CreateIndex
CREATE INDEX "flow_ts_start_idx" ON "flow"("ts_start");

-- CreateIndex
CREATE INDEX "flow_app_proto_idx" ON "flow"("app_proto");

-- CreateIndex
CREATE INDEX "flow_src_ipport_idx" ON "flow"("src_ipport");

-- CreateIndex
CREATE INDEX "flow_dest_ipport_idx" ON "flow"("dest_ipport");

-- CreateIndex
CREATE INDEX "other_event_flow_id_idx" ON "other_event"("flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "other_event_flow_id_event_type_timestamp_key" ON "other_event"("flow_id", "event_type", "timestamp");

-- CreateIndex
CREATE INDEX "alert_tag_idx" ON "alert"("tag");

-- CreateIndex
CREATE INDEX "alert_flow_id_idx" ON "alert"("flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "alert_flow_id_tag_key" ON "alert"("flow_id", "tag");

-- CreateIndex
CREATE INDEX "raw_flow_id_idx" ON "raw"("flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "raw_flow_id_count_key" ON "raw"("flow_id", "count");
