/*
  Warnings:

  - Added the required column `instructions` to the `recipe` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `ingredients` on the `recipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "instructions" TEXT NOT NULL,
DROP COLUMN "ingredients",
ADD COLUMN     "ingredients" JSONB NOT NULL;
