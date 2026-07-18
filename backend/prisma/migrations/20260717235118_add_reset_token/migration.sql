-- AlterTable
ALTER TABLE `users` ADD COLUMN `reset_token` VARCHAR(500) NULL,
    ADD COLUMN `reset_token_expiry` DATETIME(3) NULL;
