-- CreateTable
CREATE TABLE "raw" (
    "id" SERIAL NOT NULL,
    "flow_id" BIGINT NOT NULL,
    "count" INTEGER,
    "server_to_client" INTEGER,
    "blob" BYTEA,

    CONSTRAINT "raw_pkey" PRIMARY KEY ("id")
);