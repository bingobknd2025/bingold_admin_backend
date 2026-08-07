-- =====================================================================
-- Contact requests ("contact us" tickets) — schema migration
-- =====================================================================
-- Backs the public contact form. Submissions arrive on an UNAUTHENTICATED
-- endpoint (POST /api/bingold/contact) and are listed + status-managed in the
-- admin panel. All correspondence happens outside the system.
--
-- The live DB is a production dump; Sequelize sync({alter:true}) crashes against
-- it, so this DDL is applied MANUALLY. Idempotent — safe to re-run.
--   mysql -u<user> -p <db_name> < src/migrations/2026-08-07_contact_requests.sql
--   (or: node src/scripts/migrate-contact-requests.js)
-- =====================================================================

CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_ref`  VARCHAR(30)  NOT NULL,
  `name`        VARCHAR(150) NOT NULL,
  `email`       VARCHAR(255) NOT NULL,
  `subject`     VARCHAR(255) NOT NULL,
  `message`     TEXT         NOT NULL,
  `status`      ENUM('NEW','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
  `admin_note`  TEXT         NULL,
  `source`      VARCHAR(50)  NOT NULL DEFAULT 'website',
  `ip_address`  VARCHAR(45)  NULL,
  `user_agent`  VARCHAR(255) NULL,
  `resolved_at` DATETIME     NULL,
  `resolved_by` INT          NULL,
  `created_at`  DATETIME     NOT NULL,
  `updated_at`  DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_contact_requests_ticket_ref` (`ticket_ref`),
  KEY `idx_contact_requests_status` (`status`),
  KEY `idx_contact_requests_email` (`email`),
  KEY `idx_contact_requests_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
