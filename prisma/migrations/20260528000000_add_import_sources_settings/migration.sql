ALTER TABLE "subscription_settings" ADD COLUMN "import_sources_settings" JSONB;

UPDATE "subscription_settings"
SET "import_sources_settings" = '{
  "xrayJson": {
    "autoStrategy": "random",
    "manualStrategy": "random",
    "autoProbeUrl": "http://www.gstatic.com/generate_204",
    "autoProbeInterval": "2m",
    "autoSortEnabled": true,
    "inactiveUserFallbackMode": "customRemarks"
  }
}'::jsonb
WHERE "import_sources_settings" IS NULL;
