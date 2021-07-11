/*
  Warnings:

  - Added the required column `user_role` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `user_role` VARCHAR(20) NOT NULL;
