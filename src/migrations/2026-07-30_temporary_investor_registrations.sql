-- =====================================================================
-- Temporary investor registrations — schema migration
-- =====================================================================
-- Backs the investor-ui (ICO) signup capture. The investor backend is external
-- and unchangeable, so the account type chosen at signup and the company
-- registration documents uploaded after OTP verification are stored here,
-- correlated by email.
--
-- The live DB is a production dump; Sequelize sync({alter:true}) crashes against
-- it, so this DDL is applied MANUALLY. Idempotent — safe to re-run.
--   mysql -u<user> -p <db_name> < src/migrations/2026-07-30_temporary_investor_registrations.sql
--   (or: node src/scripts/migrate-investor-registrations.js)
-- =====================================================================

CREATE TABLE IF NOT EXISTS `temporary_investor_registrations` (
  `id`                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`                  VARCHAR(255) NOT NULL,
  `account_type`           ENUM('individual','company') NOT NULL DEFAULT 'individual',
  `first_name`             VARCHAR(100) NULL,
  `last_name`              VARCHAR(100) NULL,
  `phone`                  VARCHAR(50) NULL,
  `country`                VARCHAR(100) NULL,
  `ref_code`               VARCHAR(100) NULL,
  `status`                 ENUM('PENDING_OTP','PENDING_DOCUMENTS','DOCS_SUBMITTED','COMPLETED')
                             NOT NULL DEFAULT 'PENDING_OTP',
  `documents`              JSON NULL,
  `documents_submitted_at` DATETIME NULL,
  `source`                 VARCHAR(50) NOT NULL DEFAULT 'investor-ui',
  `meta`                   JSON NULL,
  `created_at`             DATETIME NOT NULL,
  `updated_at`             DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_temporary_investor_registrations_email` (`email`),
  KEY `idx_temporary_investor_registrations_account_type` (`account_type`),
  KEY `idx_temporary_investor_registrations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
