/*
  Warnings:

  - Added the required column `updated` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;
