-- =====================================================================
-- BingoPay pending registrations — schema migration
-- =====================================================================
-- Backs the OTP-gated onboarding flow: a row is created at /register (when the
-- OTP + welcome mail are sent) and deleted at /verify-otp (once the BinGold
-- identity is created via register_user). The password is stored encrypted
-- (AES-256-GCM) because verify-otp must forward it to register_user.
--
-- The live DB is a production dump; Sequelize sync({alter:true}) crashes against
-- it, so this DDL is applied MANUALLY. Idempotent — safe to re-run.
--   mysql -u<user> -p <db_name> < src/migrations/2026-06-24_pending_registrations.sql
--   (or: node src/scripts/migrate-pending-registrations.js)
-- =====================================================================

CREATE TABLE IF NOT EXISTS `bingopay_pending_registrations` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`        VARCHAR(255) NOT NULL,
  `account_type` ENUM('customer','vendor') NOT NULL DEFAULT 'customer',
  `first_name`   VARCHAR(100) NULL,
  `last_name`    VARCHAR(100) NULL,
  `phone`        VARCHAR(50) NULL,
  `country_id`   VARCHAR(10) NULL,
  `password_enc` TEXT NOT NULL,
  `otp_type`     VARCHAR(50) NOT NULL DEFAULT 'SIGNUP',
  `payload`      JSON NULL,
  `expires_at`   DATETIME NULL,
  `created_at`   DATETIME NOT NULL,
  `updated_at`   DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_bingopay_pending_registrations_email` (`email`),
  KEY `idx_bingopay_pending_registrations_account_type` (`account_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
