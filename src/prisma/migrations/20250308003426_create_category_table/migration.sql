/*
  Warnings:

  - Added the required column `category_id` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "category_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image_uri" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
