-- =====================================================================
-- Vendor SSO + KYC flow — schema migration
-- =====================================================================
-- The live DB is a production dump; Sequelize sync({alter:true}) crashes
-- against it, so this DDL is applied MANUALLY (never by the app).
--
-- Idempotent: each ADD COLUMN is guarded against information_schema so
-- re-running is a no-op. Apply with:
--   mysql -u<user> -p <db_name> < src/migrations/2026-06-15_vendor_sso.sql
-- =====================================================================

-- Reusable guard: add a column only if it does not already exist.
DROP PROCEDURE IF EXISTS bg_add_column;
DELIMITER //
CREATE PROCEDURE bg_add_column(
  IN p_table  VARCHAR(64),
  IN p_column VARCHAR(64),
  IN p_def    VARCHAR(512)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table
      AND COLUMN_NAME = p_column
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_def);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

-- ---- vendor_profiles -------------------------------------------------
CALL bg_add_column('vendor_profiles', 'uuid',          'CHAR(36) NULL AFTER `id`');
CALL bg_add_column('vendor_profiles', 'shop_name',     'VARCHAR(255) NULL AFTER `business_name`');
CALL bg_add_column('vendor_profiles', 'shop_slug',     'VARCHAR(255) NULL AFTER `shop_name`');
CALL bg_add_column('vendor_profiles', 'support_email', 'VARCHAR(255) NULL AFTER `website`');
CALL bg_add_column('vendor_profiles', 'support_phone', 'VARCHAR(50) NULL AFTER `support_email`');
CALL bg_add_column('vendor_profiles', 'description',   'TEXT NULL AFTER `support_phone`');
CALL bg_add_column('vendor_profiles', 'kyc_decision',  'JSON NULL AFTER `rejection_reason`');

-- Backfill a uuid for any pre-existing vendor rows, then enforce uniqueness.
UPDATE `vendor_profiles` SET `uuid` = (SELECT UUID()) WHERE `uuid` IS NULL;

-- Unique indexes (guarded — IGNORE the duplicate-key-name error on re-run).
SET @idx_uuid := (SELECT COUNT(1) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vendor_profiles' AND INDEX_NAME = 'uniq_vendor_profiles_uuid');
SET @sql := IF(@idx_uuid = 0,
  'ALTER TABLE `vendor_profiles` ADD UNIQUE INDEX `uniq_vendor_profiles_uuid` (`uuid`)',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @idx_slug := (SELECT COUNT(1) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vendor_profiles' AND INDEX_NAME = 'uniq_vendor_profiles_shop_slug');
SET @sql := IF(@idx_slug = 0,
  'ALTER TABLE `vendor_profiles` ADD UNIQUE INDEX `uniq_vendor_profiles_shop_slug` (`shop_slug`)',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- ---- bingopay_users --------------------------------------------------
CALL bg_add_column('bingopay_users', 'password_hash', 'VARCHAR(255) NULL AFTER `phone`');
-- Shared identity UUID issued by BinGold (same value as vendor_profiles.uuid).
CALL bg_add_column('bingopay_users', 'uuid', 'CHAR(36) NULL AFTER `id`');

SET @idx_bu_uuid := (SELECT COUNT(1) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bingopay_users' AND INDEX_NAME = 'uniq_bingopay_users_uuid');
SET @sql := IF(@idx_bu_uuid = 0,
  'ALTER TABLE `bingopay_users` ADD UNIQUE INDEX `uniq_bingopay_users_uuid` (`uuid`)',
  'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- ---- vendor_kyc_documents -------------------------------------------
CALL bg_add_column('vendor_kyc_documents', 'public_id', 'VARCHAR(255) NULL AFTER `file_url`');

DROP PROCEDURE IF EXISTS bg_add_column;

-- ---- vendor_sso_tokens (QR / SSO handoff token lifecycle) -----------
CREATE TABLE IF NOT EXISTS `vendor_sso_tokens` (
  `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `vendor_id`            BIGINT UNSIGNED NOT NULL,
  `token`                VARCHAR(128) NOT NULL,
  `status`               ENUM('pending','used','expired') NOT NULL DEFAULT 'pending',
  `redirect_url`         VARCHAR(500) NULL,
  `scanned_by_user_uuid` VARCHAR(36) NULL,
  `expires_at`           DATETIME NOT NULL,
  `used_at`              DATETIME NULL,
  `created_at`           DATETIME NOT NULL,
  `updated_at`           DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_vendor_sso_tokens_token` (`token`),
  KEY `idx_vendor_sso_tokens_vendor` (`vendor_id`),
  KEY `idx_vendor_sso_tokens_status` (`status`),
  CONSTRAINT `fk_vendor_sso_tokens_vendor`
    FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
