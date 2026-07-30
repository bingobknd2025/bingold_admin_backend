-- =====================================================================
-- Investor company registration details — schema migration
-- =====================================================================
-- Adds the company profile collected on the investor-ui /company-documents
-- step. All columns are nullable at the DB level because one table serves both
-- individual and company registrations; the required/optional rules are
-- enforced in investor-registration.service.js.
--
-- Idempotent — safe to re-run.
--   node src/scripts/migrate-investor-registrations.js
-- =====================================================================

SET @t := 'temporary_investor_registrations';

-- legal_company_name
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'legal_company_name') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `legal_company_name` VARCHAR(150) NULL AFTER `ref_code`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- trading_name (optional)
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'trading_name') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `trading_name` VARCHAR(150) NULL AFTER `legal_company_name`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- legal_entity_type
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'legal_entity_type') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `legal_entity_type` VARCHAR(100) NULL AFTER `trading_name`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- country_of_incorporation
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'country_of_incorporation') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `country_of_incorporation` VARCHAR(100) NULL AFTER `legal_entity_type`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- registration_number
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'registration_number') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `registration_number` VARCHAR(50) NULL AFTER `country_of_incorporation`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- tax_identification_number
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'tax_identification_number') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `tax_identification_number` VARCHAR(50) NULL AFTER `registration_number`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- date_of_incorporation
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'date_of_incorporation') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `date_of_incorporation` DATE NULL AFTER `tax_identification_number`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- industry
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'industry') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `industry` VARCHAR(150) NULL AFTER `date_of_incorporation`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- business_description
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'business_description') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `business_description` TEXT NULL AFTER `industry`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- company_website (optional)
SET @sql := IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @t
      AND COLUMN_NAME = 'company_website') = 0,
  'ALTER TABLE `temporary_investor_registrations` ADD COLUMN `company_website` VARCHAR(200) NULL AFTER `business_description`',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;
