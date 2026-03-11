-- AlterTable
ALTER TABLE "subscription_import_sources"
    ADD COLUMN "last_upload_bytes"   BIGINT,
    ADD COLUMN "last_download_bytes" BIGINT,
    ADD COLUMN "last_total_bytes"    BIGINT,
    ADD COLUMN "last_expire_at"      TIMESTAMPTZ;
