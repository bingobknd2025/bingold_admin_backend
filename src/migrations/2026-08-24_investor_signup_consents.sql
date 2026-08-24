-- =====================================================================
-- Investor signup consents — schema migration
-- =====================================================================
-- Adds the two consents collected on the investor-ui signup form:
--
--   terms_accepted     — Terms & Conditions + Privacy Policy. Required to
--                        submit the form.
--   marketing_opt_in   — product/promotional email. Optional and never
--                        pre-ticked, so 0 means "do not email".
--
-- Both carry the moment they were given (stamped server-side by the
-- investor-ui route handler, never by the browser) and the wording version they
-- were given under. The IP and the exact sentences shown are kept in
-- meta.consent, which needs no DDL — meta is already JSON.
--
-- Existing rows predate the consent UI: they land on the 0 / NULL defaults,
-- which correctly reads as "no consent on record" rather than a false positive.
--
-- Idempotent — safe to re-run.
--   node src/scripts/migrate-investor-registrations.js
-- =====================================================================

SET @t := 'temporary_investor_registrations';

-- terms_accepted
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'terms_accepted') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `terms_accepted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `company_website`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- terms_accepted_at
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'terms_accepted_at') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `terms_accepted_at` DATETIME NULL AFTER `terms_accepted`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- marketing_opt_in
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'marketing_opt_in') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `marketing_opt_in` TINYINT(1) NOT NULL DEFAULT 0 AFTER `terms_accepted_at`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- marketing_opt_in_at
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'marketing_opt_in_at') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `marketing_opt_in_at` DATETIME NULL AFTER `marketing_opt_in`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- consent_version
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'consent_version') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `consent_version` VARCHAR(20) NULL AFTER `marketing_opt_in_at`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- Index on the opt-in, so pulling the mailing audience out of a large table
-- does not become a full scan.
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND INDEX_NAME = 'idx_temporary_investor_registrations_marketing_opt_in') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD INDEX `idx_temporary_investor_registrations_marketing_opt_in` (`marketing_opt_in`)',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
