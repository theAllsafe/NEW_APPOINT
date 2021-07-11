-- AlterTable
ALTER TABLE `customers` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `date_of_birth` DATETIME(3),
    ADD COLUMN `facebook_url` VARCHAR(191),
    ADD COLUMN `gender` VARCHAR(12),
    ADD COLUMN `instagram_url` VARCHAR(191),
    ADD COLUMN `linkedin_url` VARCHAR(191),
    ADD COLUMN `pincode` INTEGER,
    ADD COLUMN `state` VARCHAR(100),
    ADD COLUMN `suburb` VARCHAR(120),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `youtube_url` VARCHAR(191);
