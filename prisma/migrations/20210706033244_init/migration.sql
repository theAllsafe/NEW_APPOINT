-- AlterTable
ALTER TABLE `customers` ADD COLUMN `communication_email` VARCHAR(120),
    ADD COLUMN `fullname` VARCHAR(120),
    ADD COLUMN `phone_number` VARCHAR(15),
    ADD COLUMN `street_name` VARCHAR(100),
    ADD COLUMN `street_no` VARCHAR(120);
