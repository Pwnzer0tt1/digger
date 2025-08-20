-- CreateTable
CREATE TABLE "filedata" (
    "sha256" BYTEA NOT NULL,
    "blob" BYTEA NOT NULL,

    CONSTRAINT "filedata_pkey" PRIMARY KEY ("sha256")
);