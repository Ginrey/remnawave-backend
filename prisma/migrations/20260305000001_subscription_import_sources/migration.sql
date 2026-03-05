-- CreateTable
CREATE TABLE "subscription_import_sources" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "url" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "fetch_interval_minutes" INTEGER NOT NULL DEFAULT 60,
    "config_profile_inbound_uuid" UUID,
    "last_fetched_at" TIMESTAMP(3),
    "last_fetch_status" VARCHAR(20),
    "last_fetch_error" TEXT,
    "last_hosts_count" INTEGER,
    "cached_raw_lines" TEXT[] NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "subscription_import_sources_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_import_sources_name_key" ON "subscription_import_sources"("name");

-- AddForeignKey
ALTER TABLE "subscription_import_sources" ADD CONSTRAINT "subscription_import_sources_config_profile_inbound_uuid_fkey" FOREIGN KEY ("config_profile_inbound_uuid") REFERENCES "config_profile_inbounds"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
